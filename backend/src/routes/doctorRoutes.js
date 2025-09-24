const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const doctorController = require('../controllers/doctorController');

const router = express.Router();

router.get('/patients', authenticate, authorize(['doctor']), doctorController.getMyPatients);

module.exports = router;
