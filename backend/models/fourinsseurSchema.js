const mongoose = require('mongoose')

const fournisseurSchema = mongoose.Schema(

    {
        nom : String,
        qualite : String,
        nom_societe : String,
        capital : Number,
        patente : String,
        RC_lieu : String,
        RC_num : Number,
        CNSS : Number,
        adresse : String,
        RIB : String,
    }
)

module.exports = mongoose.model('Fournisseur',fournisseurSchema);