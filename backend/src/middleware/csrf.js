const csrf = require('csurf');

const csrfProtection = csrf({
  cookie: {
    key: '_csrf',
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  },
});

const handleCsrfErrors = (err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }
  return res.status(403).json({ message: 'Invalid CSRF token' });
};

module.exports = {
  csrfProtection,
  handleCsrfErrors,
};
