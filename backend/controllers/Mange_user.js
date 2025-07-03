
require('../config/DBconnect')
const User = require('../models/userSchema')

const getUsers = async (req,res)=>{
    if(!req.params.id) return res.status(400).send("the id is required")
        try{
            const users = await User.find({_id : {$ne : req.params.id}})
            res.json(users)
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const addUser = async (req,res)=>{
    if(!req.body.pseudo || !req.body.password || req.body.admin == undefined ||  req.body.admin == null){
        return res.status(400).send("all fields are required ")
    }
    
    try{
        const foundUser = await User.findOne({pseudo : req.body.pseudo})
        if(foundUser) return res.status(409).send("Already used")
        const user = new User({
            pseudo : req.body.pseudo,
            password : req.body.password,
            admin : req.body.admin
        })
        user.save()
        res.json(user)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

const UpdateUser = async (req,res)=>{
    if(!req.body.id) res.status(400).send("id is required")
        try{
            const item = await User.findOne({_id : req.body.id})
            if(!item) return res.sendStatus(404)
            req.body.admin != null && req.body.admin != undefined && await User.updateOne({_id : req.body.id},{$set : {admin : req.body.admin}});
            res.send("Updated")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const deleteUser = async(req,res)=>{
    if(!req.body.id) res.status(400).send("id is required")
        try{
            const item = await User.findOne({_id : req.body.id})
            if(!item) return res.sendStatus(404)
            await User.deleteOne({_id : req.body.id})
            res.send("Deleted")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const verifyUser = async (req,res)=>{
    if(!req.body.pseudo || !req.body.password) return res.status(400).send("pseudo or password are missing!")
        try{
            const foundUser = await User.findOne({pseudo : req.body.pseudo})
            if(!foundUser) return res.send("pseudo")
            if(foundUser.password == req.body.password) res.status(200).send(foundUser)
            else res.send("pass")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}





module.exports = {getUsers, addUser,UpdateUser,deleteUser,verifyUser}