const mongoose = require('mongoose')

const affectationSchema = mongoose.Schema(

    {
        article_livre_id : String,
        entiteAdmin_id : String,
        date_affectation : Date,
        date_recuperation : Date
    }
)

module.exports = mongoose.model('Affectation',affectationSchema);