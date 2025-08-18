import {BoxIcon, Building2, Handshake,StoreIcon, TagIcon, User2 } from "lucide-react";

const getEntityInfo = (isAdmin) => {
    const placeholder = {
        "Marché": "Entrer la référence de marché",
        "Entité Admin.": "Entrer le nom de l'entité",
        "Article": "Entrer le serial nombre de l'article",
        "Fournisseur": "Entrer le nom du fournisseur",
        "Type de matériel": "Entrer le type de matériel", 
        ...(isAdmin && { "Compte": "Entrer le nom de l'utilisateur" })
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
        "Marché": (data,query)=> data.filter(e=> !query || e.reference == query),
        "Entité Admin.": (data,query)=> data.filter(e=>!query || e.libelle_fr == query),
        "Article": (data,query)=> data.filter(e=>!query || e.Numero_Serie == query),
        "Fournisseur": (data,query)=> data.filter(e=>!query || e.nom == query),
        "Type de matériel": (data,query)=> data.filter(e=>!query || e.libelle == query),
        ...(isAdmin && { "Compte":  (data,query)=> data.filter(e=>!query || e.pseudo == query), })
    }
    const ExcelHeaders = {
        "Marché": ["Objet","Reference","Type","Fournisseur","Date de Creation"],
        "Entité Admin.": ["Libelle en Arabe", "Libelle en Français"],
        "Fournisseur": ["Nom","Qualite","Societe","Capital","Patente","RC Lieu","RC Numero","CNSS","Adresse","RIB"],
        "Type de matériel": ["Ordre", "Libelle"], 
    } 

    return {placeholder, icons , apiRoute , searchFunc , ExcelHeaders}
}



export default getEntityInfo;