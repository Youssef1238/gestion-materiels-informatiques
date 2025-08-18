const mongoose = require('mongoose')




const articleMarcheSchema = mongoose.Schema(

    {
        marche_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Marche', index: true },
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
articleMarcheSchema.index({ marche_id: 1 });
module.exports = mongoose.model('ArticleMarche',articleMarcheSchema);