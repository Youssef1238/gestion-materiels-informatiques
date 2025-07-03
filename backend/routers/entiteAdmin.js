const express = require('express')
const router = express.Router()
const {getEntiteAdmins , addEntiteAdmin ,UpdateEntiteAdmin, deleteEntiteAdmin,getEntiteAdmin} = require('../controllers/Manage_entiteAdmin')

router.route('/')
.get(getEntiteAdmins)
.post(addEntiteAdmin)
.put(UpdateEntiteAdmin)
.delete(deleteEntiteAdmin)


router.get('/:id',getEntiteAdmin)



module.exports = router