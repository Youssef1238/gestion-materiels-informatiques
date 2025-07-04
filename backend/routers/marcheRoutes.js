const express = require('express')
const router = express.Router()
const {getMarches , addMarche ,UpdateMarche, deleteMarche,getMarche,getMarchesByFournisseur} = require('../controllers/marcheController')

router.route('/')
.get(getMarches)
.post(addMarche)
.put(UpdateMarche)
.delete(deleteMarche)


router.get('/:id',getMarche)


router.get('/fournisseur/:id',getMarchesByFournisseur)



module.exports = router