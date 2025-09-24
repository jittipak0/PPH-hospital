const fs = require('fs')
const path = require('path')
const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')

// Ensure database directory exists
const databasePath = path.resolve(__dirname, '../data/hospital.db')
fs.mkdirSync(path.dirname(databasePath), { recursive: true })

const db = new Database(databasePath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    acceptedPolicies INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    refreshTokenHash TEXT NOT NULL,
    expiresAt TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    doctorId TEXT NOT NULL,
    name TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (doctorId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS schedules (
    id TEXT PRIMARY KEY,
    nurseId TEXT NOT NULL,
    shiftDate TEXT NOT NULL,
    shiftType TEXT NOT NULL,
    FOREIGN KEY (nurseId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS news (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    publishedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    userId TEXT,
    action TEXT NOT NULL,
    ip TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
  );
`)

const seedDefaultUsers = () => {
  const count = db.prepare('SELECT COUNT(*) as total FROM users').get()
  if (count.total > 0) {
    return
  }

  const timestamp = new Date().toISOString()
  const roles = [
    { username: 'admin', role: 'admin' },
    { username: 'dr.joy', role: 'doctor' },
    { username: 'nurse.ann', role: 'nurse' },
    { username: 'staff.bob', role: 'staff' }
  ]
  const passwordHash = bcrypt.hashSync('Password123!', 10)

  const insertUser = db.prepare(
    'INSERT INTO users (id, username, password, role, acceptedPolicies, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )

  for (const roleData of roles) {
    insertUser.run(uuidv4(), roleData.username, passwordHash, roleData.role, 0, timestamp, timestamp)
  }

  // Seed demo data for domain specific tables
  const doctorId = db.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get('doctor')?.id
  const nurseId = db.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get('nurse')?.id

  if (doctorId) {
    const insertPatient = db.prepare(
      'INSERT INTO patients (id, doctorId, name, diagnosis, updatedAt) VALUES (?, ?, ?, ?, ?)'
    )
    insertPatient.run(uuidv4(), doctorId, 'Somchai Prasert', 'Post-operative follow-up', timestamp)
    insertPatient.run(uuidv4(), doctorId, 'Suda Chaiyasit', 'Chronic hypertension', timestamp)
  }

  if (nurseId) {
    const insertSchedule = db.prepare(
      'INSERT INTO schedules (id, nurseId, shiftDate, shiftType) VALUES (?, ?, ?, ?)'
    )
    insertSchedule.run(uuidv4(), nurseId, new Date().toISOString().split('T')[0], 'Day Shift')
    insertSchedule.run(uuidv4(), nurseId, new Date(Date.now() + 86400000).toISOString().split('T')[0], 'Night Shift')
  }

  const insertNews = db.prepare('INSERT INTO news (id, title, content, publishedAt) VALUES (?, ?, ?, ?)')
  insertNews.run(
    uuidv4(),
    'ประกาศการซ้อมแผนอัคคีภัย',
    'บุคลากรทุกคนโปรดเข้าร่วมการซ้อมแผนอัคคีภัยในวันศุกร์นี้ เวลา 14:00 น.',
    timestamp
  )
  insertNews.run(
    uuidv4(),
    'ปรับปรุงระบบห้องยา',
    'ระบบจัดเก็บยาใหม่จะเริ่มใช้งานตั้งแต่สัปดาห์หน้า โปรดศึกษาคู่มือก่อนใช้งานจริง',
    timestamp
  )
}

seedDefaultUsers()

module.exports = db
