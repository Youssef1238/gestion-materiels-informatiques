const express = require('express')
const router = express.Router()
const {getTypes , addType ,UpdateType, deleteType,getType} = require('../controllers/Manage_type')

router.route('/')
.get(getTypes)
.post(addType)
.put(UpdateType)
.delete(deleteType)

router.get('/:id',getType)




module.exports = router