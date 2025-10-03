const { deleteAccount } = require('../services/accountService')

const removeAccount = async (req, res, next) => {
  const logger = req.log?.child({ controller: 'accountController', action: 'removeAccount' })
  try {
    const { password } = req.validatedBody
    logger?.debug('Attempting account deletion', { userId: req.user.id })
    await deleteAccount({ userId: req.user.id, password, ip: req.ip, logger })
    logger?.info('Account deletion completed', { userId: req.user.id })
    res.status(204).send()
  } catch (error) {
    logger?.error('Account deletion failed', { error })
    return next(error)
  }
}

module.exports = { removeAccount }
