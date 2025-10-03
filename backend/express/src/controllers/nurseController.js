const scheduleModel = require('../models/scheduleModel')

const getSchedules = (req, res) => {
  const logger = req.log?.child({ controller: 'nurseController', action: 'getSchedules' })
  logger?.debug('Fetching schedules for nurse', { nurseId: req.user.id })
  const schedules = scheduleModel.getSchedulesForNurse(req.user.id)
  logger?.info('Schedules retrieved for nurse', { count: schedules.length })
  res.json({ schedules })
}

module.exports = { getSchedules }
