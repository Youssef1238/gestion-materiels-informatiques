import api from '@/utils/Api'
export default async function SubmitExcelMarché(row ,setExcelResult, setErrors){
    const res = await api.get('http://localhost:5500/fournisseur')
    const fournisseurs = res.data
    function excelDateToJSDate(date) {
        if(typeof date !== "number") return new Date(date)
        const utc_days  = Math.floor(date - 25569);
        const utc_value = utc_days * 86400;
        return new Date(utc_value * 1000);
    }

    function validateDate(date) {
        if (!date && date !== 0) return "Date est Obligatoire";
        const parsed = excelDateToJSDate(date);
        if (!(parsed instanceof Date) || isNaN(parsed.getTime())) return "Format incorrecte pour la date";
        row["Date de Creation"] = parsed
        return "";
    }
    async function ValidateExcelInput(objet,reference,type,fournisseurInput,date){
        
        const regex1 = /^[a-zA-Z0-9 ]+$/;
        const regex2 = /^[a-zA-Z ]+$/;
        const regex3 = /^\d+\/\d{2}$/;

        const errorObjet = objet?regex1.test(objet)?objet.trim() == ""?"Objet est Obligatoire":"":"juste a-z A-Z sont accepté pour Objet":"Objet est Obligatoire"
        const errorReference = reference?regex3.test(reference)?reference.trim() == ""?"Reference est Obligatoire":"":"Format incorrecte utiliser 'xxxx/yy'":"Reference est Obligatoire"
        const errorType = type?type.trim() == ""?"Type est Obligatoire":regex1.test(type)?"":"juste a-z A-Z sont accepté pour Type":"Type est Obligatoire"
        const errorFournisseur = fournisseurInput?regex2.test(fournisseurInput)?fournisseurInput.trim() == ""?"Fournisseur est Obligatoire":fournisseurs.map(e=>e.nom.toLowerCase()).includes(fournisseurInput.trim().toLowerCase())?"":"Invalid Fournisseur ou n'est pas encore Ajouté":"juste a-z A-Z sont accepté pour Fournisseur":"Fournisseur est Obligatoire"
        const errorDate = validateDate(date)
        const error = [errorObjet , errorReference , errorType , errorFournisseur , errorDate]
        return error
    }   
        const error = await ValidateExcelInput(row["Objet"],row["Reference"],row["Type"],row["Fournisseur"],row["Date de Creation"])
        if(error.join("") == ""){
                await api.post('http://localhost:5500/marche',{
                    objet : row["Objet"].trim(),
                    reference : row["Reference"],
                    type : row["Type"].trim(),
                    fournisseur_id : fournisseurs.find(el=>el.nom.toLowerCase() == row["Fournisseur"].trim().toLowerCase())._id,
                    date_creation : excelDateToJSDate(row["Date de Creation"])
                })
            setExcelResult(prv=>[prv[0] + 1 , prv[1]])
        }else{
            const rowNumber = "L" + row["__rowNum__"]
            const filtredErr = error.filter(e=>e!="")
            setErrors(err=>{return {...err , [rowNumber]: filtredErr}})
            setExcelResult(prv=>[prv[0] , prv[1] + 1])
        }


}
