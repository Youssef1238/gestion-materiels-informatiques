const express = require('express')
const router = express.Router()
const {getUsers,addUser,UpdateUser,deleteUser,verifyUser}  = require('../controllers/Mange_user')



router.route('/')
.post(addUser)
.put(UpdateUser)
.delete(deleteUser)

router.get('/:id',getUsers)
router.post('/login',verifyUser)





module.exports = router