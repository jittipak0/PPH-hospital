const express = require('express')
const authenticate = require('../middleware/authenticate')
const { validateBody } = require('../middleware/validate')
const { deleteAccountSchema } = require('../validations/accountSchemas')
const { removeAccount } = require('../controllers/accountController')

const router = express.Router()

router.delete('/', authenticate, validateBody(deleteAccountSchema), removeAccount)

module.exports = router
