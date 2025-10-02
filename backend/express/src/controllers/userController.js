const userModel = require('../models/userModel')
const auditLogModel = require('../models/auditLogModel')
const userService = require('../services/userService')

const listUsers = (_req, res) => {
  const users = userModel.listUsers().map((user) => ({
    id: user.id,
    username: user.username,
    role: user.role,
    acceptedPolicies: Boolean(user.acceptedPolicies),
    cid: user.cid ?? null,
    fullName: user.fullName ?? user.username,
    department: user.department ?? null,
    lastLoginAt: user.lastLoginAt ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }))
  res.json({ users })
}

const createUser = async (req, res, next) => {
  try {
    const { username, password, role } = req.validatedBody
    const created = await userService.createUser({
      username,
      password,
      role,
      actorId: req.user.id,
      ip: req.ip
    })
    res.status(201).json({
      user: {
        id: created.id,
        username: created.username,
        role: created.role,
        acceptedPolicies: Boolean(created.acceptedPolicies),
        cid: created.cid ?? null,
        fullName: created.fullName ?? created.username,
        department: created.department ?? null,
        lastLoginAt: created.lastLoginAt ?? null
      }
    })
  } catch (error) {
    return next(error)
  }
}

const updateUser = async (req, res, next) => {
  try {
    const updated = await userService.updateUser({
      id: req.params.userId,
      updates: req.validatedBody,
      actorId: req.user.id,
      ip: req.ip
    })
    if (!updated) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({
      user: {
        id: updated.id,
        username: updated.username,
        role: updated.role,
        acceptedPolicies: Boolean(updated.acceptedPolicies),
        cid: updated.cid ?? null,
        fullName: updated.fullName ?? updated.username,
        department: updated.department ?? null,
        lastLoginAt: updated.lastLoginAt ?? null
      }
    })
  } catch (error) {
    return next(error)
  }
}

const deleteUser = (req, res, next) => {
  try {
    userService.deleteUser({ id: req.params.userId, actorId: req.user.id, ip: req.ip })
    res.status(204).send()
  } catch (error) {
    return next(error)
  }
}

const listLogs = (_req, res) => {
  const logs = auditLogModel.listLogs()
  res.json({ logs })
}

module.exports = { listUsers, createUser, updateUser, deleteUser, listLogs }
