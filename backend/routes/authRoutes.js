const express = require('express')
const router = express.Router()
const {Login,Refresh,Logout}  = require('../controllers/authController')




router.post('/login',Login)
router.get('/refresh',Refresh)
router.get('/logout',Logout)






module.exports = router