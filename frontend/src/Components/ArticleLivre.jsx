import api from '../utils/Api';
import * as XLSX from'xlsx'
import { useEffect, useRef, useState } from "react"
import {EditIcon,CloseIcon,AddIcon,SaveIcon,UpdateIcon,ExcelIcon, DeleteIcon} from '../assets/Icons';
import { useNavigate } from "react-router-dom";
import NotificationExcelPanel from "./NotificationExcelPanel";


// eslint-disable-next-line react/prop-types
export default function ArticleLivre({qte , articleId}) {

    const [editMode,setEditMode] = useState(null)
    const [changed,setChanged] = useState(false)
    const [Ajout,setAjout] = useState(false)
    const numeroSerieInput = useRef(null)
    const dateLivraisonInput = useRef(null)
    const cabInput = useRef(null)
    const newNumeroSerieInput = useRef(null)
    const newDateLivraisonInput = useRef(null)
    const newCabInput = useRef(null)
    // Serie , cab
    const [Error,setError] = useState(["",""])
    const [NError,setNError] = useState(["",""])
    const [data,setData] = useState([])
    const Navigate = useNavigate()
    const [isPanelVisibleLivre, setIsPanelVisibleLivre] = useState(false);
    const [ExcelResultLivre, setExcelResultLivre] = useState([0,0]);

    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                if(articleId){
                    const res = await api.get(`http://localhost:5500/articleLivre/${articleId}`)
                    
                    setData(res.data)
                }
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
    },[changed])

    async function updateArticleLivre(id){
        const regex1 = /^[a-zA-Z0-9]+$/;

        const errorSerie = numeroSerieInput.current.value.trim() == ""?"Required":regex1.test(numeroSerieInput.current.value)?"":"Unallowed Caracter"
        const errorCAB = cabInput.current.value.trim() == ""?"Required":regex1.test(cabInput.current.value)?"":"Unallowed Caracter"
        
        
        const error = errorSerie + errorCAB    


        setError([errorSerie,errorCAB])
        if(error == ""){
            try{
                await api.put('http://localhost:5500/articleLivre',{
                    id : id,
                    Numero_Serie : numeroSerieInput.current.value.trim(),
                    date_Livraison : dateLivraisonInput.current.value,
                    cab : cabInput.current.value.trim(),
                })
                
                setEditMode(null)
                setChanged(c=>!c)
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

        

        
    }

    async function addArticleLivre(num){
        const regex1 = /^[a-zA-Z0-9]+$/;

        const errorSerie = newNumeroSerieInput.current.value.trim() == ""?"Required":regex1.test(newNumeroSerieInput.current.value)?"":"Unallowed Caracter"
        const errorCAB = newCabInput.current.value.trim() == ""?"Required":regex1.test(newCabInput.current.value)?"":"Unallowed Caracter"
        
        
        const error = errorSerie + errorCAB    


        setNError([errorSerie,errorCAB])
        if(error == ""){
            try {
                await api.post('http://localhost:5500/articleLivre',{
                    article_marche_id : articleId,
                    Numero : num,
                    Numero_Serie : newNumeroSerieInput.current.value.trim(),
                    date_Livraison : newDateLivraisonInput.current.value,
                    cab : newCabInput.current.value.trim(),
                    etat : false
                })
                
                setAjout(false)
                setChanged(c=>!c)
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
        
    }
    async function deleteArticleLivres(){
        try {
            await api.delete(`http://localhost:5500/articleLivre/${articleId}`)
            
            setChanged(c=>!c)
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
    async function deleteArticleLivre(id){
        try {
            await api.delete(`http://localhost:5500/articleLivre`,{
                data : {
                    id : id
                }
            })
            
            setChanged(c=>!c)
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
    async function handelLivreExcel(ev){
        const Numeros = []
        setExcelResultLivre([0,0])
        const reader = new FileReader()
        reader.readAsArrayBuffer(ev.target.files[0])
        reader.onload = (el)=>{
            const data = el.target.result
            const workbook = XLSX.read(data, {type : ArrayBuffer})
            const sheet = workbook.Sheets[workbook.SheetNames[0]]
            const articleLivres = XLSX.utils.sheet_to_json(sheet)
            articleLivres.forEach(async (e)=>{
                const error = ValidateExcelInput(e["Numero"],e["Numero de Serie"],e["Date de Livraison"],e["CAB"])
                if(error == "" && !Numeros.includes(e["Numero"])){
                    Numeros.push(e["Numero"])
                    setExcelResultLivre(prv=>[prv[0] + 1 , prv[1]])
                    try {
                        await api.post('http://localhost:5500/articleLivre',{
                            article_marche_id : articleId,
                            Numero : e["Numero"],
                            Numero_Serie : e["Numero de Serie"],
                            date_Livraison : new Date(e["Date de Livraison"]),
                            cab : e["CAB"],
                            etat : false
                        })
                        
                        setChanged(c=>!c)
                    } catch (err) {
                        if (err.response) {
                            Navigate('/error',{state : {message : err.response.data ,code : err.response.status}})
                        } else if (err.request) {
                            Navigate('/error',{state : {message :'No response received: ' + err.request}})
                        } else {
                            Navigate('/error',{state : {message :'Error setting up the request: ' + err.message}})
                        }
                    }
                }else{
                    setExcelResultLivre(prv=>[prv[0] , prv[1] + 1])
                }
                
            })
            
        }
        setChanged(c=>!c)
        setIsPanelVisibleLivre(true)
    }

    function ValidateExcelInput(numero,serie,date,cab){
        const regex1 = /^[a-zA-Z0-9]+$/;
        const regex2 = /^[0-9]+$/;
        const number = Number(numero)
        const errorNumero = numero && regex2.test(numero)?
        !data.map(e=>e.Numero).includes(number)?
        number <= 0?"not Allowed":
        number<=qte?"":
        "Overflow":
        "Already exists"
        : "a Number is Required"
        const errorSerie = serie ?regex1.test(serie)?serie.trim() == ""?"Required":"":"Unallowed Caracter":"Required"
        const errorCAB = cab ?regex1.test(cab)?cab.trim() == ""?"Required":"":"Unallowed Caracter":"Required"
        const errorDate = date?!isNaN(new Date(date,"DD-MM-YYYY"))?"format incorrecte":"":"Required"
        const error = errorSerie + errorCAB + errorNumero + errorDate
        return error
    }




    return(
        <div className="flex flex-col w-full ">
            {isPanelVisibleLivre && <NotificationExcelPanel addedRows={ExcelResultLivre[0]} declinedRows={ExcelResultLivre[1]} visiblity={isPanelVisibleLivre} setVisible={setIsPanelVisibleLivre}/> }
            <div className="mt-3 ml-3 w-full">
                <button  onClick={()=>deleteArticleLivres()} className="mt-3 mr-1 disabled:bg-gray-500 disabled:text-gray-100 disabled:cursor-not-allowed" disabled={data.length == 0}>Supprimer Tout</button>
                <div className="flex gap-2 my-2">
                    <button className="bg-gray-100"  onClick={()=>{setAjout(!Ajout);setError(["","",""]);setNError(["","",""])}} disabled={qte - data.length == 0}>{Ajout?<CloseIcon/>:<AddIcon/>}</button>
                    <div className="" >
                        <input type="file" accept=".xlsx, .xls" className="hidden" id="fileInputLivre" onChange={handelLivreExcel} disabled={qte - data.length == 0}/>
                        <label 
                            aria-disabled={data.length == qte}
                            htmlFor="fileInputLivre" 
                            onClick={(e)=>{if(data.length == qte) e.preventDefault()}}
                            className={`  flex items-center bg-green-100  p-[10px] rounded ${
                                data.length == qte
                                ? 'bg-gray-500 text-gray-100 cursor-not-allowed'
                                : 'bg-green-100 text-white cursor-pointer hover:bg-green-700 focus:ring focus:ring-green-300 '
                            } `}
                        >
                            <ExcelIcon/>
                        </label>
                    </div>
                </div>
                <table className="mt-4 table-auto border-collapse border border-gray-300 w-full shadow-md">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="border border-gray-300 px-2 py-2">Numero</th>
                            <th className="border border-gray-300 px-2 py-2">Numero de serie</th>
                            <th className="border border-gray-300 px-2 py-2">Date de livraison</th>
                            <th className="border border-gray-300 px-2 py-2">CAB</th>
                            <th className="border border-gray-300 px-2 py-2">Affectee</th>
                            <th className="border border-gray-300 px-2 py-2"></th>
                            <th className="border border-gray-300 px-2 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                    {data?.sort((a,b)=>new Date(a.date_Livraison) - new Date(b.date_Livraison)).map((e,i)=>{
                        return <tr key={i} className="odd:bg-gray-100 even:bg-gray-50 hover:bg-blue-100 text-sm">
                        <td className="border border-gray-300 p-1">{e.Numero}</td>
                        <td className="border border-gray-300 p-1">{editMode != i ?e.Numero_Serie :<input type="text" defaultValue={e.Numero_Serie} ref={numeroSerieInput} className={"input-base w-[100px] p-1 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[0]?"border-red-500":"")}/>}
                        {Error[0] && editMode == i && <p className="text-sm text-red-500 mt-1">{Error[0]}</p>}
                        </td>
                        <td className="border border-gray-300 p-1">{editMode != i ?e.date_Livraison.split('T')[0] :<input type="date" ref={dateLivraisonInput} defaultValue={e.date_Livraison.split('T')[0]} className="input-base w-[100px] p-1 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>}</td>
                        <td className="border border-gray-300 p-1">{editMode != i ?e.cab :<input type="text" defaultValue={e.cab} ref={cabInput} className={"input-base w-[100px] p-1 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[1]?"border-red-500":"")}/>}
                        {Error[1] && editMode == i && <p className="text-sm text-red-500 mt-1">{Error[1]}</p>}
                        </td>
                        <td className="border border-gray-300 p-1">{e.etat?"Oui":"Non"}</td>
                        <td className="border border-gray-300 p-1">{editMode != i ?<button onClick={()=>{setEditMode(i);setError(["","",""]);setNError(["","",""])}}><EditIcon/></button> : <button onClick={()=>updateArticleLivre(e._id)}><UpdateIcon/></button>}</td>
                        <td className="border border-gray-300 p-1">{editMode != i ?<button onClick={()=>deleteArticleLivre(e._id)}><DeleteIcon/></button> : <button onClick={()=>setEditMode(null)}><CloseIcon/></button>}</td>
                    </tr>
                    })}
                    {
                    Ajout?
                    <tr className="odd:bg-gray-100 even:bg-gray-50 hover:bg-blue-100 text-sm">
                        <td className="border border-gray-300 p-1">{data.length + 1}</td>
                        <td className="border border-gray-300 p-1"><input type="text" className={"input-base w-[100px] p-1 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[0]?"border-red-500":"")} ref={newNumeroSerieInput}/>
                        {NError[0] && <p className="text-sm text-red-500 mt-1">{NError[0]}</p>}
                        </td>
                        <td className="border border-gray-300 p-1">{<input type="date" ref={newDateLivraisonInput} className="input-base w-[100px] p-1 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" defaultValue={new Date().toISOString().split('T')[0]}/>}</td>
                        <td className="border border-gray-300 p-1"><input type="text" className={"input-base w-[100px] p-1 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[1]?"border-red-500":"")} ref={newCabInput}/>
                        {NError[1] && <p className="text-sm text-red-500 mt-1">{NError[1]}</p>}
                        </td>
                        <td className="border border-gray-300 p-1">{"Non"}</td>
                        <td className="border border-gray-300 p-1"><button onClick={()=>addArticleLivre(data.length + 1)}><SaveIcon/></button></td>
                    </tr>
                    :null
                }
                    </tbody>
                </table>
            </div>
        </div>
    )
}