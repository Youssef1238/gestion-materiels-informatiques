const mongoose = require('mongoose')

const entiteLogSchema = mongoose.Schema({
    entiteAdmin_id : String,
    date : Date,
    affectation : Boolean,
    articles : [String]
})


module.exports = mongoose.model("entiteLog",entiteLogSchema)