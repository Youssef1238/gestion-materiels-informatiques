const express = require('express')
const router = express.Router()
const stats = require('../controllers/Manage_stats')

router.get('/',stats)




module.exports = router