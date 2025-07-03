const mongoose = require('mongoose')

const marcheSchema = mongoose.Schema(

    {
        objet : String,
        reference : String,
        type : String,
        fournisseur_id : String,
        date_creation : Date
    }
)

module.exports = mongoose.model('Marche',marcheSchema);