const auditLogModel = require('../models/auditLogModel');

const logAudit = ({ userId, action, ipAddress }) => {
  auditLogModel.createLog({ userId, action, ipAddress });
};

module.exports = {
  logAudit,
};
