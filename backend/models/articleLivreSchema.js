const mongoose = require('mongoose')




const articleLiverSchema = mongoose.Schema(

    {
        article_marche_id : String,
        Numero : Number,
        Numero_Serie : String,
        date_Livraison : Date,
        cab : String,
        etat : Boolean
    }
)



module.exports = mongoose.model('ArticleLivre',articleLiverSchema);