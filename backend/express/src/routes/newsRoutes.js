const express = require('express')
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')
const { validateBody } = require('../middleware/validate')
const newsController = require('../controllers/newsController')
const { createNewsSchema, updateNewsSchema } = require('../validations/newsSchemas')

const router = express.Router()

router.get('/', newsController.listPublicNews)
router.get('/featured', newsController.listFeaturedNews)

router.use(authenticate, authorize(['admin']))
router.post('/', validateBody(createNewsSchema), newsController.createNews)
router.put('/:id', validateBody(updateNewsSchema), newsController.updateNews)
router.delete('/:id', newsController.deleteNews)

module.exports = router
