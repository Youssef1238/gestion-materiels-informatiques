import {BoxIcon, Building2, Handshake,StoreIcon, TagIcon, User2 } from "lucide-react";

const getEntityInfo = (isAdmin) => {
    const placeholder = {
        "Marché": "Filtrer selon la référence de marché",
        "Entité Admin.": "Filtrer selon le nom de l'entité",
        "Article": "Filtrer selon le serial nombre de l'article",
        "Fournisseur": "Filtrer selon le nom du fournisseur",
        "Type de matériel": "Filtrer selon le type de matériel", 
        ...(isAdmin && { "Compte": "Filtrer selon le nom d'utilisateur" })
    } 
    const icons = {
        "Marché": <StoreIcon size={32} color="#818cf8"/>,
        "Entité Admin.": <Building2 size={32} color="#22c55e"/>,
        "Article": <BoxIcon size={32} color="#06b6d4"/>,
        "Fournisseur": <Handshake size={32} color="#f59e0b" />,
        "Type de matériel": <TagIcon size={32} color="#a855f7"/>, 
        ...(isAdmin && { "Compte": <User2 size={32} color="#f43f5e"/> })
    } 
    const apiRoute = {
        "Marché": "marche",
        "Entité Admin.": "entiteAdmin",
        "Article": "articleLivre",
        "Fournisseur": "fournisseur" ,
        "Type de matériel": "type" , 
        ...(isAdmin && { "Compte":  "user" })
    }
    const searchFunc = {
        "Marché": (data, query) => data.filter(e => !query || e.reference === query || e.reference.split('/').includes(query)),
        "Entité Admin.": (data, query) => data.filter(e => !query || e.libelle_fr.toLowerCase().split(' ').includes(query.toLowerCase())),
        "Article": (data, query) => data.filter(e => !query || e.Numero_Serie.toLowerCase().includes(query.toLowerCase())),
        "Fournisseur": (data, query) => data.filter(e => !query || e.nom.toLowerCase().split(' ').includes(query.toLowerCase())),
        "Type de matériel": (data, query) => data.filter(e => !query || e.libelle.toLowerCase().split(' ').includes(query.toLowerCase())),
        ...(isAdmin && { "Compte": (data, query) => data.filter(e => !query || e.pseudo.toLowerCase().includes(query.toLowerCase())) })
    }
    const ExcelHeaders = {
        "Marché": ["Objet","Reference","Type","Fournisseur","Date de Creation"],
        "Entité Admin.": ["Libelle en Arabe", "Libelle en Français"],
        "Fournisseur": ["Nom","Qualite","Societe","Capital","Patente","RC Lieu","RC Numero","CNSS","Adresse","RIB"],
        "Type de matériel": ["Ordre", "Libelle"], 
        "Article" : ["Numero","Type","Marque","Description","Quantite","Prix estimatif","Prix unitaire"],
        "subArticle" : ["Numero","Numero de Serie","Date de Livraison","CAB"],
    } 
    const entityClasses = {
        "Marché": { bg : "bg-indigo-600",border: "border-indigo-300" , shadow: "hover:shadow-indigo-300", gradient: "from-indigo-300 to-indigo-600" },
        "Entité Admin.": { bg : "bg-green-600", border: "border-green-300", shadow: "hover:shadow-green-300",gradient: "from-green-300 to-green-600" },
        "Article": { bg : "bg-cyan-600", border: "border-cyan-300", shadow: "hover:shadow-cyan-300",gradient: "from-cyan-300 to-cyan-600" },
        "Fournisseur": { bg : "bg-amber-600", border: "border-amber-300", shadow: "hover:shadow-amber-300",gradient: "from-amber-300 to-amber-600" },
        "Type de matériel": { bg : "bg-violet-600", border: "border-violet-300", shadow: "hover:shadow-violet-300",gradient: "from-violet-300 to-violet-600" },
        ...(isAdmin && { "Compte": { bg : "bg-rose-600", border: "border-rose-300", shadow: "hover:shadow-rose-300",gradient: "from-rose-300 to-rose-600" } })
    };


    return {placeholder, icons , apiRoute , searchFunc , ExcelHeaders, entityClasses}
}



export default getEntityInfo;