const express = require('express')
const authController = require('../controllers/authController')
const { loginSchema, refreshSchema, logoutSchema } = require('../validations/authSchemas')
const { validateBody } = require('../middleware/validate')
const { authRateLimiter } = require('../middleware/rateLimiter')
const authenticate = require('../middleware/authenticate')

const router = express.Router()

router.post('/login', authRateLimiter, validateBody(loginSchema), authController.login)
router.post('/refresh', validateBody(refreshSchema), authController.refresh)
router.post('/logout', authenticate, validateBody(logoutSchema), authController.logout)

module.exports = router
