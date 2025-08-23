const express = require('express')
const router = express.Router()
const {getEntiteAdmins , addEntiteAdmin ,UpdateEntiteAdmin, deleteEntiteAdmin,getEntiteAdmin,searchEntiteAdmin} = require('../controllers/entiteAdminController')

router.route('/')
.get(getEntiteAdmins)
.post(addEntiteAdmin)
.put(UpdateEntiteAdmin)
.delete(deleteEntiteAdmin)


router.get('/:id',getEntiteAdmin)
router.get('/search/:query',searchEntiteAdmin)



module.exports = router