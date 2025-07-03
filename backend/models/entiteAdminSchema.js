const mongoose = require('mongoose')

const entiteAminSchema = mongoose.Schema(

    {
        libelle_ar : String,
        libelle_fr : String
    }
)

module.exports = mongoose.model('EntiteAdmin',entiteAminSchema);