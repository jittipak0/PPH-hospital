const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

let dbInstance;

const createDirectories = () => {
  const dir = path.dirname(config.sqlitePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const initializeSchema = (db) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      accepted_privacy INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      refresh_token_hash TEXT NOT NULL,
      token_fingerprint TEXT NOT NULL UNIQUE,
      user_agent TEXT,
      ip_address TEXT,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      doctor_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      diagnosis TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(doctor_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS shifts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nurse_id INTEGER NOT NULL,
      shift_date TEXT NOT NULL,
      shift_time TEXT NOT NULL,
      FOREIGN KEY(nurse_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      ip_address TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);
};

const seedData = (db) => {
  const countUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (countUsers.count > 0) {
    return;
  }

  const insertUser = db.prepare(`
    INSERT INTO users (username, password_hash, role, accepted_privacy)
    VALUES (?, ?, ?, ?)
  `);

  const users = [
    { username: 'admin', role: 'admin', accepted: 1 },
    { username: 'dr.smith', role: 'doctor', accepted: 1 },
    { username: 'nurse.annie', role: 'nurse', accepted: 1 },
    { username: 'staff.joe', role: 'staff', accepted: 1 }
  ];

  const passwordHash = bcrypt.hashSync('Password123!', 10);

  users.forEach((user) => {
    insertUser.run(user.username, passwordHash, user.role, user.accepted);
  });

  const doctor = db.prepare('SELECT id FROM users WHERE username = ?').get('dr.smith');
  const nurse = db.prepare('SELECT id FROM users WHERE username = ?').get('nurse.annie');

  const insertPatient = db.prepare(`
    INSERT INTO patients (doctor_id, name, diagnosis)
    VALUES (?, ?, ?)
  `);

  insertPatient.run(doctor.id, 'John Doe', 'Hypertension management plan.');
  insertPatient.run(doctor.id, 'Jane Roe', 'Post-operative recovery follow-up.');

  const insertShift = db.prepare(`
    INSERT INTO shifts (nurse_id, shift_date, shift_time)
    VALUES (?, ?, ?)
  `);

  insertShift.run(nurse.id, '2024-07-10', 'Night Shift (20:00 - 08:00)');
  insertShift.run(nurse.id, '2024-07-12', 'Day Shift (08:00 - 16:00)');

  const insertAnnouncement = db.prepare(`
    INSERT INTO announcements (title, content)
    VALUES (?, ?)
  `);

  insertAnnouncement.run(
    'Hospital Safety Drill',
    'All staff must participate in the annual safety drill on July 15th at 10:00.'
  );
  insertAnnouncement.run(
    'New Internal Newsletter',
    'Visit the dashboard to read the latest updates from the hospital board.'
  );
};

const getDb = () => {
  if (!dbInstance) {
    throw new Error('Database has not been initialized');
  }
  return dbInstance;
};

const initializeDatabase = () => {
  createDirectories();
  dbInstance = new Database(config.sqlitePath);
  dbInstance.pragma('foreign_keys = ON');
  initializeSchema(dbInstance);
  seedData(dbInstance);
  return dbInstance;
};

module.exports = {
  initializeDatabase,
  getDb,
};
