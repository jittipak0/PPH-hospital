const csrfToken = (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
}

module.exports = { csrfToken }
