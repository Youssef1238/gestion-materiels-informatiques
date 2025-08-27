
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
        return res.status(400).send("Tous les champs sont obligatoires.")
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
    if(!req.body.id) res.status(400).send("id requis.")
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
        res.send("Mis à jour avec succès")
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }      
    
}

const deleteArticleLivre = async(req,res)=>{
    if(!req.body.id) res.status(400).send("id requis.")
    try{
        const articleLivre = await ArticleLivre.findOne({_id : req.body.id})
        if(!articleLivre) return res.sendStatus(404)
        await ArticleLivre.deleteOne({_id : req.body.id})
        res.send("Supprimé avec succès.")
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
        
    
}

const deleteByArticleMarche = async(req,res)=>{
    if(!req.params.id) res.status(400).send("id requis.")
        try{
            const articleLivre = await ArticleLivre.findOne({article_marche_id : req.params.id})
            if(!articleLivre) return res.sendStatus(404)
            await ArticleLivre.deleteMany({article_marche_id : req.params.id})
            res.send("Supprimé avec succès.")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const getArticleByArticleMarche = async (req,res)=>{
    if(!req.params.id) return res.status(400).send("id requis.")
    try{
        const articleLivres = await ArticleLivre.find({article_marche_id : req.params.id})
        res.json(articleLivres)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}
const getArticleLivre = async (req,res)=>{
    if(!req.params.id) return res.status(400).send("id requis.")
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
    if(!req.params.id) return res.status(400).send("id requis.")
        try{

            const affectations = await Affectation.find({
                entiteAdmin_id: req.params.id,
                date_recuperation: { $exists: false }
            });

            if (!affectations.length) {
                return res.json([]);
            }

            const articleLivreIds = affectations.map(a => a.article_livre_id);
            const articleLivres = await ArticleLivre.find({ _id: { $in: articleLivreIds } });

            const articleMarcheIds = articleLivres.map(al => al.article_marche_id);
            const articleMarches = await ArticleMarche.find({ _id: { $in: articleMarcheIds } });

            const articleMarcheMap = new Map(articleMarches.map(am => [String(am._id), am]));
            const affectationMap = new Map(affectations.map(a => [String(a.article_livre_id), a]));

            const types = await Type.find({ _id: { $in: articleMarches.map(am => am.type_id) } });
            const typeMap = new Map(types.map(t => [String(t._id), t.libelle]));

            const articleLivres_V = await Promise.all(articleLivres.map(async (e) => {
                const ar = articleMarcheMap.get(String(e.article_marche_id));
                const aff = affectationMap.get(String(e._id));
                let paraInfo = {};
                try {
                    paraInfo = await findParaInfo(e.article_marche_id);
                } catch { paraInfo = {}; }
                return {
                    ...e._doc,
                    paraInfo,
                    numAR: ar?.Numero,
                    type: typeMap.get(String(ar?.type_id)),
                    marque: ar?.marque,
                    prix_unitaire: ar?.prix_unitaire || 0,
                    date_affectation: aff?.date_affectation
                };
            }));


            res.json(articleLivres_V);
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
    if(!req.params.id) return res.status(400).send("id requis.")
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
    if(!req.params.num) return res.status(400).send("Numero de serie requis.")
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
    if (!Array.isArray(req.body.itemsId) || req.body.itemsId.length === 0) {
        return res.status(400).send("Les identifiants sont requis.");
    }
    try {
        const articleLivres = await ArticleLivre.find({ _id: { $in: req.body.itemsId } });
        console.log(articleLivres)
        if (!articleLivres.length) return res.json([]);
        const articleMarcheIds = articleLivres.map(e => e.article_marche_id);
        const articleMarches = await ArticleMarche.find({ _id: { $in: articleMarcheIds } });
        const types = await Type.find({ _id: { $in: articleMarches.map(am => am.type_id) } });

        const articleMarcheMap = new Map(articleMarches.map(am => [String(am._id), am]));
        const typeMap = new Map(types.map(t => [String(t._id), t.libelle]));

        const result = articleLivres.map(e => {
            const articleM = articleMarcheMap.get(String(e.article_marche_id));
            return {
                design: articleM ? `${typeMap.get(String(articleM.type_id)) || ''} (n°${e.Numero})` : '',
                marque: articleM?.marque || '',
                serie: e.Numero_Serie
            };
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ title: "Server error", message: err.message });
    }
    
}

const searchArticleLivre = async (req,res)=>{
    try {
        if (!req.params.query) {
            return res.status(400).send("Numero de serie requis.");
        }
        const regex = new RegExp(req.params.query, 'i');
        const articlesLivres = await ArticleLivre.find({ Numero_Serie: { $regex: regex } });
        if (!articlesLivres || articlesLivres.length === 0) {
            return res.status(404).send("Aucun Article trouvé");
        }
        const articleMarcheIds = articlesLivres.map(al => al.article_marche_id);
        const articleMarches = await ArticleMarche.find({ _id: { $in: articleMarcheIds } });
        const articleMarcheMap = new Map(articleMarches.map(am => [String(am._id), am]));
        const types = await Type.find({ _id: { $in: articleMarches.map(am => am.type_id) } });
        const typeMap = new Map(types.map(t => [String(t._id), t.libelle])); 
        const articleLivres_V = await Promise.all(articlesLivres.map(async (e) => {
            const ar = articleMarcheMap.get(String(e.article_marche_id));
            let paraInfo = {};
            try {
                paraInfo = await findParaInfo(e.article_marche_id);
            } catch { paraInfo = {}; }
            return {
                ...e._doc,
                paraInfo,
                numAR: ar?.Numero,
                type: typeMap.get(String(ar?.type_id)),
                marque: ar?.marque,
                prix_unitaire: ar?.prix_unitaire || 0,
            };
        }));
        res.json(articleLivres_V)
    } catch (err) {
        res.status(500).json({ title: "Server error", message: err.message });
    }
    
}

module.exports = {getArticleLivres, addArticleLivre,UpdateArticleLivre,deleteArticleLivre,getArticleByArticleMarche,getArticleLivre,getArticleByEntite,getArticlebyMarche,getArticleBySerie,deleteByArticleMarche , getItems,searchArticleLivre}