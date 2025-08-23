
require('../config/DBconnect')
const ArticleLivre = require('../models/articleLivreSchema')
const Affectation = require('../models/affectationSchema')
const Marche = require('../models/marcheSchema')
const ArticleMarche = require('../models/articleMarcheSchema')
const Type = require('../models/typeArticleSchema')

const getArticleLivres = async (req,res)=>{
    try{
        const articleLivres = await ArticleLivre.aggregate([
            
            {
                $lookup: {
                    from: 'articlemarches', 
                    localField: 'article_marche_id',
                    foreignField: '_id',
                    as: 'articleMarcheDetails' 
                }
            },
            
            {
                $unwind: {
                    path: '$articleMarcheDetails',
                    preserveNullAndEmptyArrays: true 
                }
            },
            
            {
                $lookup: {
                    from: 'marches', 
                    localField: 'articleMarcheDetails.marche_id', 
                    foreignField: '_id',
                    as: 'marcheDetails'
                }
            },
            
            {
                $unwind: {
                    path: '$marcheDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            
            {
                $project: {
                    _id: 1,
                    Numero: 1,
                    Numero_Serie: 1,
                    date_Livraison: 1,
                    cab: 1,
                    etat: 1,
                    marcheReference: '$marcheDetails.reference'
                }
            }
        ]);
        res.json(articleLivres)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

const addArticleLivre = async (req,res)=>{
    if(!req.body.article_marche_id || !req.body.Numero || !req.body.Numero_Serie || !req.body.date_Livraison
        || !req.body.cab || req.body.etat === undefined ||  req.body.etat === null
    ){
        return res.status(400).send("all fields are required ")
    }
    try{
        const articleMarche = await ArticleMarche.findOne({_id : req.body.article_marche_id})
        if(!articleMarche) return res.status(404).send("Cet article n'existe pas !")
        let foundArticle = await ArticleLivre.findOne({article_marche_id : req.body.article_marche_id,Numero : req.body.Numero})
        if(foundArticle) return res.status(409).send("Numero existe déjà !")
        foundArticle = await ArticleLivre.findOne({article_marche_id : req.body.article_marche_id,Numero_Serie : req.body.Numero_Serie})
        if(foundArticle) return res.status(409).send("Numero de Serie existe déjà !")
        const articleLivre = new ArticleLivre({
            article_marche_id : req.body.article_marche_id,
            Numero : req.body.Numero,
            Numero_Serie : req.body.Numero_Serie,
            date_Livraison : req.body.date_Livraison,
            cab : req.body.cab,
            etat : req.body.etat
        })
        articleLivre.save()
        res.json(articleLivre)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
   
}

const UpdateArticleLivre = async (req,res)=>{
    if(!req.body.id) res.status(400).send("id is required")
    try{

        const item = await ArticleLivre.findOne({_id : req.body.id})
        if(!item){
            return res.sendStatus(404)
        }
        if(req.body.article_marche_id){
            const articleMarche = await ArticleMarche.findOne({_id : req.body.article_marche_id })
            if(!articleMarche) return res.status(404).send("Cet article n'existe pas !")
        }
        if(req.body.Numero){
            let foundArticle = await ArticleLivre.findOne({article_marche_id : req.body.article_marche_id,Numero : req.body.Numero ,_id : {$ne: req.body.id}})
            if(foundArticle) return res.status(409).send("Numero existe déjà !")
        }
        if(req.body.Numero_Serie){
            foundArticle = await ArticleLivre.findOne({article_marche_id : req.body.article_marche_id,Numero_Serie : req.body.Numero_Serie ,_id : {$ne: req.body.id}})
            if(foundArticle) return res.status(409).send("Numero de Serie existe déjà !")
        }
        

        req.body.article_marche_id && await ArticleLivre.updateOne({_id : req.body.id},{$set : {article_marche_id : req.body.article_marche_id}});
        req.body.Numero && await ArticleLivre.updateOne({_id : req.body.id},{$set : {Numero : req.body.Numero}});
        req.body.Numero_Serie && await ArticleLivre.updateOne({_id : req.body.id},{$set : {Numero_Serie : req.body.Numero_Serie}});
        req.body.date_Livraison && await ArticleLivre.updateOne({_id : req.body.id},{$set : {date_Livraison : req.body.date_Livraison}});
        req.body.cab && await ArticleLivre.updateOne({_id : req.body.id},{$set : {cab : req.body.cab}});
        req.body.etat !== null && req.body.etat !== undefined && await ArticleLivre.updateOne({_id : req.body.id},{$set : {etat : req.body.etat}});
        res.send("Updated")
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }      
    
}

const deleteArticleLivre = async(req,res)=>{
    if(!req.body.id) res.status(400).send("id is required")
    try{
        const articleLivre = await ArticleLivre.findOne({_id : req.body.id})
        if(!articleLivre) return res.sendStatus(404)
        await ArticleLivre.deleteOne({_id : req.body.id})
        res.send("Deleted")
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
        
    
}

const deleteByArticleMarche = async(req,res)=>{
    if(!req.params.id) res.status(400).send("id is required")
        try{
            const articleLivre = await ArticleLivre.findOne({article_marche_id : req.params.id})
            if(!articleLivre) return res.sendStatus(404)
            await ArticleLivre.deleteMany({article_marche_id : req.params.id})
            res.send("Deleted")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const getArticleByArticleMarche = async (req,res)=>{
    if(!req.params.id) return res.status(400).send("id needed")
    try{
        const articleLivres = await ArticleLivre.find({article_marche_id : req.params.id})
        res.json(articleLivres)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}
const getArticleLivre = async (req,res)=>{
    if(!req.params.id) return res.status(400).send("id is required")
        try{
            const articleLivre = await ArticleLivre.findOne({_id : req.params.id})
            if(articleLivre == undefined || articleLivre == null) return res.sendStatus(404)
            const articleMarche = await ArticleMarche.findOne({_id : articleLivre.article_marche_id})
            const marche = await Marche.findOne({_id : articleMarche.marche_id})
            res.json(
                {
                    ...articleLivre._doc,
                    marche : marche.reference,
                    numAR : articleMarche.Numero,
                    type_id : articleMarche.type_id,
                    marque : articleMarche.marque,
                    prix_unitaire : articleMarche.prix_unitaire
                }
            )
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
        
}

const getArticleByEntite = async (req,res)=>{
    if(!req.params.id) return res.status(400).send("id required")
        try{
            const affectations = await Affectation.find({$and : [{entiteAdmin_id : req.params.id},{date_recuperation : {$exists : false}}]})
            if(affectations.length == 0) return res.send([])
            const articleLivres = await ArticleLivre.find({_id : {$in : affectations.map((e)=>e.article_livre_id)}})
            const articleMarches = await ArticleMarche.find({_id : {$in : articleLivres.map(e=>e.article_marche_id)}})
            let articleLivres_V = await Promise.all(articleLivres.map(async (e)=>{
                const paraInfo = await findParaInfo(e.article_marche_id)
                const ar = articleMarches.filter(el=> e.article_marche_id == el._id)[0]
                const aff = affectations.filter(el=> e._id == el.article_livre_id)[0]
                return{
                    ...e._doc,
                    paraInfo,
                    numAR : ar.Numero,
                    type_id : ar.type_id,
                    marque : ar.marque,
                    prix_unitaire : ar.prix_unitaire,
                    date_affectation : aff.date_affectation
                }
            }))
            res.json(articleLivres_V)
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const findParaInfo = async (articleId)=>{
    try{
        const articleMarche = await ArticleMarche.findOne({_id : articleId})
        const marche = await Marche.findOne({_id : articleMarche.marche_id})
        return new Promise(resolve=> resolve({"marche" : marche.reference , "article" : articleMarche.Numero})) ;
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}

const getArticlebyMarche = async(req,res)=>{
    if(!req.params.id) return res.status(400).send("id is required")
        try{
            const articleMarches = await ArticleMarche.find({marche_id : req.params.id})
            if(articleMarches.length == 0) return res.send([])
            const articleLivres = await ArticleLivre.find({article_marche_id : {$in : articleMarches.map(e=>e._id)}})
            res.json(articleLivres.map((e)=>{
                const ar = articleMarches.filter(el=> e.article_marche_id == el._id)[0]
                return {
                    ...e._doc,
                    numAR : ar.Numero,
                    type_id : ar.type_id,
                    marque : ar.marque,
                    prix_unitaire : ar.prix_unitaire
                }
            }))
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const getArticleBySerie = async (req,res)=>{
    if(!req.params.num) return res.status(400).send("numero de serie is required")
        try{
            const articleLivre = await ArticleLivre.find({Numero_Serie : req.params.num})
            if(articleLivre.length == 0) return res.send([])
            const articleMarche = await ArticleMarche.findOne({_id : articleLivre[0].article_marche_id})
            const marche = await Marche.findOne({_id : articleMarche.marche_id})
            res.json(articleLivre.map((e)=>{
                return {
                    ...e._doc,
                    marche : marche.reference,
                    numAR : articleMarche.Numero,
                    type_id : articleMarche.type_id,
                    marque : articleMarche.marque,
                    prix_unitaire : articleMarche.prix_unitaire
                }
            }))
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const getItems = async (req,res)=>{
    if(!req.body.itemsId) return res.send("ids are required")
        try{
            const articleLivres = await ArticleLivre.find({_id : {$in : req.body.itemsId}})
            if(articleLivres.length == 0) return res.send([])
            const articleMarches = await ArticleMarche.find({_id : {$in : articleLivres.map(e=>e.article_marche_id)}})
            const types = await Type.find()
            res.json(articleLivres.map((e)=>{
                    const articleM = articleMarches.filter(el=>el._id == e.article_marche_id)[0]
                    return {
                        design : types.filter(el=>el._id == articleM.type_id)[0]?.libelle + " (n°" + e.Numero + ") ",
                        marque : articleM.marque,
                        serie : e.Numero_Serie
                    }
            }))
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

module.exports = {getArticleLivres, addArticleLivre,UpdateArticleLivre,deleteArticleLivre,getArticleByArticleMarche,getArticleLivre,getArticleByEntite,getArticlebyMarche,getArticleBySerie,deleteByArticleMarche , getItems}