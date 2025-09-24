const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const staffController = require('../controllers/staffController');

const router = express.Router();

router.get('/announcements', authenticate, authorize(['staff', 'admin']), staffController.getAnnouncements);

module.exports = router;
