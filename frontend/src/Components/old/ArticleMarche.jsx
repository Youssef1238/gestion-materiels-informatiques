import api from "../../utils/Api";
import { useEffect, useRef, useState } from "react"
import * as XLSX from'xlsx'
import ArticleLivre from "./ArticleLivre"
import {EditIcon,DeleteIcon,CloseIcon,AddIcon,SaveIcon,ExcelIcon,ExpandIcon,CollapseIcon} from '../../assets/Icons';
import { WarningModal } from "../WarningModal";
import { useNavigate } from "react-router-dom";
import NotificationExcelPanel from "../NotificationExcelPanel";

export default function ArticleMarche(props) {


    const [changed,setChanged] = useState(false)
    const numeroInput = useRef(null)
    const typeInput = useRef(null)
    const marqueInput = useRef(null)
    const descInput = useRef(null)
    const qteInput = useRef(null)
    const preInput = useRef(null)
    const pruInput = useRef(null)
    const newNumeroInput = useRef(null)
    const newTypeInput = useRef(null)
    const newMarqueInput = useRef(null)
    const newDescInput = useRef(null)
    const newQteInput = useRef(null)
    const newPreInput = useRef(null)
    const newPruInput = useRef(null)
    // Numero , Marque , Desc , Qte , Pre, Pru 
    const [Error,setError] = useState(["","","","","",""])
    const [NError,setNError] = useState(["","","","","",""])
    const [Ajout,setAjout] = useState(false);
    const [Update,setUpdate] = useState(false);
    const [EnvokedId,setEnvokedId] = useState(null);
    const [articleId,setArticleId] = useState(null);
    const [data,setData] = useState([])
    const [fliteredData,setFliteredData] = useState([])
    const [typeData,setTypeData] = useState([])
    const [marche,setMarche] = useState(null)
    const [marches,setMarches] = useState([])
    const [isExpanded,setIsExpanded] = useState(false)
    const [selectedOption,setselectedOption] = useState(props.marcheId || "")
    const articleNumInput = useRef()
    const articleTypeInput = useRef()
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [modalPromise, setModalPromise] = useState(null);
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const [ExcelResult, setExcelResult] = useState([0,0]);
    const Navigate = useNavigate()

    useEffect(()=>{
        const fetchData = async ()=>{
            
            try{
                if(marche){
                    const res = await api.get(`http://localhost:5500/articleMarche/${marche._id}`)
                    
                    setData(res.data)
                    setFliteredData(res.data)
                }else if(props.marcheId){
                    const resM = await api.get(`http://localhost:5500/marche/${props.marcheId}`)
                    setMarche(resM.data)
                    const res = await api.get(`http://localhost:5500/articleMarche/${props.marcheId}`)
                    setData(res.data)
                    setFliteredData(res.data)
                }
                const tRes = await api.get(`http://localhost:5500/type`)
                
                setTypeData(tRes.data)
                const mRes = await api.get(`http://localhost:5500/marche`)
                
                setMarches(mRes.data)
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


    async function updateArticleMarche(id){
        const regex1 = /^[a-zA-Z0-9 ]+$/;
        const regex2 = /^[0-9]+$/;
        const number = Number(numeroInput.current.value)
        const previousNumber = Number(data.find(e=>e._id == id).Numero)
        const errorNum = numeroInput.current.value.trim() == ""?"Required":
        regex2.test(numeroInput.current.value)?
        number == previousNumber || !data.map(e=>e.Numero).includes(number)?
        number <= 0?"not Allowed" 
        :""
        :"this number is used"
        :numeroInput.current.value <= 0?"not Valid":"only numbers are allowed"
        const errorMarque = marqueInput.current.value.trim() == ""?"Required":regex1.test(marqueInput.current.value)?"":"only a-z A-Z are allowed"
        const errorDesc = descInput.current.value.trim() == ""?"Required":regex1.test(descInput.current.value)?"":"only a-z A-Z are allowed"
        const errorQte = qteInput.current.value.trim() == ""?"Required":regex2.test(qteInput.current.value)?"":"not Valid"
        const errorPre = preInput.current.value.trim() == ""?"Required":regex2.test(preInput.current.value)?"":"not Valid"
        const errorPru = pruInput.current.value.trim() == ""?"Required":regex2.test(pruInput.current.value)?"":"not Valid"
        
        
        const error = errorNum  + errorMarque + errorDesc + errorQte + errorPre + errorPru 


        setError([errorNum,errorMarque,errorDesc,errorQte,errorPre,errorPru])
        if(error == ""){

            try{
                await api.put('http://localhost:5500/articleMarche',{
                    id : id,
                    Numero : numeroInput.current.value,
                    type_id : typeInput.current.value,
                    marque : marqueInput.current.value.trim(),
                    description : descInput.current.value.trim(),
                    quantite : qteInput.current.value,
                    prix_estimatif : preInput.current.value,
                    prix_unitaire : pruInput.current.value,
                    prix_totale : pruInput.current.value * qteInput.current.value
                    
                })
                
                setUpdate(false)
                setArticleId(null)
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

    async function addArticleMarche(){
        const regex1 = /^[a-zA-Z0-9 ]+$/;
        const regex2 = /^[0-9]+$/;
        const number = Number(newNumeroInput.current.value)
        const errorNum = newNumeroInput.current.value.trim() == ""?"Required":
        regex2.test(newNumeroInput.current.value)?
        !data.map(e=>e.Numero).includes(number)?
        number <= 0 ?"not Valid":
        "":
        "this number is used":
        newNumeroInput.current.value <= 0?"not Valid":"only numbers are allowed"
        const errorMarque = newMarqueInput.current.value.trim() == ""?"Required":regex1.test(newMarqueInput.current.value)?"":"only a-z A-Z are allowed"
        const errorDesc = newDescInput.current.value.trim() == ""?"Required":regex1.test(newDescInput.current.value)?"":"only a-z A-Z are allowed"
        const errorQte = newQteInput.current.value.trim() == ""?"Required":regex2.test(newQteInput.current.value)?"":"not Valid"
        const errorPre = newPreInput.current.value.trim() == ""?"Required":regex2.test(newPreInput.current.value)?"":"not Valid"
        const errorPru = newPruInput.current.value.trim() == ""?"Required":regex2.test(newPruInput.current.value)?"":"not Valid"
        
        
        const error = errorNum  + errorMarque + errorDesc + errorQte + errorPre + errorPru 


        setNError([errorNum,errorMarque,errorDesc,errorQte,errorPre,errorPru])
        if(error == ""){
            try {
                await api.post('http://localhost:5500/articleMarche',{
                    marche_id : marche._id,
                    Numero : newNumeroInput.current.value,
                    type_id : newTypeInput.current.value,
                    marque : newMarqueInput.current.value.trim(),
                    description : newDescInput.current.value.trim(),
                    quantite : newQteInput.current.value,
                    prix_estimatif : newPreInput.current.value,
                    prix_unitaire : newPruInput.current.value,
                    prix_totale : newPruInput.current.value * newQteInput.current.value
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
    async function deleteArticleMarche(id){
        const userConfirmed = await showModal();
        if(userConfirmed){
            try {
                await api.delete('http://localhost:5500/articleMarche',{
                    data : {id : id}
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
        
    }
    async function handelExcel(e){
        setExcelResult([0,0])
        const reader = new FileReader()
        reader.readAsArrayBuffer(e.target.files[0])
        reader.onload = (e)=>{
            const data = e.target.result
            const workbook = XLSX.read(data, {type : ArrayBuffer})
            const sheet = workbook.Sheets[workbook.SheetNames[0]]
            const articleMarches = XLSX.utils.sheet_to_json(sheet)
            articleMarches.forEach(async (e)=>{
                const error = ValidateExcelInput(e["Numero"],e["Type"],e["Marque"],e["Description"],e["Quantite"],e["Prix estimatif"],e["Prix unitaire"])
                if(error == ""){
                    setExcelResult(prv=>[prv[0] + 1 , prv[1]])
                    try {
                        await api.post('http://localhost:5500/articleMarche',{
                            marche_id : marche._id,
                            Numero : e["Numero"],
                            type_id : typeData.find(el=>el.libelle.toLowerCase() == e["Type"].trim().toLowerCase())._id,
                            marque : e["Marque"].trim(),
                            description : e["Description"].trim(),
                            quantite : e["Quantite"],
                            prix_estimatif : e["Prix estimatif"],
                            prix_unitaire : e["Prix unitaire"],
                            prix_totale : (e["Quantite"] * e["Prix unitaire"])
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
                    setExcelResult(prv=>[prv[0] , prv[1] + 1])
                }
                
            })
            
        }
        setIsPanelVisible(true)
    }
    async function handelArticle(e) {
        setEnvokedId(null);
        setArticleId(null);
        setAjout(false)
        setMarche(null)
        setselectedOption(e.target.value)
        if(e.target.value != ""){
            try {
                const res = await api.get(`http://localhost:5500/articleMarche/${e.target.value}`)
                setData(res.data)
                setFliteredData(res.data)
                const resM = await api.get(`http://localhost:5500/marche/${e.target.value}`)
                
                setMarche(resM.data)
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
            setData([])
            setFliteredData([])
        }
        articleNumInput.current.value = ""
    }
    function handelFilter(e) {
        setEnvokedId(null);
        setArticleId(null);
        setAjout(false)
        if(e.target.value == ""){
            setFliteredData(data)
        }else{
            setFliteredData(fliteredData.filter(el=>el.Numero == e.target.value))
        }
        articleTypeInput.current.value = ""
    }

    function handelType(e) {
        setEnvokedId(null);
        setArticleId(null);
        setAjout(false)
        if(e.target.value == ""){
            setFliteredData(data)
        }else{
            setFliteredData(data.filter(el=>el.type_id == e.target.value))
        }
        articleNumInput.current.value = ""
    }
    function handelEnvoke(e){
        setEnvokedId(e._id)
        setArticleId(null);
        setAjout(false)
    }
    function showModal () {
        return new Promise((resolve) => {
          setModalPromise(() => resolve); 
          setIsModalOpen(true); 
        });
      };
    function handleCancel(){
        if (modalPromise) modalPromise(false);
        setIsModalOpen(false)
    }
    function handleDelete(){
        if (modalPromise) modalPromise(true);
        setIsModalOpen(false)
    }
    function ValidateExcelInput(numero,typeInput,marque,desc,qte,pre,pru){
        const regex1 = /^[a-zA-Z0-9 ]+$/;
        const regex2 = /^[a-zA-Z ]+$/;
        const regex3 = /^[0-9]+$/;
        const number = Number(numero)
        const errorNum = numero && regex3.test(numero)?
        !data.map(e=>e.Numero).includes(number)?
        number <= 0 ?"not Allowed":
        "":
        "this number is used":
        "Required"
        const errorMarque = marque?regex1.test(marque)?marque.trim() == ""?"Required":"":"unallowed character":"Required"
        const errorDesc = desc?regex1.test(desc)?desc.trim() == ""?"Required":"":"unallowed character":"Required"
        const errorQte = qte && regex3.test(qte)?qte <= 0?"not Allowed":"":"Required"
        const errorPre = pre && regex3.test(qte)?pre <= 0?"not Allowed":"":"Required"
        const errorPru = pru && regex3.test(qte)?pru <= 0?"not Allowed":"":"Required"
        const errorType = typeInput?regex2.test(typeInput)?typeInput.trim()==""?"Required":typeData.map(e=>e.libelle.toLowerCase()).includes(typeInput.trim().toLowerCase())?"":"Invalid type":"unallowed character":"Required"
        
        const error = errorMarque  + errorDesc + errorNum + errorQte + errorPre + errorPru + errorType

        return error
    }

    return(
    <div className="flex flex-col w-full">
        {isPanelVisible && <NotificationExcelPanel addedRows={ExcelResult[0]} declinedRows={ExcelResult[1]} visiblity={isPanelVisible} setVisible={setIsPanelVisible}/> }
        <h1 className="font-bold text-blue-500 mb-2 text-center mt-4 pr-40">Articles</h1>
        <div className="mt-3 ml-3 flex gap-10 w-full">
            <div className="mt-3 ml-3">
                <div className="flex gap-2 my-2 ml-2">
                    <button className="bg-gray-100 " onClick={()=>{setIsExpanded(!isExpanded);setEnvokedId(null)}}>{isExpanded?<CollapseIcon/>:<ExpandIcon/>}</button>
                {
                    marche == null ? null :
                    <button className="bg-gray-100" onClick={()=>{setEnvokedId(null);setAjout(!Ajout);setUpdate(false);setArticleId(null);setError(["","",""]);setNError(["","",""])}}>{Ajout?<CloseIcon/>:<AddIcon/>}</button>
                }
                {
                    marche == null ? null :
                    <div className="">
                                <input type="file" accept=".xlsx, .xls" className="hidden" id="fileInputMarche" onChange={handelExcel}/>
                                <label 
                                    htmlFor="fileInputMarche" 
                                    className="cursor-pointer flex items-center bg-green-100 text-white p-[10px] rounded hover:bg-green-700 focus:ring focus:ring-green-300"
                                >
                                    <ExcelIcon/>
                                </label>
                    </div>
                }
                </div>
                <div className="flex gap-3 p-3 items-center">
                    <label htmlFor="marches">Selectionner un marche</label>
                    <select  id="marches" onChange={(e)=>handelArticle(e)} value={selectedOption}>
                        <option value={""}>selectionner</option>
                        {
                            marches.map((e,i)=>{
                                return <option value={String(e._id)} key={i} >{e.reference}</option>
                            })
                        }
                    </select>
                </div>
                <div className="flex gap-3 p-3 items-center">
                    <label htmlFor="type">Chercher par type</label>
                    <select  id="type" onChange={(e)=>handelType(e)} ref={articleTypeInput}>
                        <option value="">All</option>
                        {
                            typeData.map((e,i)=>{
                                return <option value={e._id} key={i}>{e.libelle}</option>
                            })
                        }
                    </select>
                </div>
                <div className="flex gap-3 p-3 items-center">
                    <label htmlFor="numero">Chercher par Numero</label>
                    <input type="number"  id="numero" className="input-base" ref={articleNumInput} onChange={(e)=>handelFilter(e)}/>
                </div>
                <table className="mt-4 table-auto border-collapse border border-gray-300  shadow-md">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="border border-gray-300 px-6 py-3">Numero</th>
                            <th className="border border-gray-300 px-6 py-3">Type</th>
                            <th className="border border-gray-300 px-6 py-3">Marque</th>
                            <th className="border border-gray-300 px-6 py-3">Description</th>
                            {isExpanded?<th className="border border-gray-300 px-6 py-3">Quantite</th>:null}
                            {isExpanded?<th className="border border-gray-300 px-6 py-3">Prix estimatif</th>:null}
                            {isExpanded?<th className="border border-gray-300 px-6 py-3">Prix unitaire</th>:null}
                            {isExpanded?<th className="border border-gray-300 px-6 py-3">Prix total</th>:null}
                            {!isExpanded?<th className="border border-gray-300 px-6 py-3"></th>:null}
                            {!isExpanded?<th className="border border-gray-300 px-6 py-3"></th>:null}
                        </tr>
                    </thead>
                    <tbody>
                    {fliteredData?.sort((a,b)=>a.Numero - b.Numero).map((e,i)=>{if(EnvokedId == null || EnvokedId == e._id){
                        return <tr key={i} className={`odd:bg-gray-100 even:bg-gray-50 hover:bg-blue-100 text-sm`} >
                        <td  className="border border-gray-300 p-2 cursor-pointer"  onClick={()=>{setIsExpanded(false);handelEnvoke(e)}}>{e.Numero}</td>
                        <td  className="border border-gray-300 p-2 cursor-pointer"  onClick={()=>{setIsExpanded(false);handelEnvoke(e)}}>{typeData.filter((el)=>el._id == e.type_id)[0]?.libelle}</td>
                        <td  className="border border-gray-300 p-2 cursor-pointer"  onClick={()=>{setIsExpanded(false);handelEnvoke(e)}}>{e.marque}</td>
                        <td  className="border border-gray-300 p-2 cursor-pointer"  onClick={()=>{setIsExpanded(false);handelEnvoke(e)}}>{e.description }</td>
                        {isExpanded?<td  className="border border-gray-300 p-2 cursor-pointer" onClick={()=>{setIsExpanded(false);handelEnvoke(e)}}>{e.quantite }</td>:null}
                        {isExpanded?<td  className="border border-gray-300 p-2 cursor-pointer" onClick={()=>{setIsExpanded(false);handelEnvoke(e)}}>{e.prix_estimatif + " DH"}</td>:null}
                        {isExpanded?<td  className="border border-gray-300 p-2 cursor-pointer"  onClick={()=>{setIsExpanded(false);handelEnvoke(e)}}>{e.prix_unitaire + " DH"}</td>:null}
                        {isExpanded?<td  className="border border-gray-300 p-2 cursor-pointer"  onClick={()=>{setIsExpanded(false);handelEnvoke(e)}}>{e.prix_totale + " DH"}</td>:null}
                        {!isExpanded?<td className="border border-gray-300 p-2" >{e._id != articleId || !Update?<button onClick={()=>{setUpdate(true);setAjout(false);setArticleId(e._id);setEnvokedId(null);}}><EditIcon/></button> : <button onClick={()=>{setUpdate(false);setArticleId(null);setError(["","",""]);setNError(["","",""])}}><CloseIcon/></button>}</td>:null}
                        {!isExpanded?<td className="border border-gray-300 p-2"><button onClick={()=>deleteArticleMarche(e._id)}><DeleteIcon/></button></td>:null}
                    </tr>
                    }})}
                    </tbody>
                </table>
                
            </div>
            {  !isExpanded ? 
                <div className="min-h-screen border-l-2  w-1/2 p-4 flex flex-col items-center">
                
                {
                    Ajout && !Update? 
                <div className="flex flex-col bg-white p-6 rounded-lg shadow-md gap-3">
                    <div className="flex gap-3 mt-3">
                        <div className="flex flex-col gap-3 ">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="newNum" className="block text-blue-700 font-semibold mb-2">Numero</label>
                                <input type="number" id="newNum" placeholder="Numero" className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[0]?"border-red-500":"")} ref={newNumeroInput} />
                                {NError[0] && <p className="text-sm text-red-500 mt-1">{NError[0]}</p>}
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <label htmlFor="newType" className="block text-blue-700 font-semibold mb-2">Type</label>
                                <select ref={newTypeInput} id="newType">
                                    {typeData.map((e,i)=>{
                                        return <option value={e._id} key={i}>{e.libelle}</option>
                                    })}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="newMarque" className="block text-blue-700 font-semibold mb-2">Marque</label>
                                <input type="text" id="newMarque" placeholder="Marque" className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[1]?"border-red-500":"")} ref={newMarqueInput} />
                                {NError[1] && <p className="text-sm text-red-500 mt-1">{NError[1]}</p>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="qte" className="block text-blue-700 font-semibold mb-2">Quantite</label>
                                <input type="text" id="qte" placeholder="Quantite" className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[3]?"border-red-500":"")} ref={newQteInput} />
                                {NError[3] && <p className="text-sm text-red-500 mt-1">{NError[3]}</p>}
                            </div> 
                        </div>
                        <div className="flex flex-col gap-3 ">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="pre" className="block text-blue-700 font-semibold mb-2">Prix estimatif</label>
                                <input type="text" id="pre" placeholder="Prix estimatif" className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[4]?"border-red-500":"")} ref={newPreInput} />
                                {NError[4] && <p className="text-sm text-red-500 mt-1">{NError[4]}</p>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="pru" className="block text-blue-700 font-semibold mb-2">Prix unitaire</label>
                                <input type="text" id="pru" placeholder="Prix unitaire" className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[5]?"border-red-500":"")} ref={newPruInput} />
                                {NError[5] && <p className="text-sm text-red-500 mt-1">{NError[5]}</p>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="newDesc" className="block text-blue-700 font-semibold mb-2">Description</label>
                                <textarea  id="newDesc"  placeholder="Description" className={"input-base resize-none w-80 h-[122px] px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[2]?"border-red-500":"")} ref={newDescInput}></textarea>
                                {NError[2] && <p className="text-sm text-red-500 mt-1">{NError[2]}</p>}
                            </div>
                        </div> 
                    </div>
                    <div className="flex justify-center">
                        <button className="w-fit" onClick={()=>addArticleMarche()}><SaveIcon/></button>
                    </div>
                </div>
                    : null
                }
                {
                    !Ajout && Update? 
                <div className="flex flex-col bg-white p-6 rounded-lg shadow-md gap-3">
                    <div className="flex gap-3 mt-3">
                        <div className="flex flex-col gap-3 ">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="num" className="block text-blue-700 font-semibold mb-2">Numero</label>
                                <input type="number" id="num" className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[0]?"border-red-500":"")} ref={numeroInput} defaultValue={data.filter(e=>e._id == articleId)[0].Numero}/>
                                {Error[0] && <p className="text-sm text-red-500 mt-1">{Error[0]}</p>}
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <label htmlFor="type" className="block text-blue-700 font-semibold mb-2">Type</label>
                                <select id="type" ref={typeInput} defaultValue={data.filter(e=>e._id == articleId)[0].type_id}>
                                    <option value="">Select a type</option>
                                    {typeData.map((e,i)=>{
                                        return <option value={e._id} key={i}>{e.libelle}</option>
                                    })}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="marque" className="block text-blue-700 font-semibold mb-2">Marque</label>
                                <input type="text" id="marque" className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[1]?"border-red-500":"")} ref={marqueInput} defaultValue={data.filter(e=>e._id == articleId)[0].marque}/>
                                {Error[1] && <p className="text-sm text-red-500 mt-1">{Error[1]}</p>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="qte" className="block text-blue-700 font-semibold mb-2">Quantite</label>
                                <input type="text" id="qte" className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[3]?"border-red-500":"")} ref={qteInput} defaultValue={data.filter(e=>e._id == articleId)[0].quantite}/>
                                {Error[3] && <p className="text-sm text-red-500 mt-1">{Error[3]}</p>}
                            </div>
                        </div> 
                        <div className="flex flex-col gap-3 ">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="pre" className="block text-blue-700 font-semibold mb-2">Prix estimatif</label>
                                <input type="text" id="pre" className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[4]?"border-red-500":"")} ref={preInput} defaultValue={data.filter(e=>e._id == articleId)[0].prix_estimatif}/>
                                {Error[4] && <p className="text-sm text-red-500 mt-1">{Error[4]}</p>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="pru" className="block text-blue-700 font-semibold mb-2">Prix unitaire</label>
                                <input type="text" id="pru"  className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[5]?"border-red-500":"")} ref={pruInput} defaultValue={data.filter(e=>e._id == articleId)[0].prix_unitaire}/>
                                {Error[5] && <p className="text-sm text-red-500 mt-1">{Error[5]}</p>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="desc" className="block text-blue-700 font-semibold mb-2">Description</label>
                                <textarea  id="desc"  className={"input-base resize-none w-80 h-[122px] px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[2]?"border-red-500":"")} ref={descInput} defaultValue={data.filter(e=>e._id == articleId)[0].description}></textarea>
                                {Error[2] && <p className="text-sm text-red-500 mt-1">{Error[2]}</p>}
                            </div>
                        </div>
                
                    </div>
                    <div className="flex justify-center">
                        <button className="w-fit" onClick={()=>updateArticleMarche(articleId)}><SaveIcon/></button>
                    </div>
                </div>
                    : null
                }
                {
                    EnvokedId !== null?
                    <div className="h-screen relative">
                        <div>
                            <button onClick={()=>setEnvokedId(null)} className="absolute right-0"><CloseIcon/></button>
                        </div>
                        
                        <ArticleLivre qte={data.find(e=>e._id == EnvokedId).quantite} articleId={EnvokedId}/>
                    </div>
                    
                    : null
                }
                </div> : null
            }
            {isModalOpen && <WarningModal onConfirm={handleDelete} onCancel={handleCancel} message={"Deleting a ArticleMarche will delete all ArticleLivre related"} />}
        </div>
    </div>
    )
}