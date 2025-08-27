
require('../config/DBconnect')
const ArticleMarche = require('../models/articleMarcheSchema')
const ArticleLivre = require('../models/articleLivreSchema')
const Type = require('../models/typeArticleSchema')

const getArticleMarches = async (req,res)=>{
    try{
        const articleMarches = await ArticleMarche.find()
        res.json(articleMarches)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

const addArticleMarche = async (req,res)=>{
    if(!req.body.marche_id || !req.body.Numero || !req.body.type_id || !req.body.marque
        || !req.body.description || !req.body.quantite || !req.body.prix_estimatif || !req.body.prix_unitaire
        || !req.body.prix_totale
    ){
        return res.status(400).send("Tous les champs sont obligatoires.")
    }
    try{
        const foundArticle = await ArticleMarche.findOne({marche_id : req.body.marche_id,Numero : req.body.Numero})
        if(foundArticle) return res.status(409).send("Numero existe déjà !")
        const type = await Type.findOne({_id : req.body.type_id})
        if(!type) return res.status(404).send("Ce type n'existe pas !")
        const articleMarche = new ArticleMarche({
            marche_id : req.body.marche_id,
            Numero : req.body.Numero,
            type_id : req.body.type_id,
            marque : req.body.marque,
            description : req.body.description,
            quantite : req.body.quantite,
            prix_estimatif : req.body.prix_estimatif,
            prix_unitaire : req.body.prix_unitaire,
            prix_totale : req.body.prix_totale
        })
        articleMarche.save()
        res.json(articleMarche)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

const UpdateArticleMarche = async (req,res)=>{
    if(!req.body.id) res.status(400).send("id requis.")
        try{

            const item = await ArticleMarche.findOne({_id : req.body.id})
            if(!item) return res.sendStatus(404)
            const foundArticle = await ArticleMarche.findOne({marche_id : req.body.marche_id ,Numero : req.body.Numero ,_id : {$ne: req.body.id}})
            console.log()
            if(foundArticle) return res.status(409).send("Numero existe déjà !")
            if(req.body.type_id){
                const type = await Type.findOne({_id : req.body.type_id})
                if(!type) return res.status(404).send("Ce type n'existe pas !")
            }
            
            req.body.marche_id && await ArticleMarche.updateOne({_id : req.body.id},{$set : {marche_id : req.body.marche_id}});
            req.body.Numero && await ArticleMarche.updateOne({_id : req.body.id},{$set : {Numero : req.body.Numero}});
            req.body.type_id && await ArticleMarche.updateOne({_id : req.body.id},{$set : {type_id : req.body.type_id}});
            req.body.marque && await ArticleMarche.updateOne({_id : req.body.id},{$set : {marque : req.body.marque}});
            req.body.description && await ArticleMarche.updateOne({_id : req.body.id},{$set : {description : req.body.description}});
            req.body.quantite && await ArticleMarche.updateOne({_id : req.body.id},{$set : {quantite : req.body.quantite}});
            req.body.prix_estimatif && await ArticleMarche.updateOne({_id : req.body.id},{$set : {prix_estimatif : req.body.prix_estimatif}});
            req.body.prix_unitaire && await ArticleMarche.updateOne({_id : req.body.id},{$set : {prix_unitaire : req.body.prix_unitaire}});
            req.body.prix_totale && await ArticleMarche.updateOne({_id : req.body.id},{$set : {prix_totale : req.body.prix_totale}});
            res.send("Mis à jour avec succès.")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const deleteArticleMarche = async(req,res)=>{
    if(!req.body.id) res.status(400).send("id requis.")
        try{
            const item = await ArticleMarche.findOne({_id : req.body.id})
            if(!item) return res.sendStatus(404)
            await ArticleLivre.deleteMany({article_marche_id : req.body.id})
            await ArticleMarche.deleteOne({_id : req.body.id})
            res.send("Supprimé avec succès.")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const getArticleMarche = async (req,res)=>{
    if(!req.params.id) return res.status(400).send("id requis.")
    try{
        const articleMarche = await ArticleMarche.findOne({_id : req.params.id})
        if(!articleMarche) return res.status(404).send("Article non trouvé")
        
        const type = await Type.findOne({_id : articleMarche.type_id})
        if(!type) return res.status(404).send("Type non trouvé")
        res.send({...articleMarche._doc , type : type.libelle})
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}
const getArticleByMarche = async (req,res)=>{
    if(!req.params.id) return res.status(400).send("id requis.")
    try{
        const articleMarches = await ArticleMarche.find({marche_id : req.params.id})
        if(!articleMarches) return res.status(404).send("Article non trouvé")
        const types = await Type.find()
        res.json(articleMarches.map((i,_)=> {
            return {...i._doc , type : (types.find(e=>e._id == i.type_id)?.libelle || "")}
         }))
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}



module.exports = {getArticleMarches, addArticleMarche,UpdateArticleMarche,deleteArticleMarche,getArticleByMarche,getArticleMarche}