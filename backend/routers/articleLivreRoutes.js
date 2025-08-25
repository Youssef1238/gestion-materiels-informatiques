const express = require('express')
const router = express.Router()
const {getArticleLivres , addArticleLivre ,UpdateArticleLivre, 
    deleteArticleLivre,getArticleByArticleMarche,getArticleLivre,
    getArticleByEntite,getArticlebyMarche,getArticleBySerie,
    deleteByArticleMarche,getItems,searchArticleLivre} = require('../controllers/articleLivreController')

router.route('/')
.get(getArticleLivres)
.post(addArticleLivre)
.put(UpdateArticleLivre)
.delete(deleteArticleLivre)



router.get('/serie/:num',getArticleBySerie)
router.get('/one/:id',getArticleLivre)
router.get('/entite/:id',getArticleByEntite)
router.get('/marche/:id',getArticlebyMarche)
router.get('/search/:query',searchArticleLivre)
router.post('/items',getItems)
router.get('/:id',getArticleByArticleMarche)
router.delete('/:id',deleteByArticleMarche)


module.exports = router