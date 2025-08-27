
require('../config/DBconnect')
const Fournisseur = require('../models/fourinsseurSchema')
const ArticleMarche = require('../models/articleMarcheSchema')
const ArticleLivre = require('../models/articleLivreSchema')
const Marche = require('../models/marcheSchema')

const getFournisseurs = async (req,res)=>{
    try{
        const fournisseurs = await Fournisseur.find()
        res.json(fournisseurs)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

const addFournisseur = async (req,res)=>{
    if(!req.body.nom || !req.body.qualite || !req.body.nom_societe || !req.body.capital || !req.body.patente
        || !req.body.RC_lieu || !req.body.RC_num || !req.body.CNSS || !req.body.adresse || !req.body.RIB
    ){
        return res.status(400).send("Tous les champs sont obligatoires.")
    }
    try{
        const fournisseur = new Fournisseur({
            nom : req.body.nom,
            qualite : req.body.qualite,
            nom_societe : req.body.nom_societe,
            capital : req.body.capital,
            patente : req.body.patente,
            RC_lieu : req.body.RC_lieu,
            RC_num : req.body.RC_num,
            CNSS : req.body.CNSS,
            adresse : req.body.adresse,
            RIB : req.body.RIB,
        })
        fournisseur.save()
        res.json(fournisseur)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

const UpdateFournisseur = async (req,res)=>{
    if(!req.body.id) res.status(400).send("id requis.")
        try{
            const item = await Fournisseur.findOne({_id : req.body.id})
            if(!item) return res.sendStatus(404)
            req.body.nom && await Fournisseur.updateOne({_id : req.body.id},{$set : {nom : req.body.nom}});
            req.body.qualite && await Fournisseur.updateOne({_id : req.body.id},{$set : {qualite : req.body.qualite}});
            req.body.nom_societe && await Fournisseur.updateOne({_id : req.body.id},{$set : {nom_societe : req.body.nom_societe}});
            req.body.capital && await Fournisseur.updateOne({_id : req.body.id},{$set : {capital : req.body.capital}});
            req.body.patente && await Fournisseur.updateOne({_id : req.body.id},{$set : {patente : req.body.patente}});
            req.body.RC_lieu && await Fournisseur.updateOne({_id : req.body.id},{$set : {RC_lieu : req.body.RC_lieu}});
            req.body.RC_num && await Fournisseur.updateOne({_id : req.body.id},{$set : {RC_num : req.body.RC_num}});
            req.body.CNSS && await Fournisseur.updateOne({_id : req.body.id},{$set : {CNSS : req.body.CNSS}});
            req.body.adresse && await Fournisseur.updateOne({_id : req.body.id},{$set : {adresse : req.body.adresse}});
            req.body.RIB && await Fournisseur.updateOne({_id : req.body.id},{$set : {RIB : req.body.RIB}});
            res.send("Mis à jour avec succès.")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const deleteFournisseur = async(req,res)=>{
    if(!req.body.id) res.status(400).send("id requis.")
        try{
            const item = await Fournisseur.findOne({_id : req.body.id})
            if(!item) return res.sendStatus(404)
            const marcheIds = await Marche.find({fournisseur_id : req.body.id}).select('_id')
            const articleIds = await ArticleMarche.find({marche_id : {$in : marcheIds.map(e=>e._id)}}).select('_id')
            await ArticleLivre.deleteMany({article_marche_id : {$in : articleIds.map(e=>e._id)}})
            await ArticleMarche.deleteMany({marche_id : {$in : articleIds.map(e=>e._id)}})
            await Marche.deleteMany({fournisseur_id : req.body.id})
            await Fournisseur.deleteOne({_id : req.body.id})
            res.send("Supprimé avec succès.")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const getFournisseur = async (req,res)=>{
    if(!req.params.id) return res.status(400).send('id requis.')
    try{
        const entiteLogs = await EntiteLog.find({entiteAdmin_id : req.params.id})
        res.send(entiteLogs)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    const fournisseur = await Fournisseur.findOne({_id : req.params.id})
    res.send(fournisseur)
}



module.exports = {getFournisseurs, addFournisseur,UpdateFournisseur,deleteFournisseur,getFournisseur}