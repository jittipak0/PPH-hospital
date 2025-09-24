const express = require('express');
const authenticate = require('../middleware/authenticate');
const { csrfProtection } = require('../middleware/csrf');
const userController = require('../controllers/userController');

const router = express.Router();

router.delete('/me', authenticate, csrfProtection, userController.deleteSelf);

module.exports = router;
