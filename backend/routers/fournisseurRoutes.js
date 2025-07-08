const express = require('express')
const router = express.Router()
const {getFournisseurs , addFournisseur ,UpdateFournisseur, deleteFournisseur,getFournisseur} = require('../controllers/fournisseurController')

router.route('/')
.get(getFournisseurs)
.post(addFournisseur)
.put(UpdateFournisseur)
.delete(deleteFournisseur)

router.get('/:id',getFournisseur)



module.exports = router