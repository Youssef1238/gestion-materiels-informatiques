import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { DownloadIcon } from "../assets/Icons"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"

export default function log() {

    const [option,setOption] = useState(null)
    const numSerieInput = useRef(null)
    const [articleLivres,setArticleLivres] = useState([])
    const [article,setArticle] = useState(null)
    const [affectations,setAffectations] = useState([])
    const [entiteAdmins,setEntiteAdmins] = useState([])
    const [entiteAdmin,setEntiteAdmin] = useState(null)
    const [entiteLog,setEntiteLog] = useState([])
    const [types,setTypes] = useState([])
    const Navigate = useNavigate()
    const auth = Cookies.get('id')

useEffect(()=>{
    const fetchData = async ()=>{
        try {
            const Eres = await axios.get(`http://localhost:5500/entiteAdmin`,{
                headers : {
                    'authorization' : auth
                }
            })
            if(Eres.status == 500){
                Navigate('/error',{state : {message : Eres.data.message}})
            }
            setEntiteAdmins(Eres.data)
            const resT = await axios.get(`http://localhost:5500/type`,{
                headers : {
                    'authorization' : auth
                }
            })
            setTypes(resT.data)
        } catch (error) {
            if (error.response) {
                Navigate('/error',{state : {message : error.response.data ,code : error.response.status}})
            } else if (error.request) {
                Navigate('/error',{state : {message :'No response received: ' + error.request}})
            } else {
                Navigate('/error',{state : {message :'Error setting up the request: ' + error.message}})
            }
        }
    }
    fetchData()
   
},[])



    function handleOption(e){
        if(e.target.value == ""){
            setOption(null)
            setAffectations([])
            setEntiteLog([])
            setArticleLivres([])
            setEntiteAdmin(null)
            setArticle(null)
        }else{
            setOption(e.target.value)
        }
        setArticleLivres([])
    }

    async function FetchEntiteLog(e) {
        if(e.target.value == ""){
            setEntiteLog([])
            setArticleLivres([])
            setEntiteAdmin(null)
        }else{
            try {
                const res = await axios.get(`http://localhost:5500/entiteLog/${e.target.value}`,{
                    headers : {
                        'authorization' : auth
                    }
                })
                setEntiteLog(res.data)
                const resA = await axios.get(`http://localhost:5500/articleLivre/entite/${e.target.value}`,{
                    headers : {
                        'authorization' : auth
                    }
                })
                setArticleLivres(resA.data)
                const resE = await axios.get(`http://localhost:5500/entiteAdmin/${e.target.value}`,{
                    headers : {
                        'authorization' : auth
                    }
                })
                setEntiteAdmin(resE.data)
            } catch (error) {
                if (error.response) {
                    Navigate('/error',{state : {message : error.response.data ,code : error.response.status}})
                } else if (error.request) {
                    Navigate('/error',{state : {message :'No response received: ' + error.request}})
                } else {
                    Navigate('/error',{state : {message :'Error setting up the request: ' + error.message}})
                }
            }
            
        }
        
    }
    async function handelNumSerieFilter(e){
        if(e.target.value != ""){
            try {
                const resA = await axios.get(`http://localhost:5500/articleLivre/serie/${e.target.value}`,{
                    headers : {
                        'authorization' : auth
                    }
                })
                if(resA.data.length != 0){
                    setArticle(resA.data[0])
                    const res = await axios.get(`http://localhost:5500/affectation/${resA.data[0]._id}`,{
                        headers : {
                            'authorization' : auth
                        }
                    })
                    setAffectations(res.data)
                }else{
                    setAffectations([])
                    setArticle(null)
                }
            } catch (error) {
                if (error.response) {
                    Navigate('/error',{state : {message : error.response.data ,code : error.response.status}})
                } else if (error.request) {
                    Navigate('/error',{state : {message :'No response received: ' + error.request}})
                } else {
                    Navigate('/error',{state : {message :'Error setting up the request: ' + error.message}})
                }
            }
        }else{
            setAffectations([])
            setArticle(null)
        } 
    }
    async function handelDownload(log){
        const entiteAdmin = entiteAdmins.filter(el=>el._id == log.entiteAdmin_id)[0].libelle_fr
        const date = log.date.split('T')[0]       
        try{
            const res = await axios.post(`http://localhost:5500/articleLivre/items`,{
                itemsId : log.articles
            },{
                headers : {
                    'authorization' : auth
                }
            }) 
            const response = await axios.post(`http://localhost:5500/generate`,{
                decharge : log.affectation,
                entiteAdmin : entiteAdmin,
                date : date,
                items : res.data
            }, {
                
                headers : {
                        'authorization' : auth
                },
                
                responseType: 'blob',  
            })
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', (log.affectation?'Decharge_':'Reprise_')+entiteAdmin+'_'+date+'.docx'); 
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }catch(error){
            if (error.response) {
                Navigate('/error',{state : {message : error.response.data ,code : error.response.status}})
            } else if (error.request) {
                Navigate('/error',{state : {message :'No response received: ' + error.request}})
            } else {
                Navigate('/error',{state : {message :'Error setting up the request: ' + error.message}})
            }
        }
        
        
    }



if(option == 0){
    return(
        <div className="my-3 ml-3 w-full px-8">
            <h1 className="font-bold text-blue-500 mb-2 text-center mt-4 pr-40">Log d'affectation</h1>

        <div className="flex gap-3 p-3 items-center">
            <label htmlFor="option">Critere</label>
            <select  id="option" onChange={(e)=>handleOption(e)}>
                <option value="">selectionner</option>
                <option value={0}>Article</option>
                <option value={1}>Entite Administrative</option>
            </select>
            <label htmlFor="serieNum">Chercher par numero de serie</label>
            <input type="text" id="serieNum" className="input-base  p-1 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " onChange={(e)=>handelNumSerieFilter(e)} ref={numSerieInput}/>
        </div>
        <table className="mt-4 table-auto border-collapse border border-gray-300 w-full shadow-md">
            <thead>
                <tr className="bg-blue-500 text-white">
                    <th className="border border-gray-300 px-6 py-3">Marche</th>
                    <th className="border border-gray-300 px-6 py-3">N° Article</th>
                    <th className="border border-gray-300 px-6 py-3">Numero</th>
                    <th className="border border-gray-300 px-6 py-3">Numero de serie</th>
                    <th className="border border-gray-300 px-6 py-3">CAB</th>
                    <th className="border border-gray-300 px-6 py-3">Type</th>
                    <th className="border border-gray-300 px-6 py-3">Marque</th>
                    <th className="border border-gray-300 px-6 py-3">Prix</th>
                    <th className="border border-gray-300 px-6 py-3">Date de livraison</th>
                    <th className="border border-gray-300 px-6 py-3">Affectee</th>
                </tr>
            </thead>
            <tbody>
                {article && <tr className="odd:bg-gray-100 even:bg-gray-50 hover:bg-blue-100 text-sm">
                    <td className="border border-gray-300 px-6 py-3">N° {article.marche}</td>
                    <td className="border border-gray-300 px-6 py-3">{article.numAR }</td>
                    <td className="border border-gray-300 px-6 py-3">{article.Numero }</td>
                    <td className="border border-gray-300 px-6 py-3">{article.Numero_Serie }</td>
                    <td className="border border-gray-300 px-6 py-3">{article.cab }</td>
                    <td className="border border-gray-300 px-6 py-3">{types.filter(el=>el._id ==article.type_id)[0].libelle}</td>
                    <td className="border border-gray-300 px-6 py-3">{article.marque }</td>
                    <td className="border border-gray-300 px-6 py-3">{article.prix_unitaire }</td>
                    <td className="border border-gray-300 px-6 py-3">{article.date_Livraison.split('T')[0]}</td>
                    <td className="border border-gray-300 px-6 py-3">{article.etat?"Oui":"Non"}</td>
                </tr>
                }
            </tbody>
        </table>
        <table className="mt-4 table-auto border-collapse border border-gray-300 w-full shadow-md">
            <thead>
                <tr className="bg-blue-500 text-white">
                    <th className="border border-gray-300 px-6 py-3">Entite Administrative</th>
                    <th className="border border-gray-300 px-6 py-3">Date d'affectation</th>
                    <th className="border border-gray-300 px-6 py-3">Date de recuperation</th>
                </tr>
            </thead>
            <tbody>
            {affectations.map((e,i)=>{
                return <tr key={i} className="odd:bg-gray-100 even:bg-gray-50 hover:bg-blue-100 text-sm">
                <td className="border border-gray-300 px-6 py-3">{entiteAdmins.filter(el=> el._id == e.entiteAdmin_id)[0].libelle_fr}</td>
                <td className="border border-gray-300 px-6 py-3">{e.date_affectation.split('T')[0]}</td>
                <td className="border border-gray-300 px-6 py-3">{!e.date_recuperation? "en cours" : e.date_recuperation.split('T')[0]}</td>
            </tr>
            })}
            </tbody>
        </table>            

        </div>
        
    )
}else if (option == 1){
return(
        <div className="my-3 ml-3 w-full px-8">
        <h1 className="font-bold text-blue-500 mb-2 text-center mt-4 pr-40">Log d'affectation</h1>
        <div className="flex gap-3 p-3 items-center">
            <label htmlFor="option">Critere</label>
            <select  id="option" onChange={(e)=>handleOption(e)}>
                <option value="">selectionner</option>
                <option value={0}>Article</option>
                <option value={1}>Entite Administrative</option>
            </select>
            <label htmlFor="entite">Select Entite Administrative</label>
            <select  id="entite" onChange={(e)=>FetchEntiteLog(e)}>
                    <option value="">selectionner</option>
                    {
                        entiteAdmins.map((e,i)=>{
                            return <option value={e._id} key={i}>N ° {e.libelle_fr}</option>
                        })
                    }
            </select>
        </div>
        <table className="mt-4 table-auto border-collapse border border-gray-300 w-full shadow-md">
            <thead>
                <tr className="bg-blue-500 text-white">
                    <th className="border border-gray-300 px-6 py-3">Libelle AR</th>
                    <th className="border border-gray-300 px-6 py-3">Libelle FR</th>
                </tr>
            </thead>
            <tbody>
                {entiteAdmin && <tr className="odd:bg-gray-100 even:bg-gray-50 hover:bg-blue-100 text-sm">
                    <td className="border border-gray-300 px-6 py-3">{entiteAdmin.libelle_ar}</td>
                    <td className="border border-gray-300 px-6 py-3">{entiteAdmin.libelle_fr }</td>
                </tr>
                }
            </tbody>
        </table>
        <h2>En Cours</h2>
        <table className="mt-4 table-auto border-collapse border border-gray-300 w-full shadow-md">
            <thead>
                <tr className="bg-blue-500 text-white">
                    <th className="border border-gray-300 px-6 py-3">Marche</th>
                    <th className="border border-gray-300 px-6 py-3">Article</th>
                    <th className="border border-gray-300 px-6 py-3">Numero</th>
                    <th className="border border-gray-300 px-6 py-3">Numero de serie</th>
                    <th className="border border-gray-300 px-6 py-3">CAB</th>
                    <th className="border border-gray-300 px-6 py-3">Type</th>
                    <th className="border border-gray-300 px-6 py-3">Marque</th>
                    <th className="border border-gray-300 px-6 py-3">Prix</th>
                    <th className="border border-gray-300 px-6 py-3">Date d'affectation</th>
                </tr>
            </thead>
            <tbody>
                {articleLivres?.map((e,i)=>{
                    return <tr key={i} className="odd:bg-gray-100 even:bg-gray-50 hover:bg-blue-100 text-sm">
                    <td className="border border-gray-300 px-6 py-3">N ° {e.paraInfo?.marche}</td>
                    <td className="border border-gray-300 px-6 py-3">N ° {e.paraInfo?.article}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.Numero}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.Numero_Serie}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.cab}</td>
                    <td className="border border-gray-300 px-6 py-3">{types.filter(el=>el._id == e.type_id)[0].libelle}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.marque}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.prix_unitaire}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.date_affectation.split('T')[0]}</td>
                    
                </tr>
                })}
            </tbody>
        </table>            
        <h2>Log</h2>
        <table className="mt-4 table-auto border-collapse border border-gray-300 w-full shadow-md">
            <thead>
                <tr className="bg-blue-500 text-white">
                    <th className="border border-gray-300 px-6 py-3">Type</th>
                    <th className="border border-gray-300 px-6 py-3">Date</th>
                    <th className="border border-gray-300 px-6 py-3">Rapport</th>
                </tr>
            </thead>
            <tbody>
                {entiteLog?.map((e,i)=>{
                    return <tr key={i} className="odd:bg-gray-100 even:bg-gray-50 hover:bg-blue-100 text-sm">
                    <td className="border border-gray-300 px-6 py-3">{e.affectation?"affectation" : "recuperation"}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.date.split('T')[0]}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center"><button onClick={()=>handelDownload(e)}><DownloadIcon/></button></td>
                </tr>
                })}
            </tbody>
        </table>            
        </div>
)

}else{
    return(
        <div className="mt-3 ml-3 w-full">
        <h1 className="font-bold text-blue-500 mb-2 text-center mt-4 pr-40">Log d'affectation</h1>
        <div className="flex gap-3 p-3 items-center">
            <label htmlFor="option">Critere</label>
            <select  id="option" onChange={(e)=>handleOption(e)}>
                <option value="">selectionner</option>
                <option value={0}>Article</option>
                <option value={1}>Entite Administrative</option>
            </select>
        </div>
        </div>
    )
}

    

}