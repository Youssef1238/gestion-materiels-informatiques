
require('../config/DBconnect')
const EntiteAdmin = require('../models/entiteAdminSchema')
const Affectation = require('../models/affectationSchema')
const entieLog = require('../models/entiteLogSchema')
const ArticleLivre = require('../models/articleLivreSchema')
const ArticleMarche = require('../models/articleMarcheSchema')

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
        return res.status(400).send("Tous les champs sont obligatoires.")
    }
    try{
        let foundEntiteAdmin = await EntiteAdmin.findOne({libelle_ar: req.body.libelle_ar});
        if(foundEntiteAdmin) return res.status(409).send("libelle en Arabe existe déjà !")
        foundEntiteAdmin = await EntiteAdmin.findOne({libelle_fr: req.body.libelle_fr});
        if(foundEntiteAdmin) return res.status(409).send("libelle en Français existe déjà !") 
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
    if(!req.body.id) res.status(403).send("id requis.")
        try{
            const item = await EntiteAdmin.findOne({_id : req.body.id})
            if(!item) return res.sendStatus(404)
            let foundEntiteAdmin = await EntiteAdmin.findOne({libelle_ar: req.body.libelle_ar ,_id : {$ne: req.body.id}});
            if(foundEntiteAdmin) return res.status(409).send("libelle en Arabe existe déjà !")
            foundEntiteAdmin = await EntiteAdmin.findOne({libelle_fr: req.body.libelle_fr ,_id : {$ne: req.body.id}});
            if(foundEntiteAdmin) return res.status(409).send("libelle en Français existe déjà !")
            req.body.libelle_ar && await EntiteAdmin.updateOne({_id : req.body.id},{$set : {libelle_ar : req.body.libelle_ar}});
            req.body.libelle_fr && await EntiteAdmin.updateOne({_id : req.body.id},{$set : {libelle_fr : req.body.libelle_fr}});
            res.send("Mis à jour avec succès.")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const deleteEntiteAdmin = async(req,res)=>{
    if(!req.body.id) res.status(403).send("id requis.")
        try{
            const item = await EntiteAdmin.findOne({_id : req.body.id})
            if(!item) return res.sendStatus(404)
            await Affectation.deleteMany({entiteAdmin_id : req.body.id})
            await entieLog.deleteMany({entiteAdmin_id : req.body.id})
            await EntiteAdmin.deleteOne({_id : req.body.id})
            res.send("Supprimé avec succès.")
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}

const getEntiteAdmin = async (req,res)=>{
    if(!req.params.id) return res.status(400).send('id requis.')
    try{
        const entiteAdmin = await EntiteAdmin.findOne({_id : req.params.id})
        res.json(entiteAdmin)
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
}
const searchEntiteAdmin = async (req,res)=>{
    
    try {
        if (!req.params.query) {
            return res.status(400).send("libelle requis.");
        }
        const regex = new RegExp(req.params.query, 'i');
        const EntiteAdmins = await EntiteAdmin.find({ libelle_fr: { $regex: regex } });
        if (!EntiteAdmins || EntiteAdmins.length === 0) {
            return res.status(404).send("Aucun Entité Admin trouvé");
        }
        
        const result = EntiteAdmins.map(EntiteAdmin => ({
            id : EntiteAdmin._id , label : EntiteAdmin.libelle_fr
        }));
        res.json(result);
    } catch (err) {
        res.status(500).json({ title: "Server error", message: err.message });
    }
    
}

const getEntiteAdminStats = async (req,res)=>{
    
    if(!req.params.id) return res.status(400).send("id requis.")
        try{
            const totalAffectations = await Affectation.countDocuments({ entiteAdmin_id: req.params.id });

            const affectations = await Affectation.find({
                entiteAdmin_id: req.params.id,
                date_recuperation: { $exists: false }
            });

            if (!affectations.length) {
                return res.json({ Total: totalAffectations, Current: 0, Value: 0 , monthStats: {}});
            }

            const articleLivreIds = affectations.map(a => a.article_livre_id);
            const articleLivres = await ArticleLivre.find({ _id: { $in: articleLivreIds } });

            const articleMarcheIds = articleLivres.map(al => al.article_marche_id);
            const articleMarches = await ArticleMarche.find({ _id: { $in: articleMarcheIds } });

            const articleMarcheMap = new Map(articleMarches.map(am => [String(am._id), am]));

            const articleLivres_V = articleLivres.map( (e) => {
                const ar = articleMarcheMap.get(String(e.article_marche_id));
                return {
                    ...e._doc,
                    prix_unitaire: ar?.prix_unitaire || 0,
                };
            })

            const Value = articleLivres_V.reduce((sum, item) => sum + (item.prix_unitaire || 0), 0);
            const monthsStats = await Affectation.aggregate([
                {
                    $match: {
                        entiteAdmin_id: req.params.id
                    }
                },
                {
                    $facet: {
                        affectations: [
                            { $match: { date_affectation: { $exists: true } } },
                            {
                                $group: {
                                    _id: { $dateToString: { format: "%Y-%m", date: "$date_affectation" } },
                                    totalAffectations: { $sum: 1 }
                                }
                            }
                        ],
                        recuperations: [
                            { $match: { date_recuperation: { $exists: true } } },
                            {
                                $group: {
                                    _id: { $dateToString: { format: "%Y-%m", date: "$date_recuperation" } },
                                    totalRecuperations: { $sum: 1 }
                                }
                            }
                        ]
                    }
                }
            ]);

            const affectationsByMonth = monthsStats[0]?.affectations || [];
            const recuperationsByMonth = monthsStats[0]?.recuperations || [];
            const allMonths = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            function buildMonthMap(data, valueKey) {
                const map = {};
                data.forEach(item => {
                    const [year, month] = item._id.split('-');
                    if (!map[year]) map[year] = {};
                    map[year][parseInt(month, 10) - 1] = item[valueKey];
                });
                return map;
            }

            const affectationsMap = buildMonthMap(affectationsByMonth, 'totalAffectations');
            const recuperationsMap = buildMonthMap(recuperationsByMonth, 'totalRecuperations');

            const years = Array.from(new Set([
                ...Object.keys(affectationsMap),
                ...Object.keys(recuperationsMap)
            ]));

            const monthStats = {};
            years.forEach(year => {
                monthStats[year] = {
                    affectations: allMonths.map((_, idx) => affectationsMap[year]?.[idx] || 0),
                    recuperations: allMonths.map((_, idx) => recuperationsMap[year]?.[idx] || 0)
                };
            });
            res.json(
                {
                    Total: totalAffectations,
                    Current: affectations.length,
                    Value,
                    monthStats
                });
        }catch(err){
            res.status(500).json({title : "Server error",message : err.message})
        }
    
}


module.exports = {getEntiteAdmins, addEntiteAdmin,UpdateEntiteAdmin,deleteEntiteAdmin,getEntiteAdmin,searchEntiteAdmin,getEntiteAdminStats}