const csrfToken = (req, res) => {
  const logger = req.log?.child({ controller: 'securityController', action: 'csrfToken' })
  logger?.debug('Generating CSRF token for client')
  const token = req.csrfToken()
  logger?.info('CSRF token generated')
  res.json({ csrfToken: token })
}

module.exports = { csrfToken }
