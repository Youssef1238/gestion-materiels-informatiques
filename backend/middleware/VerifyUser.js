require('../config/DBconnect')
const User = require('../models/userSchema')


const verifyUser = async (req,res,next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if(!authHeader) return res.sendStatus(401);
        try{
            
            const foundUser = await User.findOne({_id : authHeader})
            if(foundUser)
                next()
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

module.exports = {verifyUser}