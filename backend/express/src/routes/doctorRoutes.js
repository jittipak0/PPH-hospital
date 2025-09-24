const express = require('express')
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')
const { getMyPatients } = require('../controllers/doctorController')

const router = express.Router()

router.use(authenticate, authorize(['doctor']))
router.get('/patients', getMyPatients)

module.exports = router
