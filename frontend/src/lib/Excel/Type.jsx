import api from '@/utils/Api'
export default async function SubmitExcelType(row ,setExcelResult, setErrors ){
    async function ValidateInput(order,libelle){
        const res = await api.get('http://localhost:5500/type')
        const types = res.data
        console.log(types)
        const regex1 = /^[a-zA-Z ]+$/;
        const regex2 = /^[0-9]+$/;
        const number = Number(order)
        const errorLibelle = libelle ?regex1.test(libelle)?libelle.trim() == ""?"Libelle est Obligatoire":"":"juste a-z A-Z sont accepté pour Libelle":"Libelle est Obligatoire"
        const errorOrder = order && regex2.test(order)?!types.map(e=>e.order).includes(number)?
        number <= 0?"Ordre Invalid":
        "":
        "Ordre existe déjà"
        : order && Number(order) < 0? "Ordre Invalid" : "Ordre est Obligatoire"
        const error = [errorOrder , errorLibelle]
        return error
    }
        
    
    const error = ValidateInput(row["Ordre"],row["Libelle"])
    if(error.join("") == ""){
        await api.post('http://localhost:5500/type',{
            libelle : row["Libelle"].trim(),
            order : row["Ordre"]
        })
        
        setExcelResult(prv=>[prv[0] + 1 , prv[1]])
    }else{
        const rowNumber = "L" + row["__rowNum__"]
        setErrors(err=>{return {...err , [rowNumber]: error}})
        setExcelResult(prv=>[prv[0] , prv[1] + 1])
    }


}
