const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { csrfProtection } = require('../middleware/csrf');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/users', authenticate, authorize(['admin']), userController.listUsers);
router.post('/users', authenticate, authorize(['admin']), csrfProtection, userController.createUser);
router.patch('/users/:id/role', authenticate, authorize(['admin']), csrfProtection, userController.updateRole);
router.delete('/users/:id', authenticate, authorize(['admin']), csrfProtection, userController.deleteUser);
router.get('/logs', authenticate, authorize(['admin']), userController.getAuditLogs);

module.exports = router;
