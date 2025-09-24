const db = require('../config/db')

const getPatientsForDoctor = (doctorId) => {
  return db
    .prepare('SELECT id, name, diagnosis, updatedAt FROM patients WHERE doctorId = ?')
    .all(doctorId)
}

module.exports = { getPatientsForDoctor }
