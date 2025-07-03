const mongoose = require('mongoose')




const articleMarcheSchema = mongoose.Schema(

    {
        marche_id : String,
        Numero : Number,
        type_id : String,
        marque : String,
        description : String,
        quantite : Number,
        prix_estimatif : Number,
        prix_unitaire : Number,
        prix_totale : Number

    }
)

module.exports = mongoose.model('ArticleMarche',articleMarcheSchema);