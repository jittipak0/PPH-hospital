const express = require('express')
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')
const { listNews } = require('../controllers/staffController')

const router = express.Router()

router.use(authenticate, authorize(['staff', 'admin', 'doctor', 'nurse']))
router.get('/news', listNews)

module.exports = router
