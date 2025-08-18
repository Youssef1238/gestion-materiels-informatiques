import api from '@/utils/Api'



export default async function SubmitExcelEntitéAdmin(row ,setExcelResult,setErrors){
    function ValidateInput(libelleAR,libelleFR){
        const regex1 = /[^A-Za-z\s]/;
        const regex2 = /^[\u0600-\u06FF\s]+$/;

        const errorLibelleFR = libelleFR?regex1.test(libelleFR)?"juste a-z A-Z sont accepté pour Libelle en Français":libelleFR.trim() == ""?"Libelle en Français est Obligatoire":"":"Libelle en Français est Obligatoire"
        const errorLibelleAR = libelleAR?!regex2.test(libelleAR)?"juste les lettres arabes sont accepté pour Libelle en Arabe":libelleAR.trim() == ""?"Libelle en Arabe est Obligatoire":"":"Libelle en Arabe est Obligatoire"
        const error = [errorLibelleFR , errorLibelleAR]
        
        return error
    }
    

    const error = ValidateInput(row["Libelle en Arabe"], row["Libelle en Français"]);
    
    if(error.join("") == ""){
        await api.post('http://localhost:5500/entiteAdmin',{
                    libelle_ar : row["Libelle en Arabe"].trim(),
                    libelle_fr : row["Libelle en Français"].trim(),
                })
        
        setExcelResult(prv=>[prv[0] + 1 , prv[1]])
    }else{
        const rowNumber = "L" + row["__rowNum__"]
        setErrors(err=>{return {...err , [rowNumber]: error}})
        setExcelResult(prv=>[prv[0] , prv[1] + 1])
    }


}
