import api from '@/utils/Api'

function ValidateInput(nom,qualite,societe,capital,patente,RCLieu,RCNum,CNSS,adresse,RIB){
        const regex1 = /^[a-zA-Z ]+$/;
        const regex2 = /^[0-9]+$/;
        const regex3 = /^[a-zA-Z0-9° ]+$/;

        const errorNom = nom?regex1.test(nom)?nom.trim() == ""?"Nom est Obligatoire":"":"juste a-z A-Z sont accepté pour Nom":"Nom est Obligatoire"
        const errorQualite = qualite?regex1.test(qualite)?qualite.trim() == ""?"Qualité est Obligatoire":"":"juste a-z A-Z sont accepté pour Qualité":"Qualité est Obligatoire"
        const errorSociete = societe?regex1.test(societe)?societe.trim() == ""?"Société est Obligatoire":"":"juste a-z A-Z sont accepté pour Société":"Société est Obligatoire"
        const errorCapital = capital && regex2.test(capital)?capital <= 0?"Format Incorrecte de Capital":"":"Capital (Nombre) est Obligatoire"
        const errorPatente = patente && regex2.test(patente)?patente <= 0?"Format Incorrecte de Patente":"":"Patente (Nombre) est Obligatoire"
        const errorRCLieu = RCLieu ?regex3.test(RCLieu)?RCLieu.trim() == ""?"RCLieu est Obligatoire":"":"Format Incorrecte de RCLieu":"RCLieu est Obligatoire"
        const errorRCNum = RCNum && regex2.test(RCNum)?RCNum <= 0?"Format Incorrecte de RCNum":"":"Capital (Nombre) est RCNum"
        const errorCNSS = CNSS && regex2.test(CNSS)?CNSS <= 0?"Format Incorrecte de CNSS":"":"CNSS (Nombre) est Obligatoire"
        const errorAdresse = adresse?regex3.test(adresse)?adresse.trim() == ""?"Adresse est Obligatoire":"":"Format Incorrecte de Adresse":"Adresse est Obligatoire"
        const errorRIB = RIB && regex2.test(RIB)?RIB <= 0?"Format Incorrecte de RIB":"":"RIB (Nombre) est Obligatoire"
        const error = [errorNom , errorQualite , errorSociete , errorCapital , errorPatente , errorRCLieu , errorRCNum , errorCNSS , errorAdresse , errorRIB]
        return error
        
}

export default async function SubmitExcelFournisseur(row ,setExcelResult , setErrors){
        
        const error = ValidateInput(row["Nom"],row["Qualite"],row["Societe"],row["Capital"],row["Patente"],row["RC Lieu"],
                    row["RC Numero"],row["CNSS"],row["Adresse"],row["RIB"])
        if(error.join("") == ""){
            await api.post('http://localhost:5500/fournisseur',{
                        nom : row["Nom"].trim(),
                        qualite : row["Qualite"].trim(),
                        nom_societe : row["Societe"].trim(),
                        capital : row["Capital"],
                        patente : row["Patente"],
                        RC_lieu : row["RC Lieu"].trim(),
                        RC_num : row["RC Numero"],
                        CNSS : row["CNSS"],
                        adresse : row["Adresse"].trim(),
                        RIB : row["RIB"],
                    })
            
            setExcelResult(prv=>[prv[0] + 1 , prv[1]])
        }else{
            const rowNumber = "L" + row["__rowNum__"]
            setErrors(err=>{return {...err , [rowNumber]: error}})
            setExcelResult(prv=>[prv[0] , prv[1] + 1])
        }


}
