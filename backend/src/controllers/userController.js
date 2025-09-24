const bcrypt = require('bcryptjs');
const { z } = require('zod');
const userModel = require('../models/userModel');
const auditLogModel = require('../models/auditLogModel');
const { logAudit } = require('../utils/logger');
const { sanitizeValue } = require('../utils/sanitizer');

const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  role: z.enum(['admin', 'doctor', 'nurse', 'staff']),
});

const updateRoleSchema = z.object({
  role: z.enum(['admin', 'doctor', 'nurse', 'staff']),
});

const deleteSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const createUser = (req, res) => {
  const payload = createUserSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: 'Invalid user data', issues: payload.error.errors });
  }
  const { username, password, role } = sanitizeValue(payload.data);
  const existing = userModel.findByUsername(username);
  if (existing) {
    return res.status(409).json({ message: 'Username already exists' });
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  const user = userModel.createUser({ username, passwordHash, role, acceptedPrivacy: 0 });
  logAudit({ userId: req.user.id, action: `CREATE_USER:${user.id}`, ipAddress: req.ip });
  return res.status(201).json({ id: user.id, username: user.username, role: user.role });
};

const listUsers = (req, res) => {
  const users = userModel.listUsers().map((user) => ({
    id: user.id,
    username: user.username,
    role: user.role,
    acceptedPrivacy: Boolean(user.acceptedPrivacy),
    createdAt: user.createdAt,
  }));
  return res.json({ users });
};

const updateRole = (req, res) => {
  const params = deleteSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: 'Invalid user id', issues: params.error.errors });
  }
  const payload = updateRoleSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: 'Invalid role', issues: payload.error.errors });
  }
  const user = userModel.updateUserRole(params.data.id, payload.data.role);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  logAudit({ userId: req.user.id, action: `UPDATE_ROLE:${user.id}:${user.role}`, ipAddress: req.ip });
  return res.json({ id: user.id, username: user.username, role: user.role });
};

const deleteUser = (req, res) => {
  const params = deleteSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: 'Invalid user id', issues: params.error.errors });
  }
  const target = userModel.findById(params.data.id);
  if (!target) {
    return res.status(404).json({ message: 'User not found' });
  }
  userModel.deleteUser(params.data.id);
  logAudit({ userId: req.user.id, action: `DELETE_USER:${params.data.id}`, ipAddress: req.ip });
  return res.status(204).send();
};

const deleteSelf = (req, res) => {
  const currentUser = userModel.findById(req.user.id);
  if (!currentUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  userModel.deleteUser(currentUser.id);
  logAudit({ userId: currentUser.id, action: 'SELF_DELETE', ipAddress: req.ip });
  return res.status(204).send();
};

const getAuditLogs = (req, res) => {
  const logs = auditLogModel.listLogs();
  return res.json({ logs });
};

module.exports = {
  createUser,
  listUsers,
  updateRole,
  deleteUser,
  deleteSelf,
  getAuditLogs,
};
