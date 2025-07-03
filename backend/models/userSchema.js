const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
{
        pseudo : String,
        password : String,
        admin : Boolean
} 
)

module.exports = mongoose.model("User",userSchema)