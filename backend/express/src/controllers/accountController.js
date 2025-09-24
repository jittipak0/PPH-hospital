const { deleteAccount } = require('../services/accountService')

const removeAccount = async (req, res, next) => {
  try {
    const { password } = req.validatedBody
    await deleteAccount({ userId: req.user.id, password, ip: req.ip })
    res.status(204).send()
  } catch (error) {
    return next(error)
  }
}

module.exports = { removeAccount }
