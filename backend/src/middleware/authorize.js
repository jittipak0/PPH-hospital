const authorize = (roles = []) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (roles.length > 0 && !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You do not have permission to perform this action' });
  }

  if (!req.user.acceptedPrivacy) {
    return res.status(403).json({ message: 'Privacy policy must be accepted before accessing this resource' });
  }

  return next();
};

module.exports = authorize;
