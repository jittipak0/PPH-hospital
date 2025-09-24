const express = require('express')
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')
const { getSchedules } = require('../controllers/nurseController')

const router = express.Router()

router.use(authenticate, authorize(['nurse']))
router.get('/schedules', getSchedules)

module.exports = router
