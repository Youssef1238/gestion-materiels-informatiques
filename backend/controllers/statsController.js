require('../config/DBconnect')
const ArticleLivre = require('../models/articleLivreSchema')
const Affectation = require('../models/affectationSchema')
const Marche = require('../models/marcheSchema')
const ArticleMarche = require('../models/articleMarcheSchema')
const EntiteLog = require('../models/entiteLogSchema')




const stats = async (req,res)=>{
    try {
        // Get all data
        const marches = await Marche.find();
        const articles = await ArticleLivre.find();
        const articleMarches = await ArticleMarche.find();
        const entiteLogs = await EntiteLog.find();
        const affectations = await Affectation.find();

        // Dates
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const thisMonth = todayStr.slice(0, 7);
        const thisYear = todayStr.slice(0, 4);

        // Helper functions
        const isSameDay = (date) => new Date(date).toISOString().split('T')[0] === todayStr;
        const isSameMonth = (date) => new Date(date).toISOString().slice(0, 7) === thisMonth;
        const isSameYear = (date) => new Date(date).toISOString().slice(0, 4) === thisYear;

        // Marchés stats
        const marchesToday = marches.filter(m => m.date_creation && isSameDay(m.date_creation));
        const marchesMonth = marches.filter(m => m.date_creation && isSameMonth(m.date_creation));
        const marchesYear = marches.filter(m => m.date_creation && isSameYear(m.date_creation));

        // Articles stats
        const articlesToday = articles.filter(a => a.date_Livraison && isSameDay(a.date_Livraison));
        const articlesMonth = articles.filter(a => a.date_Livraison && isSameMonth(a.date_Livraison));
        const articlesYear = articles.filter(a => a.date_Livraison && isSameYear(a.date_Livraison));

        // Valeur  
        // Use the date_creation of the marché that the articleMarche belongs to
        const getMarcheDate = (articleMarche) => {
            const marche = marches.find(m => m._id.toString() === articleMarche.marche_id.toString());
            return marche ? marche.date_creation : null;
        };

        const totalValeur = articleMarches.reduce((sum, a) => sum + (a.prix_totale || 0), 0);
        const valeurToday = articleMarches
            .filter(a => {
            const date = getMarcheDate(a);
            return date && isSameDay(date);
            })
            .reduce((sum, a) => sum + (a.prix_totale || 0), 0);
        const valeurMonth = articleMarches
            .filter(a => {
            const date = getMarcheDate(a);
            return date && isSameMonth(date);
            })
            .reduce((sum, a) => sum + (a.prix_totale || 0), 0);
        const valeurYear = articleMarches
            .filter(a => {
            const date = getMarcheDate(a);
            return date && isSameYear(date);
            })
            .reduce((sum, a) => sum + (a.prix_totale || 0), 0);

        // Actions 
        const actionsTotal = entiteLogs.length;
        const actionsToday = entiteLogs.filter(log => log.date && isSameDay(log.date)).length;
        const actionsMonth = entiteLogs.filter(log => log.date && isSameMonth(log.date)).length;
        const actionsYear = entiteLogs.filter(log => log.date && isSameYear(log.date)).length;

        // Affectation et recuperation cette année (par mois)
        const affectationByMonth = Array(12).fill(0);
        const recuperationByMonth = Array(12).fill(0);

        affectations.forEach(a => {
            if (a.date_affectation && new Date(a.date_affectation).getFullYear() == thisYear) {
                const month = new Date(a.date_affectation).getMonth();
                affectationByMonth[month]++;
            }
            if (a.date_recuperation && new Date(a.date_recuperation).getFullYear() == thisYear) {
                const month = new Date(a.date_recuperation).getMonth();
                recuperationByMonth[month]++;
            }
        });

        // Nombre des articles affecté et non
        // Assuming 'etat' true = affecté, false = non affecté
        const nbAffecte = articles.filter(a => a.etat).length;
        const nbNonAffecte = articles.filter(a => !a.etat).length;

        res.json({
            marches: {
                total: marches.length,
                today: marchesToday.length,
                month: marchesMonth.length,
                year: marchesYear.length
            },
            articles: {
                total: articles.length,
                today: articlesToday.length,
                month: articlesMonth.length,
                year: articlesYear.length
            },
            valeur: {
                total: totalValeur,
                today: valeurToday,
                month: valeurMonth,
                year: valeurYear
            },
            actions: {
                total: actionsTotal,
                today: actionsToday,
                month: actionsMonth,
                year: actionsYear
            },
            Monthstats: {
                affectations: affectationByMonth,
                recuperations: recuperationByMonth
            },
            articles_affecte: nbAffecte,
            articles_non_affecte: nbNonAffecte
        });
    } catch (err) {
        res.status(500).json({ title: "Server error", message: err.message });
    }
    
    
    
    
}

const MarchéStats = async (req,res)=>{
    try {
        const { id } = req.params;

        const marche = await Marche.findById(id);
        if (!marche) {
            return res.status(404).json({ message: "Aucun marché trouvé" });
        }

        const articleMarches = await ArticleMarche.find({ marche_id: id });

        const totalArticles = articleMarches.length;
        const totalValue = articleMarches.reduce((sum, a) => sum + (a.prix_totale || 0), 0);

        const articleMarcheIds = articleMarches.map(a => a._id);
        const articleLivres = await ArticleLivre.find({ article_marche_id: { $in: articleMarcheIds } });

        const affectedNB = articleLivres.filter(a => a.etat).length;
        const non_affectedNB = articleLivres.filter(a => !a.etat).length;

        res.json({
            totalArticles,
            totalValue,
            affectedNB,
            non_affectedNB
        });
    } catch (err) {
        res.status(500).json({ title: "Server error", message: err.message });
    }
    
    
    
    
}











module.exports = {stats,MarchéStats}