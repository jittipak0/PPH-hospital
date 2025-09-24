const { getDb } = require('../db');

const findByNurseId = (nurseId) => {
  const db = getDb();
  return db
    .prepare('SELECT id, shift_date as shiftDate, shift_time as shiftTime FROM shifts WHERE nurse_id = ? ORDER BY shift_date ASC')
    .all(nurseId);
};

module.exports = {
  findByNurseId,
};
