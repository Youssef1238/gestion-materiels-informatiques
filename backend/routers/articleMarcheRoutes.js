const express = require('express')
const router = express.Router()
const {getArticleMarches , addArticleMarche ,UpdateArticleMarche, deleteArticleMarche,getArticleByMarche} = require('../controllers/articleMarcheController')

router.route('/')
.get(getArticleMarches)
.post(addArticleMarche)
.put(UpdateArticleMarche)
.delete(deleteArticleMarche)


router.get('/:id',getArticleByMarche)



module.exports = router