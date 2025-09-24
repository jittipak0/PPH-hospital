const express = require('express');
const authController = require('../controllers/authController');
const { csrfProtection } = require('../middleware/csrf');

const router = express.Router();

router.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

router.post('/login', csrfProtection, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', csrfProtection, authController.logout);

module.exports = router;
