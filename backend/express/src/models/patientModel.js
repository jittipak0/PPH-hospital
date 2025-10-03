const db = require('../config/db')
const { baseLogger } = require('../utils/debugLogger')

const logger = baseLogger.child({ model: 'patientModel' })

const getPatientsForDoctor = (doctorId) => {
  logger.debug('Fetching patients for doctor', { doctorId })
  return db
    .prepare('SELECT id, name, diagnosis, updatedAt FROM patients WHERE doctorId = ?')
    .all(doctorId)
}

module.exports = { getPatientsForDoctor }
