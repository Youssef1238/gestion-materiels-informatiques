const express = require('express')
const router = express.Router()
const {getUsers,addUser,UpdateUser,deleteUser}  = require('../controllers/userController')



router.route('/')
.get(getUsers)
.post(addUser)
.put(UpdateUser)
.delete(deleteUser)






module.exports = router