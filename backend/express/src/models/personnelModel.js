const crypto = require('crypto')
const { getPool } = require('../config/hosxpDb')

const baseSelect = `
  SELECT
    o.loginname AS username,
    d.name AS fullName,
    d.cid AS cid,
    h.name AS department,
    o.doctorcode AS doctorCode,
    o.hospital_department_id AS departmentId
  FROM opduser o
  LEFT JOIN doctor d ON d.code = o.doctorcode
  LEFT JOIN hospital_department h ON h.id = o.hospital_department_id
`

const authenticate = async ({ username, password }) => {
  const pool = getPool()
  const hashed = crypto.createHash('md5').update(password ?? '').digest('hex')
  const [rows] = await pool.execute(
    `${baseSelect} WHERE o.loginname = ? AND o.passweb = ? LIMIT 1`,
    [username, hashed]
  )
  if (!rows || rows.length === 0) {
    return null
  }
  return normalize(rows[0])
}

const findByCid = async (cid) => {
  const pool = getPool()
  const [rows] = await pool.execute(`${baseSelect} WHERE d.cid = ? LIMIT 1`, [cid])
  if (!rows || rows.length === 0) {
    return null
  }
  return normalize(rows[0])
}

const normalize = (row) => {
  const role = row?.doctorCode ? 'doctor' : 'staff'
  return {
    username: row?.username ?? '',
    fullName: row?.fullName ?? '',
    cid: row?.cid ?? null,
    department: row?.department ?? null,
    role,
    doctorCode: row?.doctorCode ?? null,
    departmentId: row?.departmentId ?? null
  }
}

module.exports = { authenticate, findByCid }
