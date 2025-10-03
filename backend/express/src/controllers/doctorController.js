const patientModel = require('../models/patientModel')

const getMyPatients = (req, res) => {
  const logger = req.log?.child({ controller: 'doctorController', action: 'getMyPatients' })
  logger?.debug('Fetching patients for doctor', { doctorId: req.user.id })
  const patients = patientModel.getPatientsForDoctor(req.user.id)
  logger?.info('Patients retrieved for doctor', { count: patients.length })
  res.json({ patients })
}

module.exports = { getMyPatients }
