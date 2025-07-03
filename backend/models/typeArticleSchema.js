const mongoose = require('mongoose')

const typeArticleSchema = mongoose.Schema(

    {
        order : Number,
        libelle : String
    }
)

module.exports = mongoose.model('TypeArticle',typeArticleSchema);