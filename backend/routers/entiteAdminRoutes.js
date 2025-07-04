const express = require('express')
const router = express.Router()
const {getEntiteAdmins , addEntiteAdmin ,UpdateEntiteAdmin, deleteEntiteAdmin,getEntiteAdmin} = require('../controllers/entiteAdminController')

router.route('/')
.get(getEntiteAdmins)
.post(addEntiteAdmin)
.put(UpdateEntiteAdmin)
.delete(deleteEntiteAdmin)


router.get('/:id',getEntiteAdmin)



module.exports = router