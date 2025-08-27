
require('../config/DBconnect')
const EntiteLog = require('../models/entiteLogSchema')



const addEntiteLog = async (req,res)=>{
    if(!req.body.entiteAdmin_id || !req.body.date || req.body.affectation == null || req.body.affectation == undefined ||!req.body.articles || req.body.articles.length == 0 ){
        return res.status(400).send("Tous les champs sont obligatoires.")
    }
    try{
        const entiteLog = new EntiteLog({
            entiteAdmin_id : req.body.entiteAdmin_id,
            date : req.body.date,
            affectation : req.body.affectation,
            articles : req.body.articles
        })
        entiteLog.save()
        res.json(entiteLog)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

const UpdateEntiteLog = async (req,res)=>{
    if(!req.body.id) res.status(400).send("id requis.")
        try{
            const item = await EntiteLog.findOne({_id : req.body.id})
            if(!item) return res.sendStatus(404)

            req.body.date && await EntiteLog.updateOne({_id : req.body.id},{$set : {date : req.body.date}});
            req.body.articles && await EntiteLog.updateOne({_id : req.body.id},{$set : {articles : req.body.articles}});
            res.send("Mis à jour avec succès.")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const deleteEntiteLog = async(req,res)=>{
    if(!req.body.id) res.status(400).send("id requis.")
        try{
            const item = await EntiteLog.findOne({_id : req.body.id})
            if(!item) return res.sendStatus(404)

            await EntiteLog.deleteOne({_id : req.body.id})
            res.send("Supprimé avec succès.")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const getEntiteLogs = async (req,res)=>{
    if(!req.params.id) return res.status(400).send('id requis.')
    try{
        const entiteLogs = await EntiteLog.find({entiteAdmin_id : req.params.id})
        res.send(entiteLogs)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

module.exports = {getEntiteLogs, addEntiteLog,UpdateEntiteLog,deleteEntiteLog}