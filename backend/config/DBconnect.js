const mongoose = require('mongoose')
require('dotenv').config()

const connect = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then(()=>console.log("DB connected"))
    } catch (error) {
        console.log(error.message)
    }
}
connect()

