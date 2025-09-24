const scheduleModel = require('../models/scheduleModel')

const getSchedules = (req, res) => {
  const schedules = scheduleModel.getSchedulesForNurse(req.user.id)
  res.json({ schedules })
}

module.exports = { getSchedules }
