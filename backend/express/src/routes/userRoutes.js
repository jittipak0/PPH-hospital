const express = require('express')
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')
const { validateBody } = require('../middleware/validate')
const { createUserSchema, updateUserSchema } = require('../validations/userSchemas')
const userController = require('../controllers/userController')

const router = express.Router()

router.use(authenticate, authorize(['admin']))

router.get('/', userController.listUsers)
router.post('/', validateBody(createUserSchema), userController.createUser)
router.put('/:userId', validateBody(updateUserSchema), userController.updateUser)
router.delete('/:userId', userController.deleteUser)
router.get('/logs/audit', userController.listLogs)

module.exports = router
