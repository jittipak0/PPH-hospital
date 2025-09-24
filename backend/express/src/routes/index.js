const express = require('express')
const authRoutes = require('./authRoutes')
const userRoutes = require('./userRoutes')
const doctorRoutes = require('./doctorRoutes')
const nurseRoutes = require('./nurseRoutes')
const staffRoutes = require('./staffRoutes')
const policyRoutes = require('./policyRoutes')
const accountRoutes = require('./accountRoutes')
const securityRoutes = require('./securityRoutes')

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/doctor', doctorRoutes)
router.use('/nurse', nurseRoutes)
router.use('/staff', staffRoutes)
router.use('/policies', policyRoutes)
router.use('/account', accountRoutes)
router.use('/security', securityRoutes)

module.exports = router
