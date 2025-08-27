const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('../config/DBconnect')
require('dotenv').config()
const User = require('../models/userSchema')





const Login = async (req,res)=>{
    if(!req.body.pseudo || !req.body.password) return res.status(400).send("Pseudo ou mot de passe manquant !")
        try{
            const foundUser = await User.findOne({pseudo : req.body.pseudo})
            if(!foundUser) return res.status(401).send("pseudo")
            const isMatch = await bcrypt.compare(req.body.password, foundUser.password);
            if(isMatch){
                const accessToken = jwt.sign({userId : foundUser._id, isAdmin: foundUser.admin}, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn : '1h'})
                const refreshToken = jwt.sign({userId  : foundUser._id , isAdmin: foundUser.admin}, process.env.JWT_REFRESH_TOKEN_SECRET, {expiresIn : '7d'})
                res.cookie('refreshToken', refreshToken, {
                    httpOnly : true,
                    secure : true,
                    sameSite : 'strict',
                    path: '/auth/refresh',
                })
                res.json({accessToken})
            } 
            else res.status(401).send("pass")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const Refresh = async (req,res)=>{
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) return res.sendStatus(401)
    try{
        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err,decoded)=>{
            if(err) return res.sendStatus(403)
            const accessToken = jwt.sign({userId : decoded.userId , isAdmin: decoded.isAdmin}, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn : '1h'})
            res.json({accessToken})
        })
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
}

const Logout = async (req,res)=>{
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/auth/refresh', 
    });
    res.status(204).send("Déconnexion réussie.");
}





module.exports = {Login,Refresh,Logout}