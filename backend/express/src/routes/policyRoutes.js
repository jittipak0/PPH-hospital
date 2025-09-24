const express = require('express')
const { getPrivacyPolicy, getTermsOfUse } = require('../controllers/policyController')

const router = express.Router()

router.get('/privacy', getPrivacyPolicy)
router.get('/terms', getTermsOfUse)

module.exports = router
