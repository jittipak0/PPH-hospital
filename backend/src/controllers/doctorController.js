const patientModel = require('../models/patientModel');
const { sanitizeValue } = require('../utils/sanitizer');

const getMyPatients = (req, res) => {
  const patients = patientModel.findByDoctorId(req.user.id).map((patient) =>
    sanitizeValue({
      id: patient.id,
      name: patient.name,
      diagnosis: patient.diagnosis,
      updatedAt: patient.updatedAt,
    })
  );
  return res.json({ patients });
};

module.exports = {
  getMyPatients,
};
