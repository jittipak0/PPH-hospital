const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const nurseController = require('../controllers/nurseController');

const router = express.Router();

router.get('/shifts', authenticate, authorize(['nurse']), nurseController.getMyShifts);

module.exports = router;
