
require('../config/DBconnect')
const Type = require('../models/typeArticleSchema')
const ArticleMarche = require('../models/articleMarcheSchema')
const ArticleLivre = require('../models/articleLivreSchema')

const getTypes = async (req,res)=>{
    try{
        const types = await Type.find()
        res.json(types)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

const addType = async (req,res)=>{
    if(!req.body.order || !req.body.libelle){
        return res.status(400).send("order and libelle are required")
    }
    try{
        let foundType = await Type.findOne({libelle: req.body.libelle});
        if(foundType) return res.status(409).send("Libelle existe déjà !")
        foundType = await Type.findOne({order: req.body.order});
        if(foundType) return res.status(409).send("Ordre existe déjà !")
        const type = new Type({
            order : req.body.order,
            libelle : req.body.libelle
        })
        type.save()
        res.json(type)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

const UpdateType = async (req,res)=>{
    if(!req.body.id) res.status(400).send("id is required")
        try{
            const item = await Type.findOne({_id : req.body.id})
            if(!item) return res.sendStatus(404)
            let foundType = await Type.findOne({libelle : req.body.libelle,_id : {$ne: req.body.id} });
            if(foundType) return res.status(409).send("Libelle existe déjà !")
            foundType = await Type.findOne({order : req.body.order,_id : {$ne: req.body.id} });
            if(foundType) return res.status(409).send("Ordre existe déjà !")
            req.body.order && await Type.updateOne({_id : req.body.id},{$set : {order : req.body.order}});
            req.body.libelle && await Type.updateOne({_id : req.body.id},{$set : {libelle : req.body.libelle}});
            res.send("Updated")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const deleteType = async(req,res)=>{
    if(!req.body.id) res.status(400).send("id is required")
        try{
            const item = await Type.findOne({_id : req.body.id})
            if(!item) return res.sendStatus(404)
            const Ids = await ArticleMarche.find({type_id : req.body.id}).select('_id')
            await ArticleLivre.deleteMany({article_marche_id : {$in : Ids.map(e=>e._id)}})
            await ArticleMarche.deleteMany({type_id : req.body.id})
            await Type.deleteOne({_id : req.body.id})
            res.send("Deleted")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const getType = async (req,res)=>{
    if(!req.params.id) return res.status(400).send('id needed')
    try{
        const type = await Type.findOne({_id : req.params.id})
        res.send(type)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

module.exports = {getTypes, addType,UpdateType,deleteType,getType}