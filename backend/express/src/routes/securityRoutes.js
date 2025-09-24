const express = require('express')
const { csrfToken } = require('../controllers/securityController')

const router = express.Router()

router.get('/csrf-token', csrfToken)

module.exports = router
