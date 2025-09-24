const { getDb } = require('../db');

const findByDoctorId = (doctorId) => {
  const db = getDb();
  return db
    .prepare('SELECT id, name, diagnosis, updated_at as updatedAt FROM patients WHERE doctor_id = ? ORDER BY name ASC')
    .all(doctorId);
};

module.exports = {
  findByDoctorId,
};
