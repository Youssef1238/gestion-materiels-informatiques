import api from '@/utils/Api'



export default async function SubmitExcelSubArticle(row ,setExcelResult,setErrors,Id){
    const res = await api.get(`http://localhost:5500/articleMarche/${Id}`)
    const Article = res.data

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
        row["Date de Livraison"] = parsed
        return "";
    }
    function ValidateInput(numero,serie,date,cab){
        const regex1 = /^[A-Z0-9]+$/;
        const regex2 = /^[0-9]+$/;

        const number = Number(numero)
        const errorDate = validateDate(date)
        const errorNumber = numero? regex2.test(numero)?number <= 0 || number > Article.quantite ?"Numero Invalid":"":"caractére Invalid dans numero!":"Numero Obligatoire"
        const errorSerie = serie && serie.trim() == "" ?"Serie Obligatoire":regex1.test(serie.trim())?"":"caractére Invalid dans Serie!"
        const errorCAB = cab && cab.trim() == ""?"Cab Obligatoire":regex1.test(cab.trim())?"":"caractére Invalid dans CAB!"
        
        const error = [errorSerie,errorCAB,errorDate,errorNumber]
        return error
    }
    

    const error = ValidateInput(row["Numero"],row["Numero de Serie"],row["Date de Livraison"],row["CAB"])
    
    if(error.join("") == ""){
        await api.post('http://localhost:5500/articleLivre',{
            article_marche_id : Id,
            Numero : row["Numero"],
            Numero_Serie : row["Numero de Serie"],
            date_Livraison : new Date(row["Date de Livraison"]),
            cab : row["CAB"],
            etat : false
        })
        
        setExcelResult(prv=>[prv[0] + 1 , prv[1]])
    }else{
        const rowNumber = "L" + row["__rowNum__"]
        const filtredErr = error.filter(e=>e!="")
        setErrors(err=>{return {...err , [rowNumber]: filtredErr}})
        setExcelResult(prv=>[prv[0] , prv[1] + 1])
    }


}
