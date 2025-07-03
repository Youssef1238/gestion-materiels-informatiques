const express = require('express')
const router = express.Router()
const {getEntiteLogs , addEntiteLog ,UpdateEntiteLog, deleteEntiteLog} = require('../controllers/Manage_entiteLog')

router.route('/')
.post(addEntiteLog)
.put(UpdateEntiteLog)
.delete(deleteEntiteLog)

router.get('/:id',getEntiteLogs)




module.exports = router