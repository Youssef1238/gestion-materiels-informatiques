const express = require('express')
const router = express.Router()
const {getArticleLivres , addArticleLivre ,UpdateArticleLivre, 
    deleteArticleLivre,getArticleByArticleMarche,getArticleLivre,
    getArticleByEntite,getArticlebyMarche,getArticleBySerie,
    deleteByArticleMarche,getItems} = require('../controllers/Manage_articleLivre')

router.route('/')
.get(getArticleLivres)
.post(addArticleLivre)
.put(UpdateArticleLivre)
.delete(deleteArticleLivre)


router.get('/:id',getArticleByArticleMarche)
router.delete('/:id',deleteByArticleMarche)
router.get('/serie/:num',getArticleBySerie)
router.get('/one/:id',getArticleLivre)
router.get('/entite/:id',getArticleByEntite)
router.get('/marche/:id',getArticlebyMarche)
router.post('/items',getItems)



module.exports = router