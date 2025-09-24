const csurf = require('csurf')

// Configure CSRF middleware to use cookies suitable for HTTPS reverse proxy setups.
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure: true
  }
})

module.exports = csrfProtection
