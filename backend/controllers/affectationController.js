
require('../config/DBconnect')
const Affectation = require('../models/affectationSchema')

const getAffectations = async (req,res)=>{
    try{
        const affectations = await Affectation.find()
        res.json(affectations)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

const addAffectation = async (req,res)=>{
    if(!req.body.article_livre_id || !req.body.entiteAdmin_id || !req.body.date_affectation ){
        return res.status(400).send("Tous les champs sont obligatoires.")
    }
    try{
        const affectation = new Affectation({
            article_livre_id : req.body.article_livre_id,
            entiteAdmin_id : req.body.entiteAdmin_id,
            date_affectation : req.body.date_affectation
        })
        affectation.save()
        res.json(affectation)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

const UpdateAffectation = async (req,res)=>{
    if(!req.body.id) res.status(400).send("id requis.")
    try{

        const affectation = await Affectation.findOne({_id : req.body.id})
        if(!affectation){
            return res.sendStatus(404)
        }
        req.body.article_livre_id && await Affectation.updateOne({_id : req.body.id},{$set : {article_livre_id : req.body.article_livre_id}});
        req.body.entiteAdmin_id && await Affectation.updateOne({_id : req.body.id},{$set : {entiteAdmin_id : req.body.entiteAdmin_id}});
        req.body.date_affectation && await Affectation.updateOne({_id : req.body.id},{$set : {date_affectation : req.body.date_affectation}});
        req.body.date_recuperation && await Affectation.updateOne({_id : req.body.id},{$set : {date_recuperation : req.body.date_recuperation}});
        res.send("Mis & jour avec succès")

    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

const deleteAffectation = async(req,res)=>{
    if(!req.body.id) res.status(400).send("id requis.")
    try{
        await Affectation.deleteOne({_id : req.body.id})
        res.send("Supprimé avec succès.")
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

const getAffectationByArticle = async (req,res)=>{
    if(!req.params.id ) return res.status(400).send("id requis.")
    try{
        const affectation = await Affectation.find({article_livre_id : req.params.id})
        res.json(affectation)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

const handelRecuperation = async (req,res)=>{
    if (!req.body.id || !req.body.date_recuperation) {
        return res.status(400).send("Les champs 'id' et 'date_recuperation' sont tous deux obligatoires.");
    }
    try {
        const result = await Affectation.updateOne(
            { article_livre_id: req.body.id, date_recuperation: { $exists: false } },
            { $set: { date_recuperation: req.body.date_recuperation } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).send("Affectation non trouvée ou déjà récupérée.");
        }
        res.send("Récupération mise à jour avec succès");
    } catch (err) {
        res.status(500).json({ title: "Server error", message: err.message });
    }
    
}



module.exports = {getAffectations, addAffectation,UpdateAffectation,deleteAffectation,getAffectationByArticle,handelRecuperation}