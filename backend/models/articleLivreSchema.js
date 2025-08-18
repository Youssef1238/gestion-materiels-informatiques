const mongoose = require('mongoose');
const articleMarcheSchema = require('./articleMarcheSchema');
const marcheSchema = require('./marcheSchema');




const articleLiverSchema = mongoose.Schema(

    {
        article_marche_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ArticleMarche', index: true },
        Numero : Number,
        Numero_Serie : String,
        date_Livraison : Date,
        cab : String,
        etat : Boolean
    }
)
articleLiverSchema.index({ article_marche_id: 1 });


module.exports = mongoose.model('ArticleLivre',articleLiverSchema);