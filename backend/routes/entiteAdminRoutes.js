const express = require('express')
const router = express.Router()
const {getEntiteAdmins , addEntiteAdmin ,UpdateEntiteAdmin, deleteEntiteAdmin,getEntiteAdmin,searchEntiteAdmin,getEntiteAdminStats} = require('../controllers/entiteAdminController')

router.route('/')
.get(getEntiteAdmins)
.post(addEntiteAdmin)
.put(UpdateEntiteAdmin)
.delete(deleteEntiteAdmin)


router.get('/:id',getEntiteAdmin)
router.get('/search/:query',searchEntiteAdmin)
router.get('/stats/:id',getEntiteAdminStats)



module.exports = router