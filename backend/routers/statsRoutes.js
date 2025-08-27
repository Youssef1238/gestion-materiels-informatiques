const express = require('express')
const router = express.Router()
const {stats,MarchéStats} = require('../controllers/statsController')

router.get('/',stats)

router.get('/marche/:id',MarchéStats)




module.exports = router