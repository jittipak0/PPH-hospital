const csurf = require('csurf')

// Configure CSRF middleware to use cookies suitable for HTTPS reverse proxy setups.
const isProduction = process.env.NODE_ENV === 'production'

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    sameSite: isProduction ? 'strict' : 'lax',
    secure: isProduction
  }
})

module.exports = csrfProtection
