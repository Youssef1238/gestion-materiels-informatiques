import { useEffect, useRef, useState } from "react";
import api from "../../utils/Api";
import { useNavigate } from "react-router-dom";





export default function Affectation() {
    const [entiteAdmins,setEntiteAdmin] = useState([])
    const [option,setOption] = useState(null)
    const [entiteId,setEntiteId] = useState(null)
    const entiteInput = useRef(null)
    const [marches,setMarches] = useState([])
    const [articles,setArticles] = useState([])
    const [filteredArticles,setFilteredArticles] = useState([])
    const typeInput = useRef()
    const marcheInput = useRef()
    const numSerieInput = useRef()
    const [nonAffecte,setNonAffecte] = useState(false)
    const [types,setTypes] = useState([])
    const [file,setFile] = useState([])
    const date = useRef(null)
    const Navigate = useNavigate()

useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const resEntiteAdmin = await api.get(`http://localhost:5500/entiteAdmin`)
               
                setEntiteAdmin(resEntiteAdmin.data)
                const resM = await api.get(`http://localhost:5500/marche`)
                
                setMarches(resM.data)
                const resT = await api.get(`http://localhost:5500/type`)
                
                setTypes(resT.data)
                
            }catch(err){
                if (err.response) {
                    Navigate('/error',{state : {message : err.response.data ,code : err.response.status}})
                } else if (err.request) {
                    Navigate('/error',{state : {message :'No response received: ' + err.request}})
                } else {
                    Navigate('/error',{state : {message :'Error setting up the request: ' + err.message}})
                }
            }
        }

        fetchData()
},[])

async function affecter(id,entiteId){
    try {
        await api.post('http://localhost:5500/affectation',
            {
                article_livre_id : id,
                entiteAdmin_id : entiteId,
                date_affectation : date.current.value
            }
        )
        
        await api.put('http://localhost:5500/articleLivre',
            {
                id : id,
                etat : true
            }
        )
        
    } catch (err) {
        if (err.response) {
            Navigate('/error',{state : {message : err.response.data ,code : err.response.status}})
        } else if (err.request) {
            Navigate('/error',{state : {message :'No response received: ' + err.request}})
        } else {
            Navigate('/error',{state : {message :'Error setting up the request: ' + err.message}})
        }
    }
}

async function handelAffectation(){
    if(file.length>0){
        file.forEach((e)=>{affecter(e._id,entiteId)})
        try {
            await api.post(`http://localhost:5500/entiteLog`,{
                entiteAdmin_id : entiteId,
                date : date.current.value,
                affectation : true,
                articles : file
            })
            
            const response = await api.post(`http://localhost:5500/generate`,{
                decharge : true,
                entiteAdmin : entiteAdmins.filter(el=>el._id == entiteId)[0].libelle_fr,
                date : date.current.value,
                items : file.map(e=>{
                    return {
                        design : types.filter(el=>el._id == e.type_id)[0]?.libelle + " (n°" + e.Numero + ") ",
                        marque : e.marque,
                        serie : e.Numero_Serie
                    }
                })
            }, {
                
                
                responseType: 'blob',  
            })
            

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Decharge_'+entiteAdmins.filter(el=>el._id == entiteId)[0].libelle_fr+'_'+date.current.value+'.docx'); 
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

        } catch (err) {
        
            if (err.response) {
                Navigate('/error',{state : {message : err.response.data ,code : err.response.status}})
            } else if (err.request) {
                Navigate('/error',{state : {message :'No response received: ' + err.request}})
            } else {
                Navigate('/error',{state : {message :'Error setting up the request: ' + err.message}})
            }
            
        }

    
    }
    handelAnnuler()
}

function handelAffectationSwitch(){
    if(entiteInput.current.value == ""){
        setOption(null)
    }else{
        setEntiteId(entiteInput.current.value)
        setOption(0)
        setArticles([])
    }
}
async function handelRecuperationSwitch(){
    if(entiteInput.current.value == ""){
        setOption(null)
    }else{
        setEntiteId(entiteInput.current.value)
        try {
                const res = await api.get(`http://localhost:5500/articleLivre/entite/${entiteInput.current.value}`)
                
                setArticles(res.data)
        } catch (err) {
            if (err.response) {
                Navigate('/error',{state : {message : err.response.data ,code : err.response.status}})
            } else if (err.request) {
                Navigate('/error',{state : {message :'No response received: ' + err.request}})
            } else {
                Navigate('/error',{state : {message :'Error setting up the request: ' + err.message}})
            }
        }
        setOption(1)
    }
}
async function Recuperer(id){
    try {
        await api.put("http://localhost:5500/affectation/recuperer",{
            id : id,
            date_recuperation : date.current.value
        })
       
        await api.put("http://localhost:5500/articleLivre",{
            id : id,
            etat : false
        })
        
    } catch (err) {
        if (err.response) {
            Navigate('/error',{state : {message : err.response.data ,code : err.response.status}})
        } else if (err.request) {
            Navigate('/error',{state : {message :'No response received: ' + err.request}})
        } else {
            Navigate('/error',{state : {message :'Error setting up the request: ' + err.message}})
        }
    }
}
async function handelRecuperation() {
    if(file.length>0){
        file.forEach((e)=>{
            Recuperer(e)
        })
        try {
            await api.post(`http://localhost:5500/entiteLog`,{
                entiteAdmin_id : entiteId,
                date : date.current.value,
                affectation : false,
                articles : file.map(e=>e._id)
            })
            
            const response = await api.post(`http://localhost:5500/generate`,{
                decharge : false,
                entiteAdmin : entiteAdmins.filter(el=>el._id == entiteId)[0].libelle_fr,
                date : date.current.value,
                items : file.map(e=>{
                    return {
                        design : types.filter(el=>el._id == e.type_id)[0]?.libelle + " (n°" + e.Numero + ") ",
                        marque : e.marque,
                        serie : e.Numero_Serie
                    }
                })
            }, {
                
                responseType: 'blob',  
            })
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Reprise_'+entiteAdmins.filter(el=>el._id == entiteId)[0].libelle_fr+'_'+date.current.value+'.docx'); 
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            if (err.response) {
                Navigate('/error',{state : {message : err.response.data ,code : err.response.status}})
            } else if (err.request) {
                Navigate('/error',{state : {message :'No response received: ' + err.request}})
            } else {
                Navigate('/error',{state : {message :'Error setting up the request: ' + err.message}})
            }
        }
    }
    handelAnnuler()
}
async function handelArticle(e) {
    numSerieInput.current.value = ""
    if(e.target.value == ""){
        setArticles([])
        setFilteredArticles([])
    }else{
        const res = await api.get(`http://localhost:5500/articleLivre/marche/${e.target.value}`)
        if(res.status == 500){
            Navigate('/error',{state : {message : res.data.message}})
        }
        setArticles(res.data)
        setFilteredArticles(res.data)
    }
    typeInput.current.value = ""
}

function handelFilter(e){
    if(e.target.value == ""){
        setFilteredArticles(articles)
    }else{
        setFilteredArticles(articles.filter(el=>el.type_id == e.target.value))
    }
}
async function handelNumSerieFilter(e){
    if(e.target.value != ""){
        try {
            const res = await api.get(`http://localhost:5500/articleLivre/serie/${e.target.value}`)
           
            marcheInput.current.value = ""
            setArticles(res.data)
            setFilteredArticles(res.data)
            
        } catch (err) {
            if (err.response) {
                if(err.response.status != 403)
                    Navigate('/error',{state : {message : err.response.data ,code : err.response.status}})
            } else if (err.request) {
                Navigate('/error',{state : {message :'No response received: ' + err.request}})
            } else {
                Navigate('/error',{state : {message :'Error setting up the request: ' + err.message}})
            }
        }
    }else{
        setArticles([])
        setFilteredArticles([])
    }
    
}

function handelAnnuler() {
    setFile([]);
    setOption(null)
}

if(option == 0){

return(
    <div className="mt-3 ml-3 w-full px-8">
        <h1 className="font-bold text-blue-500 mb-2 text-center mt-4 pr-40">Affectation</h1>
        <div className="flex gap-3 p-3 items-center">
            <label htmlFor="entite">Entite Administrative</label>
            <select id="entite" disabled={true} defaultValue={entiteAdmins.filter(e=>e._id == entiteId)[0]?.libelle_fr}>
                <option value="">Selectionner</option>
                {
                    entiteAdmins.map((e,i)=>{
                        return <option value={e._id} key={i}>{e.libelle_fr}</option>
                    })
                }
            </select>
            <button className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-400 focus:outline-none " onClick={()=>handelAffectation()}>Terminer</button>
            <button className="px-6 py-3 bg-red-700 text-white font-semibold rounded-lg shadow-md hover:bg-red-400 focus:outline-none " onClick={()=>handelAnnuler()}>Annuler</button>
        </div>
        <div className="flex gap-3 p-3 items-center">
                <label htmlFor="marches">Marche</label>
                <select  id="marches" onChange={(e)=>handelArticle(e)} ref={marcheInput}>
                    <option value="">selectionner</option>
                    {
                        marches.map((e,i)=>{
                            return <option value={e._id} key={i}>{e.reference}</option>
                        })
                    }
                </select>
                <label htmlFor="type">Type</label>
                <select  id="type" onChange={(e)=>handelFilter(e)} ref={typeInput}>
                    <option value="">All</option>
                    {
                        types.map((e,i)=>{
                            return <option value={e._id} key={i}>{e.libelle}</option>
                        })
                    }
                </select>
                <label htmlFor="date">Date</label>
                <input type="date" id="date" className="input-base" defaultValue={new Date().toISOString().split('T')[0]} ref={date}/>
                <label htmlFor="affecte">Non affecte</label>
                <input type="checkbox" id="affecte"   onChange={(e)=>setNonAffecte(e.target.checked)}/>
        </div>
        <div className="flex gap-3 p-3 items-center">
            <label htmlFor="serieNum">Chercher par numero de serie</label>
            <input type="text" id="serieNum" className="input-base " onChange={(e)=>handelNumSerieFilter(e)} ref={numSerieInput}/>
        </div>
        <table className="mt-4 table-auto border-collapse border border-gray-300 w-full shadow-md">
            <thead>
                <tr className="bg-blue-500 text-white">
                    <th className="border border-gray-300 px-6 py-3">Numero d'Article Marche</th>
                    <th className="border border-gray-300 px-6 py-3">Numero</th>
                    <th className="border border-gray-300 px-6 py-3">Type</th>
                    <th className="border border-gray-300 px-6 py-3">Marque</th>
                    <th className="border border-gray-300 px-6 py-3">Numero de serie</th>
                    <th className="border border-gray-300 px-6 py-3">CAB</th>
                    <th className="border border-gray-300 px-6 py-3">prix unitaire</th>
                    <th className="border border-gray-300 px-6 py-3">Action</th>
                </tr>
            </thead>
            <tbody>
                {
                nonAffecte? 
                filteredArticles?.filter(e=>e.etat == false).map((e,i)=>{
                    
                    return <tr key={i} className="odd:bg-gray-100 even:bg-gray-50 hover:bg-blue-100 text-sm">
                    <td className="border border-gray-300 px-6 py-3">{e.numAR}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.Numero}</td>
                    <td className="border border-gray-300 px-6 py-3">{types.filter(el=>el._id == e.type_id)[0].libelle}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.marque}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.Numero_Serie}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.cab}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.prix_unitaire}</td>
                    <td className="border border-gray-300 px-6 py-3">{!e.etat && !file.includes(e)?
                        <button className="bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-400 focus:outline-none" onClick={()=>setFile(f=>[...f,e])}>Affecter</button>: 
                        file.includes(e)?
                        <button className="bg-red-700 text-white font-semibold rounded-lg shadow-md hover:bg-red-400 focus:outline-none" onClick={()=>setFile(f=>f.filter(el=>el._id != e._id))}>Annuler</button> : 
                        "Reserve"}</td>
                </tr>
                })
                :
                filteredArticles?.map((e,i)=>{
                    return <tr key={i} className="odd:bg-gray-100 even:bg-gray-50 hover:bg-blue-100 text-sm">
                    <td className="border border-gray-300 px-6 py-3">{e.numAR}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.Numero}</td>
                    <td className="border border-gray-300 px-6 py-3">{types.filter(el=>el._id == e.type_id)[0].libelle}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.marque}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.Numero_Serie}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.cab}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.prix_unitaire}</td>
                    <td className="border border-gray-300 px-6 py-3">{!e.etat && !file.includes(e)?
                        <button className="bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-400 focus:outline-none" onClick={()=>setFile(f=>[...f,e])}>Affecter</button>: 
                        file.includes(e)?
                        <button className="bg-red-700 text-white font-semibold rounded-lg shadow-md hover:bg-red-400 focus:outline-none" onClick={()=>setFile(f=>f.filter(el=>el._id != e._id))}>Annuler</button> : 
                        "Reserve"}</td>
                </tr>
                })
            }
            </tbody>
        </table>
    </div>
)


}else if(option == 1){
return (
    <div className="mt-3 ml-3 w-full px-8">
        <h1 className="font-bold text-blue-500 mb-2 text-center mt-4 pr-40">Recuperation</h1>
        <div className="flex gap-3 p-3 items-center">
            <label htmlFor="entite">Entite Administrative</label>
            <select id="entite" disabled={true} defaultValue={entiteAdmins.filter(e=>e._id == entiteId)[0]?.libelle_fr}>
                <option value="">Selectionner</option>
                {
                    entiteAdmins.map((e,i)=>{
                        return <option value={e._id} key={i}>{e.libelle_fr}</option>
                    })
                }
            </select>
            <button className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-400 focus:outline-none " onClick={()=>handelRecuperation()}>Terminer</button>
            <button className="px-6 py-3 bg-red-700 text-white font-semibold rounded-lg shadow-md hover:bg-red-400 focus:outline-none " onClick={()=>handelAnnuler()}>Annuler</button>
        </div>
        <div className="flex gap-3 p-3 items-center">
            <label htmlFor="date">Date</label>
            <input type="date" id="date" className="input-base" defaultValue={new Date().toISOString().split('T')[0]} ref={date}/>
        </div>
        <table className="mt-4 table-auto border-collapse border border-gray-300 w-full shadow-md">
            <thead>
                <tr className="bg-blue-500 text-white">
                    <th className="border border-gray-300 px-6 py-3">Numero d'Article Marche</th>
                    <th className="border border-gray-300 px-6 py-3">Numero</th>
                    <th className="border border-gray-300 px-6 py-3">Type</th>
                    <th className="border border-gray-300 px-6 py-3">Marque</th>
                    <th className="border border-gray-300 px-6 py-3">Numero de serie</th>
                    <th className="border border-gray-300 px-6 py-3">CAB</th>
                    <th className="border border-gray-300 px-6 py-3">prix unitaire</th>
                    <th className="border border-gray-300 px-6 py-3">date d'affectation</th>
                    <th className="border border-gray-300 px-6 py-3">Action</th>
                </tr>
            </thead>
            <tbody>
                {articles?.map((e,i)=>{
                    return <tr key={i} className="odd:bg-gray-100 even:bg-gray-50 hover:bg-blue-100 text-sm">
                    <td className="border border-gray-300 px-6 py-3">{e.numAR}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.Numero}</td>
                    <td className="border border-gray-300 px-6 py-3">{types.filter(el=>el._id == e.type_id)[0]?.libelle}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.marque}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.Numero_Serie}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.cab}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.prix_unitaire}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.date_affectation.split('T')[0]}</td>
                    <td className="border border-gray-300 px-6 py-3">{!file.includes(e)?
                        <button className="bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-400 focus:outline-none" onClick={()=>setFile(f=>[...f,e])}>Desaffecter</button>   : 
                        <button className="bg-red-700 text-white font-semibold rounded-lg shadow-md hover:bg-red-400 focus:outline-none" onClick={()=>setFile(f=>f.filter(el=>el._id != e._id))}>Annuler</button>
                        }</td>
                </tr>
                })}
            </tbody>
        </table>
    </div>
)

}else{

return(
        <div className="mt-3 ml-3 w-full px-8">
            <h1 className="font-bold text-blue-500 mb-2 text-center mt-4 pr-40">Affectation / Recuperation</h1>
            <div className="flex gap-3 p-3 items-center">
                <label htmlFor="entite">Entite Administrative</label>
                <select id="entite" ref={entiteInput}>
                    <option value="">Selectionner</option>
                    {
                        entiteAdmins.map((e,i)=>{
                            return <option value={e._id} key={i}>{e.libelle_fr}</option>
                        })
                    }
                </select>
                <button className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-400 focus:outline-none " onClick={()=>handelAffectationSwitch()}>Affecter</button>
                <button className="px-6 py-3 bg-red-700 text-white font-semibold rounded-lg shadow-md hover:bg-red-400 focus:outline-none " onClick={()=>handelRecuperationSwitch()}>Recuperer</button>
            </div>
        </div>
)

}







}