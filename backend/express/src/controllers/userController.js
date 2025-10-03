const userModel = require('../models/userModel')
const auditLogModel = require('../models/auditLogModel')
const userService = require('../services/userService')

const listUsers = (req, res) => {
  const logger = req.log?.child({ controller: 'userController', action: 'listUsers' })
  logger?.debug('Listing users')
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
  logger?.info('Users listed', { count: users.length })
  res.json({ users })
}

const createUser = async (req, res, next) => {
  const logger = req.log?.child({ controller: 'userController', action: 'createUser' })
  try {
    const { username, password, role } = req.validatedBody
    logger?.debug('Creating new user', { username, role })
    const created = await userService.createUser({
      username,
      password,
      role,
      actorId: req.user.id,
      ip: req.ip,
      logger
    })
    logger?.info('User created successfully', { userId: created.id })
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
  const logger = req.log?.child({ controller: 'userController', action: 'updateUser' })
  try {
    logger?.debug('Updating user', { userId: req.params.userId })
    const updated = await userService.updateUser({
      id: req.params.userId,
      updates: req.validatedBody,
      actorId: req.user.id,
      ip: req.ip,
      logger
    })
    if (!updated) {
      logger?.warn('User update requested but user not found', { userId: req.params.userId })
      return res.status(404).json({ message: 'User not found' })
    }
    logger?.info('User updated successfully', { userId: updated.id })
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
  const logger = req.log?.child({ controller: 'userController', action: 'deleteUser' })
  try {
    logger?.debug('Deleting user', { userId: req.params.userId })
    userService.deleteUser({
      id: req.params.userId,
      actorId: req.user.id,
      ip: req.ip,
      logger
    })
    logger?.info('User deleted successfully', { userId: req.params.userId })
    res.status(204).send()
  } catch (error) {
    logger?.error('Failed to delete user', { error })
    return next(error)
  }
}

const listLogs = (req, res) => {
  const logger = req.log?.child({ controller: 'userController', action: 'listLogs' })
  logger?.debug('Listing audit logs')
  const logs = auditLogModel.listLogs()
  logger?.info('Audit logs retrieved', { count: logs.length })
  res.json({ logs })
}

module.exports = { listUsers, createUser, updateUser, deleteUser, listLogs }
