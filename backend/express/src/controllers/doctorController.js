const patientModel = require('../models/patientModel')

const getMyPatients = (req, res) => {
  const patients = patientModel.getPatientsForDoctor(req.user.id)
  res.json({ patients })
}

module.exports = { getMyPatients }
