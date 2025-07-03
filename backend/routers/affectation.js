const express = require('express')
const router = express.Router()
const {getAffectations , addAffectation ,UpdateAffectation, deleteAffectation,getAffectationByArticle,handelRecuperation} = require('../controllers/Manage_affectation')

router.route('/')
.get(getAffectations)
.post(addAffectation)
.put(UpdateAffectation)
.delete(deleteAffectation)


router.get('/:id',getAffectationByArticle)
router.put('/recuperer',handelRecuperation)



module.exports = router