const shiftModel = require('../models/shiftModel');

const getMyShifts = (req, res) => {
  const shifts = shiftModel.findByNurseId(req.user.id);
  return res.json({ shifts });
};

module.exports = {
  getMyShifts,
};
