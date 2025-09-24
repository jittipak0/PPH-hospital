const userModel = require('../models/userModel')
const auditLogModel = require('../models/auditLogModel')
const userService = require('../services/userService')

const listUsers = (_req, res) => {
  const users = userModel.listUsers()
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
    res.status(201).json({ user: { id: created.id, username: created.username, role: created.role } })
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
    res.json({ user: { id: updated.id, username: updated.username, role: updated.role, acceptedPolicies: Boolean(updated.acceptedPolicies) } })
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
