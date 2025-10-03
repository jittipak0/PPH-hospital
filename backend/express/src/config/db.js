const fs = require('fs')
const path = require('path')
const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const { baseLogger } = require('../utils/debugLogger')

const logger = baseLogger.child({ module: 'sqlite' })

// Ensure database directory exists
const databasePath = path.resolve(__dirname, '../data/hospital.db')
fs.mkdirSync(path.dirname(databasePath), { recursive: true })

logger.info('Initializing SQLite connection', { databasePath })
const db = new Database(databasePath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

const summarizeResult = (result, type) => {
  if (type === 'run') {
    return { changes: result?.changes ?? null, lastInsertRowid: result?.lastInsertRowid ?? null }
  }
  if (type === 'all') {
    return { rowCount: Array.isArray(result) ? result.length : null }
  }
  if (type === 'get') {
    return { hasRow: Boolean(result) }
  }
  if (type === 'iterate') {
    return { iterator: true }
  }
  return result
}

const instrumentStatement = (statement) => {
  const sql = statement.source
  const statementLogger = logger.child({ sql })
  return new Proxy(statement, {
    get(target, prop) {
      const value = target[prop]
      if (['run', 'get', 'all', 'iterate'].includes(prop) && typeof value === 'function') {
        return (...args) => {
          statementLogger.debug('Executing SQL statement', { operation: prop, parameters: args })
          try {
            const result = value.apply(target, args)
            statementLogger.debug('SQL statement completed', {
              operation: prop,
              summary: summarizeResult(result, prop)
            })
            return result
          } catch (error) {
            statementLogger.error('SQL statement failed', { operation: prop, error })
            throw error
          }
        }
      }
      if (typeof value === 'function') {
        return value.bind(target)
      }
      return value
    }
  })
}

const originalPrepare = db.prepare.bind(db)
db.prepare = (...args) => {
  logger.debug('Preparing SQL statement', { sql: args[0] })
  const statement = originalPrepare(...args)
  return instrumentStatement(statement)
}

const originalExec = db.exec.bind(db)
db.exec = (sql) => {
  logger.debug('Executing SQL batch', { sql })
  return originalExec(sql)
}

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    acceptedPolicies INTEGER DEFAULT 0,
    cid TEXT,
    fullName TEXT,
    department TEXT,
    lastLoginAt TEXT,
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

const ensureTableColumn = (table, columnName, definition) => {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all()
  const hasColumn = columns.some((column) => column.name === columnName)
  if (!hasColumn) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${columnName} ${definition}`)
  }
}

const ensureNewsColumn = (columnName, definition) => {
  const columns = db.prepare('PRAGMA table_info(news)').all()
  const hasColumn = columns.some((column) => column.name === columnName)
  if (!hasColumn) {
    db.exec(`ALTER TABLE news ADD COLUMN ${columnName} ${definition}`)
  }
}

ensureNewsColumn('summary', "TEXT DEFAULT ''")
ensureNewsColumn('imageUrl', "TEXT DEFAULT ''")
ensureNewsColumn('isFeatured', 'INTEGER NOT NULL DEFAULT 0')
ensureNewsColumn('displayOrder', 'INTEGER NOT NULL DEFAULT 0')

ensureTableColumn('users', 'cid', 'TEXT')
ensureTableColumn('users', 'fullName', 'TEXT')
ensureTableColumn('users', 'department', 'TEXT')
ensureTableColumn('users', 'lastLoginAt', 'TEXT')

const seedDefaultUsers = () => {
  const count = db.prepare('SELECT COUNT(*) as total FROM users').get()
  if (count.total > 0) {
    logger.debug('Skipping default user seed; users already present', { total: count.total })
    return
  }

  logger.info('Seeding default user accounts and sample data')
  const timestamp = new Date().toISOString()
  const roles = [
    { username: 'admin', role: 'admin' },
    { username: 'dr.joy', role: 'doctor' },
    { username: 'nurse.ann', role: 'nurse' },
    { username: 'staff.bob', role: 'staff' }
  ]
  const passwordHash = bcrypt.hashSync('Password123!', 10)

  const insertUser = db.prepare(
    `INSERT INTO users (id, username, password, role, acceptedPolicies, cid, fullName, department, lastLoginAt, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )

  for (const roleData of roles) {
    insertUser.run(
      uuidv4(),
      roleData.username,
      passwordHash,
      roleData.role,
      0,
      null,
      null,
      null,
      null,
      timestamp,
      timestamp
    )
  }

  logger.debug('Default users seeded', { roles: roles.map((role) => role.username) })

  // Seed demo data for domain specific tables
  const doctorId = db.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get('doctor')?.id
  const nurseId = db.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get('nurse')?.id

  if (doctorId) {
    const insertPatient = db.prepare(
      'INSERT INTO patients (id, doctorId, name, diagnosis, updatedAt) VALUES (?, ?, ?, ?, ?)'
    )
    insertPatient.run(uuidv4(), doctorId, 'Somchai Prasert', 'Post-operative follow-up', timestamp)
    insertPatient.run(uuidv4(), doctorId, 'Suda Chaiyasit', 'Chronic hypertension', timestamp)
    logger.debug('Seeded sample patients for doctor', { doctorId })
  }

  if (nurseId) {
    const insertSchedule = db.prepare(
      'INSERT INTO schedules (id, nurseId, shiftDate, shiftType) VALUES (?, ?, ?, ?)'
    )
    insertSchedule.run(uuidv4(), nurseId, new Date().toISOString().split('T')[0], 'Day Shift')
    insertSchedule.run(uuidv4(), nurseId, new Date(Date.now() + 86400000).toISOString().split('T')[0], 'Night Shift')
    logger.debug('Seeded sample schedules for nurse', { nurseId })
  }

  const insertNews = db.prepare(
    `INSERT INTO news (id, title, summary, content, imageUrl, publishedAt, isFeatured, displayOrder)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
  insertNews.run(
    uuidv4(),
    'ประกาศซ้อมแผนอัคคีภัยประจำปี',
    'เชิญบุคลากรร่วมซ้อมแผนอพยพและใช้อุปกรณ์ดับเพลิงวันศุกร์นี้ที่อาคารผู้ป่วยนอก',
    'บุคลากรทุกคนโปรดเข้าร่วมการซ้อมแผนอัคคีภัยในวันศุกร์นี้ เวลา 14:00 น. ณ ลานอเนกประสงค์อาคารผู้ป่วยนอก โดยมีการสาธิตใช้งานอุปกรณ์ดับเพลิงและซ้อมอพยพผู้ป่วย รวมถึงทบทวนเส้นทางหลบหนีอย่างปลอดภัย',
    'https://images.unsplash.com/photo-1522845015754-513f09fb13b6',
    timestamp,
    1,
    1
  )
  insertNews.run(
    uuidv4(),
    'ระบบจัดเก็บยาอัจฉริยะพร้อมใช้งาน',
    'ห้องยาปรับระบบจัดเก็บยาใหม่ เพิ่มความปลอดภัยและความรวดเร็วในการจ่ายยา',
    'ระบบจัดเก็บยารูปแบบใหม่จะเริ่มใช้งานตั้งแต่สัปดาห์หน้า โปรดศึกษาคู่มือและเข้าร่วมการอบรมออนไลน์ก่อนใช้งานจริง เพื่อให้การเบิกจ่ายยาเป็นไปอย่างปลอดภัยและมีประสิทธิภาพ',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
    timestamp,
    1,
    2
  )
  insertNews.run(
    uuidv4(),
    'กติกาความปลอดภัยไซเบอร์ฉบับใหม่',
    'ประกาศมาตรการด้านไซเบอร์ใหม่สำหรับการใช้อีเมลและระบบเวชระเบียนอิเล็กทรอนิกส์',
    'นโยบายความปลอดภัยไซเบอร์ฉบับปรับปรุงมีผลทันที ผู้ใช้งานต้องเปิดใช้การยืนยันตัวตนสองขั้นตอน และห้ามนำข้อมูลคนไข้ออกนอกระบบโดยไม่ได้รับอนุญาต รายละเอียดเพิ่มเติมศึกษาจากเอกสารแนบและเข้าร่วมสัมมนาออนไลน์',
    'https://images.unsplash.com/photo-1556740758-90de374c12ad',
    timestamp,
    0,
    0
  )
  logger.debug('Seeded sample news entries')
}

seedDefaultUsers()

module.exports = db
