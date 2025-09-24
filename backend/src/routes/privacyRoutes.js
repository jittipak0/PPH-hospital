const express = require('express');
const privacyController = require('../controllers/privacyController');

const router = express.Router();

router.get('/policy', privacyController.getPrivacyPolicy);
router.get('/terms', privacyController.getTerms);

module.exports = router;
