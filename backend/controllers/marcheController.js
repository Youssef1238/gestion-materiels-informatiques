
require('../config/DBconnect')
const Marche = require('../models/marcheSchema')
const Fournisseur = require('../models/fourinsseurSchema')
const ArticleMarche = require('../models/articleMarcheSchema')
const ArticleLivre = require('../models/articleLivreSchema')

const getMarches = async (req,res)=>{
    try{
        const marches = await Marche.find()
        const fournisseurs = await Fournisseur.find()
        
        res.json(marches.map((i,_)=> {
            return {...i._doc , fournisseur : fournisseurs.find(e=>e._id == i.fournisseur_id)}
         }))
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

const addMarche = async (req,res)=>{
    if(!req.body.objet || !req.body.reference || !req.body.type || !req.body.fournisseur_id || !req.body.date_creation){
        return res.status(400).send("all fields are required ")
    }
    try{
        const foundMarché = await Marche.findOne({reference : req.body.reference})
        if(foundMarché) return res.status(409).send("Reference existe déjà !")
        const fournisseur = await Fournisseur.findOne({_id : req.body.fournisseur_id})
        if(!fournisseur) return res.status(404).send("Ce fournisseur n'existe pas !")
        const marche = new Marche({
            objet : req.body.objet,
            reference : req.body.reference,
            type : req.body.type,
            fournisseur_id : req.body.fournisseur_id,
            date_creation : req.body.date_creation
        })
        marche.save()
        res.json(marche)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

const UpdateMarche = async (req,res)=>{
    if(!req.body.id) res.status(400).send("id is required")
        try{
            const item = await Marche.findOne({_id : req.body.id})
            if(!item) return res.sendStatus(404)
            const foundMarché = await Marche.findOne({reference : req.body.reference ,_id : {$ne: req.body.id}})
            if(foundMarché) return res.status(409).send("Reference existe déjà !")
            if(req.body.fournisseur_id){
                const fournisseur = await Fournisseur.findOne({_id : req.body.fournisseur_id})
                if(!fournisseur) return res.status(404).send("Ce fournisseur n'existe pas !")
            }
            
            req.body.objet && await Marche.updateOne({_id : req.body.id},{$set : {objet : req.body.objet}});
            req.body.reference && await Marche.updateOne({_id : req.body.id},{$set : {reference : req.body.reference}});
            req.body.type && await Marche.updateOne({_id : req.body.id},{$set : {type : req.body.type}});
            req.body.fournisseur_id && await Marche.updateOne({_id : req.body.id},{$set : {fournisseur_id : req.body.fournisseur_id}});
            req.body.date_creation && await Marche.updateOne({_id : req.body.id},{$set : {date_creation : req.body.date_creation}});
            res.send("Updated")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}



const deleteMarche = async(req,res)=>{
    if(!req.body.id) res.status(400).send("id is required")
        try{
            const item = await Marche.findOne({_id : req.body.id})
            if(!item) return res.sendStatus(404)
            const Ids = await ArticleMarche.find({marche_id : req.body.id}).select('_id')
            await ArticleLivre.deleteMany({article_marche_id : {$in : Ids.map(e=>e._id)}})
            await ArticleMarche.deleteMany({marche_id : req.body.id})
            await Marche.deleteOne({_id : req.body.id})
            res.send("Deleted")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const getMarche = async (req,res)=>{
    if(!req.params.id) return res.status(400).send('id needed')
    try{
        const marche = await Marche.findOne({_id : req.params.id})
        if(!marche) return res.status(404).send("Marché non trouvé")
        const fournisseur = await Fournisseur.findOne({_id : marche.fournisseur_id})
        if(!fournisseur) return res.status(404).send("Fournisseur non trouvé")
        res.send({...marche._doc , fournisseur : fournisseur})
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}
const searchMarche = async (req,res)=>{
    try {
        if (!req.params.query) {
            return res.status(400).send("reference is required");
        }
        const regex = new RegExp(req.params.query, 'i');
        const marches = await Marche.find({ reference: { $regex: regex } });
        if (!marches || marches.length === 0) {
            return res.status(404).send("Aucun marché trouvé");
        }
        
        const result = marches.map(marche => ({
            id : marche._id , label : marche.reference
        }));
        res.json(result);
    } catch (err) {
        res.status(500).json({ title: "Server error", message: err.message });
    }
    
}

const getMarchesByFournisseur = async (req,res)=>{
    if(!req.params.id) return res.status(400).send('id needed')
    try{

        const marches = await Marche.find({fournisseur_id : req.params.id})
        if(!marches || marches.length == 0) return res.status(404).send("Aucun marché trouvé pour ce fournisseur")
        const fournisseurs = await Fournisseur.find()
        const fournisseur = fournisseurs.find(e=>e._id == req.params.id)
        if(!fournisseur) return res.status(404).send("Fournisseur non trouvé")
        marches.forEach(e=>e.fournisseur = fournisseur.nom)
        res.json(marches)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}



module.exports = {getMarches, addMarche,UpdateMarche,deleteMarche,getMarche,getMarchesByFournisseur,searchMarche}