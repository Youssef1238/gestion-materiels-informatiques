import api from '@/utils/Api'



export default async function SubmitExcelArticle(row ,setExcelResult,setErrors,Id){
    const res = await api.get('http://localhost:5500/type')
    const types = res.data

    function ValidateInput(numero,typeInput,marque,desc,qte,pre,pru){
        const regex1 = /^[a-zA-Z0-9 ]+$/;
        const regex2 = /^[0-9]+$/;
        const regex3 = /^[a-zA-Z ]+$/;
        const number = Number(numero)

        const errorNum = numero?"":"Numero est Obligatoire"
        regex2.test(numero)?number <= 0 ?"Numero Doit être > 0":"":"Numero est Obligatoire"
        const errorMarque = !marque?"Marque est Obligatoire":regex1.test(marque)?"":"juste a-z A-Z sont accepté pour Marque"
        const errorDesc = desc == ""?"Description est Obligatoire":regex1.test(desc)?"":"juste a-z A-Z sont accepté pour Description"
        const errorQte = qte == ""?"Quantité est Obligatoire":regex2.test(qte)?"":"Quantité Doit être un nombre > 0"
        const errorPre = pre == ""?"Prix estimatif est Obligatoire":regex2.test(pre)?"":"Prix estimatif Doit être un nombre > 0"
        const errorPru = pru == ""?"Prix unitaire est Obligatoire":regex2.test(pru)?"":"Prix unitaire Doit être un nombre > 0"
        const errorType = typeInput?regex3.test(typeInput)?typeInput.trim()==""?"Type est Obligatoire":types.map(e=>e.libelle.toLowerCase()).includes(typeInput.trim().toLowerCase())?""
        :"ce Type n'existe pas":"caractére Invalid dans le Type!":"Type est Obligatoire"
        
        const error = [errorNum,errorType,errorMarque,errorDesc,errorQte,errorPre,errorPru]
        return error
    }
    

    const error = ValidateInput(row["Numero"],row["Type"],row["Marque"],row["Description"],row["Quantite"],row["Prix estimatif"],row["Prix unitaire"])
    
    if(error.join("") == ""){
        await api.post('http://localhost:5500/articleMarche',{
            marche_id : Id,
            Numero : row["Numero"],
            type_id : types.find(el=>el.libelle.toLowerCase() == row["Type"].trim().toLowerCase())._id,
            marque : row["Marque"].trim(),
            description : row["Description"].trim(),
            quantite : row["Quantite"],
            prix_estimatif : row["Prix estimatif"],
            prix_unitaire : row["Prix unitaire"],
            prix_totale : (row["Quantite"] * row["Prix unitaire"])
        })
        
        setExcelResult(prv=>[prv[0] + 1 , prv[1]])
    }else{
        const rowNumber = "L" + row["__rowNum__"]
        const filtredErr = error.filter(e=>e!="")
        setErrors(err=>{return {...err , [rowNumber]: filtredErr}})
        setExcelResult(prv=>[prv[0] , prv[1] + 1])
    }


}
