
require('../config/DBconnect')
const EntiteAdmin = require('../models/entiteAdminSchema')
const Affectation = require('../models/affectationSchema')
const entieLog = require('../models/entiteLogSchema')

const getEntiteAdmins = async (req,res)=>{
    try{
        const entiteAdmins = await EntiteAdmin.find()
        res.json(entiteAdmins)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

const addEntiteAdmin = async (req,res)=>{
    if(!req.body.libelle_ar || !req.body.libelle_fr ){
        return res.status(400).send("all fields are required ")
    }
    try{
        const entiteAdmin = new EntiteAdmin({
            libelle_ar : req.body.libelle_ar,
            libelle_fr : req.body.libelle_fr
        })
        entiteAdmin.save()
        res.json(entiteAdmin)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

const UpdateEntiteAdmin = async (req,res)=>{
    if(!req.body.id) res.status(403).send("id is required")
        try{
            const item = await EntiteAdmin.findOne({_id : req.body.id})
            if(!item) return res.sendStatus(404)

            req.body.libelle_ar && await EntiteAdmin.updateOne({_id : req.body.id},{$set : {libelle_ar : req.body.libelle_ar}});
            req.body.libelle_fr && await EntiteAdmin.updateOne({_id : req.body.id},{$set : {libelle_fr : req.body.libelle_fr}});
            res.send("Updated")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const deleteEntiteAdmin = async(req,res)=>{
    if(!req.body.id) res.status(403).send("id is required")
        try{
            const item = await EntiteAdmin.findOne({_id : req.body.id})
            if(!item) return res.sendStatus(404)
            await Affectation.deleteMany({entiteAdmin_id : req.body.id})
            await entieLog.deleteMany({entiteAdmin_id : req.body.id})
            await EntiteAdmin.deleteOne({_id : req.body.id})
            res.send("Deleted")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const getEntiteAdmin = async (req,res)=>{
    if(!req.params.id) return res.status(400).send('id needed')
    try{
        const entiteAdmin = await EntiteAdmin.findOne({_id : req.params.id})
        res.json(entiteAdmin)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}



module.exports = {getEntiteAdmins, addEntiteAdmin,UpdateEntiteAdmin,deleteEntiteAdmin,getEntiteAdmin}