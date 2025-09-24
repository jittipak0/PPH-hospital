const db = require('../config/db')

const getSchedulesForNurse = (nurseId) => {
  return db
    .prepare('SELECT id, shiftDate, shiftType FROM schedules WHERE nurseId = ? ORDER BY shiftDate ASC')
    .all(nurseId)
}

module.exports = { getSchedulesForNurse }
