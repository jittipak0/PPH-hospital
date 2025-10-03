const db = require('../config/db')
const { baseLogger } = require('../utils/debugLogger')

const logger = baseLogger.child({ model: 'scheduleModel' })

const getSchedulesForNurse = (nurseId) => {
  logger.debug('Fetching schedules for nurse', { nurseId })
  return db
    .prepare('SELECT id, shiftDate, shiftType FROM schedules WHERE nurseId = ? ORDER BY shiftDate ASC')
    .all(nurseId)
}

module.exports = { getSchedulesForNurse }
