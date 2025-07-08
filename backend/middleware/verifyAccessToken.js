const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyAccessToken = async (req,res,next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
    
}

module.exports = {verifyAccessToken}