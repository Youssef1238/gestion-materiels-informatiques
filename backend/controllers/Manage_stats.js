require('../config/DBconnect')
const ArticleLivre = require('../models/articleLivreSchema')
const Affectation = require('../models/affectationSchema')
const Marche = require('../models/marcheSchema')
const ArticleMarche = require('../models/articleMarcheSchema')
const Type = require('../models/typeArticleSchema')
const EntiteAdmin = require('../models/entiteAdminSchema')
const Fournisseur = require('../models/fourinsseurSchema')




const stats = async (req,res)=>{
    try{
        const marches = await Marche.find()
        const fournisseurs = await Fournisseur.find()
        const articles = await ArticleLivre.find()
        const entiteAdmins = await EntiteAdmin.find()
        const Affectations = await Affectation.find()
        const types = await Type.find()
        const articleMarches = await ArticleMarche.find()
        
        const MARCHE ={
                NB_M :  marches.length,
                NB_F : fournisseurs.length,
                Moyen_MF : fournisseurs.length == 0 || marches.length == 0 ? 0 :(marches.length / fournisseurs.length).toFixed(1),
                Moyen_AM : articles.length == 0 || marches.length == 0 ? 0 :(articles.length / marches.length).toFixed(1)
            } 
        let ENTITEADMIN ={}
        if(Affectations.length == 0){
            ENTITEADMIN = {
                NB : entiteAdmins.length,
                Aff : 0,
                Non_Aff : (entiteAdmins.length),
                Moyen_AE : 0
        }
        }else{
            const Aff = [...new Set(Affectations.filter((e)=>e.date_recuperation == undefined).map((e)=>e.entiteAdmin_id))].length
            ENTITEADMIN = {
                    NB : entiteAdmins.length,
                    Aff : Aff,
                    Non_Aff : (entiteAdmins.length - Aff),
                    Moyen_AE : (Affectations.filter((e)=>e.date_recuperation == undefined).length / entiteAdmins.length).toFixed(1)
            }
        }
        
        const ARTICLE = {
                    NB_TOT : articles.length,
                    Aff : articles.length==0?0:articles.filter((e)=> e.etat).length,
                    Non_Aff : articles.length==0?0:articles.filter((e)=> !e.etat).length
            }
        

        const AFFECTATION = {
                    ToT : Affectations.length,
                    Aff_J : Affectations.length ==0?0:Affectations.filter((e)=>new Date(e.date_affectation).toISOString().split('T')[0] == new Date().toISOString().split('T')[0]).length,
                    Aff_M : Affectations.length ==0?0:Affectations.filter((e)=>new Date(e.date_affectation).toISOString().split('T')[0].slice(0, -3) == new Date().toISOString().split('T')[0].slice(0, -3)).length,
                    Aff_An :Affectations.length ==0?0: Affectations.filter((e)=>new Date(e.date_affectation).toISOString().split('T')[0].slice(0, 4) == new Date().toISOString().split('T')[0].slice(0, 4)).length,
            }
        let PRIX = {}
        if(articleMarches.length == 0){
            PRIX = {
                ToT : 0,
                PEC :  0,
                MPC :  ""
            }
        }else{
            const MPC = articleMarches.find((el)=>el.prix_unitaire == Math.max(...articleMarches.map(e=>e.prix_unitaire)))
            PRIX = {
                    ToT : articleMarches.reduce((a,b)=> a+b.prix_totale, 0),
                    PEC :  (100 - (articleMarches.reduce((a,b)=>a + Math.abs(b.prix_unitaire - b.prix_estimatif) ,0) / articleMarches.reduce((a,b)=> a+b.prix_unitaire, 0)) * 100).toFixed(2),
                    MPC :  MPC?.marque+"(" +types.find((e)=>e._id == MPC.type_id).libelle+")" || ""
            }
        }
        
        let TYPE_PRIX  = {}
        if(types.length ==  0){
        }else{
            TYPE_PRIX = Array.from(types.map((e)=>{
                return {
                        libelle : e.libelle,
                        MP : articleMarches.filter(a=>a.type_id == e._id).reduce((a,b)=>a+b.prix_unitaire,0) / articleMarches.filter(a=>a.type_id == e._id).length.toFixed(1) 
                }
                }))
        }
         
                
            
        res.json({
            MARCHE : MARCHE,
            ENTITEADMIN : ENTITEADMIN,
            ARTICLE : ARTICLE,
            AFFECTATION : AFFECTATION,
            PRIX : PRIX,
            TYPE_PRIX : TYPE_PRIX
        })
    }catch(err){
        res.status(500).json({title : "Server error",message : err.message})
    }
    
    
    
    
}












module.exports = stats