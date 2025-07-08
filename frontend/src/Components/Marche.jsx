import api from "../utils/Api";
import { useEffect, useRef, useState } from "react"
import * as XLSX from 'xlsx'
import {EditIcon,DeleteIcon,CloseIcon,AddIcon,SaveIcon,UpdateIcon,ExcelIcon} from '../assets/Icons';
import { WarningModal } from "./WarningModal";
import { useNavigate } from "react-router-dom";
import NotificationExcelPanel from "./NotificationExcelPanel";

export default function Marche(props) {

    const [editMode,setEditMode] = useState(null)
    const [changed,setChanged] = useState(false)
    const objetInput = useRef(null)
    const referenceInput = useRef(null)
    const typeInput = useRef(null)
    const fournisseurInput = useRef(null)
    const dateInput = useRef(null)
    const newObjetInput = useRef(null)
    const newReferenceInput = useRef(null)
    const newTypeInput = useRef(null)
    const newFournisseurInput = useRef(null)
    const newDateInput = useRef(null)
    // Type , Objet , reference , fournisseur , date 
    const [Error,setError] = useState(["","","",""])
    const [NError,setNError] = useState(["","","",""])
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const [ExcelResult, setExcelResult] = useState([0,0]);
    const [Ajout,setAjout] = useState(false);
    const [data,setData] = useState([])
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [modalPromise, setModalPromise] = useState(null);
    const [filteredData,setFilteredData] = useState([])
    const [fournisseur,setFournisseur] = useState([])
    const fournisseurFilterInput = useRef()
    const referenceFilterInput = useRef()
    const Navigate = useNavigate()

    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const res = await api.get(`http://localhost:5500/marche`)
                setData(res.data)
                setFilteredData(res.data)
                const fRes = await api.get(`http://localhost:5500/fournisseur`)
                
                setFournisseur(fRes.data)
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

    async function updateMarche(id){
        const regex1 = /^[a-zA-Z0-9 ]+$/;
        const regex3 = /^\d+\/\d{2}$/;
        const errorObjet = objetInput.current.value.trim() == ""?"Required":regex1.test(objetInput.current.value)?"":"only a-z A-Z are allowed"
        const errorReference = referenceInput.current.value.trim() == ""?"Required":regex3.test(referenceInput.current.value)?"":"format incorrecte"
        const errorType = typeInput.current.value.trim() == ""?"Required":regex1.test(typeInput.current.value)?"":"only a-z A-Z are allowed"
        
        
        const error = errorObjet + errorReference + errorType  


        setError([errorType,errorObjet,errorReference])
        if(error == ""){
            try{
                await api.put('http://localhost:5500/marche',{
                    id : id,
                    objet : objetInput.current.value.trim(),
                    reference : referenceInput.current.value,
                    type : typeInput.current.value,
                    fournisseur_id : fournisseurInput.current.value,
                    date_creation : dateInput.current.value
                    
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

    async function addMarche(){
        const regex1 = /^[a-zA-Z ]+$/;
        const regex3 = /^\d+\/\d{2}$/;

        const errorObjet = newObjetInput.current.value.trim() == ""?"Required":regex1.test(newObjetInput.current.value)?"":"only a-z A-Z are allowed"
        const errorReference = newReferenceInput.current.value.trim() == ""?"Required":regex3.test(newReferenceInput.current.value)?"":"format incorrecte"
        const errorType = newTypeInput.current.value.trim() == ""?"Required":regex1.test(newTypeInput.current.value)?"":"only a-z A-Z are allowed"

        
        const error = errorObjet + errorReference + errorType  


        setNError([errorType,errorObjet,errorReference])
        if(error == ""){
            try {
                await api.post('http://localhost:5500/marche',{
                    objet : newObjetInput.current.value.trim(),
                    reference : newReferenceInput.current.value,
                    type : newTypeInput.current.value,
                    fournisseur_id : newFournisseurInput.current.value,
                    date_creation : newDateInput.current.value
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
    async function deleteMarche(id){
        const userConfirmed = await showModal();
        if(userConfirmed){
            try {
                await api.delete('http://localhost:5500/marche',{
                    data : {id : id},              
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
            const marches = XLSX.utils.sheet_to_json(sheet)
            marches.forEach(async (e)=>{
                const error = ValidateExcelInput(e["Objet"],e["Reference"],e["Type"],e["Fournisseur"],e["Date de Creation"])
                console.log(error)
                if(error == ""){
                    setExcelResult(prv=>[prv[0] + 1 , prv[1]])
                    try {
                        await api.post('http://localhost:5500/marche',{
                            objet : e["Objet"].trim(),
                            reference : e["Reference"],
                            type : e["Type"].trim(),
                            fournisseur_id : fournisseur.find(el=>el.nom.toLowerCase() == e["Fournisseur"].trim().toLowerCase())._id,
                            date_creation : new Date(e["Date de Creation"])
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
    async function handelFilter(e) {
        referenceFilterInput.current.value = ""
        if(e.target.value == ""){
            setFilteredData(data)
        }else{
            try {
                const res = await api.get(`http://localhost:5500/marche/fournisseur/${e.target.value}`)
                setFilteredData(res.data)
                
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
    function handelReferenceFilter(e){
        if(e.target.value != ""){
            fournisseurFilterInput.current.value = ""
            setFilteredData(data.filter(el=>el.reference == e.target.value))
        }else{
            setFilteredData(data)
        }
    }
    function handelConsulter(id){
        props.setMarcheId(id)
        props.setOption(1)
    }
    function showModal () {
        return new Promise((resolve) => {
          setModalPromise(() => resolve); 
          setIsModalOpen(true); 
        });
    }
    function handleCancel(){
        if (modalPromise) modalPromise(false);
        setIsModalOpen(false)
    }
    function handleDelete(){
        if (modalPromise) modalPromise(true);
        setIsModalOpen(false)
    }
    function ValidateExcelInput(objet,reference,type,fournisseurInput,date){
        const regex1 = /^[a-zA-Z0-9 ]+$/;
        const regex2 = /^[a-zA-Z ]+$/;
        const regex3 = /^\d+\/\d{2}$/;

        const errorObjet = objet?regex1.test(objet)?objet.trim() == ""?"Required":"":"only a-z A-Z are allowed":"Required"
        const errorReference = reference?regex3.test(reference)?reference.trim() == ""?"Required":"":"format incorrecte":"Required"
        const errorType = type?type.trim() == ""?"Required":regex1.test(type)?"":"only a-z A-Z are allowed":"Required"
        const errorFournisseur = fournisseurInput?regex2.test(fournisseurInput)?fournisseurInput.trim() == ""?"Required":fournisseur.map(e=>e.nom.toLowerCase()).includes(fournisseurInput.trim().toLowerCase())?"":"Invalid fournisseur":"only a-z A-Z are allowed":"Required"
        const errorDate = date?!isNaN(new Date(date,"DD-MM-YYYY"))?"format incorrecte":"":"Required"
        const error = errorObjet + errorReference + errorType + errorFournisseur + errorDate
        return error
    }

    return(
    <div className="flex flex-col w-full">
        {isPanelVisible && <NotificationExcelPanel addedRows={ExcelResult[0]} declinedRows={ExcelResult[1]} visiblity={isPanelVisible} setVisible={setIsPanelVisible}/> }
        <h1 className="font-bold text-blue-500 mb-2 text-center mt-4">Marches</h1>
        <div className="mt-3 ml-3 flex gap-10 w-full">
            <div className="w-1/2">
                <div className="flex gap-3 p-3 items-center">
                    <label htmlFor="fournisseur" >Selectionner un fournisseur</label>
                    <select  id="fournisseur" onChange={(e)=>handelFilter(e)} ref={fournisseurFilterInput} >
                        <option className="bg-white text-gray-700" value="" >All</option>
                        {
                            fournisseur.map((e,i)=>{
                                return <option className="bg-white text-gray-700" value={e._id} key={i}>{e.nom}</option>
                            })
                        }
                    </select>
                </div>
                <div className="flex gap-3 p-3 items-center">
                    <label htmlFor="reference">Chercher par reference</label>
                    <input type="text"  id="reference" className="input-base" onChange={(e)=>handelReferenceFilter(e)} ref={referenceFilterInput}/>
                </div>
                <table className="mt-4 table-auto border-collapse border border-gray-300 w-fit shadow-md">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="border border-gray-300 px-6 py-3">Type</th>
                            <th className="border border-gray-300 px-6 py-3">Objet</th>
                            <th className="border border-gray-300 px-6 py-3">Reference</th>
                            <th className="border border-gray-300 px-6 py-3">Fournisseur</th>
                            <th className="border border-gray-300 px-6 py-3">Date de creation</th>
                            <th className="border border-gray-300 px-6 py-3"></th>
                            <th className="border border-gray-300 px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredData?.sort((a,b)=>new Date(a.date_creation) - new Date(b.date_creation)).map((e,i)=>{
                        return <tr key={i} className="odd:bg-gray-100 even:bg-gray-50 hover:bg-blue-100 text-sm" >
                        <td className={"border border-gray-300 px-2 py-2 "+(editMode != i?"cursor-pointer" : "")} onClick={()=>editMode != i?handelConsulter(e._id) : null}>{editMode != i?e.type :<input type="text" className="input-base w-[100px] p-1" defaultValue={e.type} ref={typeInput}/>}
                        {Error[0] && <p className="text-sm text-red-500 mt-1">{Error[0]}</p>}
                        </td>
                        <td className={"border border-gray-300 px-2 py-2 "+(editMode != i?"cursor-pointer" : "")} onClick={()=>editMode != i?handelConsulter(e._id) : null}>{editMode != i?e.objet :<input type="text" className="input-base w-[100px] p-1" defaultValue={e.objet} ref={objetInput}/>}
                        {Error[1] && <p className="text-sm text-red-500 mt-1">{Error[1]}</p>}
                        </td>
                        <td className={"border border-gray-300 px-2 py-2 "+(editMode != i?"cursor-pointer" : "")} onClick={()=>editMode != i?handelConsulter(e._id) : null}>{editMode != i?e.reference :<input type="text" className="input-base w-[100px] p-1" defaultValue={e.reference} ref={referenceInput}/>}
                        {Error[2] && <p className="text-sm text-red-500 mt-1">{Error[2]}</p>}
                        </td>
                        <td className={"border border-gray-300 px-2 py-2 "+(editMode != i?"cursor-pointer" : "")} onClick={()=>editMode != i?handelConsulter(e._id) : null}>{
                            editMode != i?fournisseur.length >0?fournisseur.filter((el)=>el._id === e.fournisseur_id)[0]?.nom :"" :
                            <select ref={fournisseurInput}>
                                {fournisseur.map((e,i)=>{
                                    return <option value={e._id} key={i}>{e.nom}</option>
                                })}
                            </select>
                            }
                        </td>
                        <td className={"border border-gray-300 px-2 py-2 "+(editMode != i?"cursor-pointer" : "")} onClick={()=>editMode != i?handelConsulter(e._id) : null}>{editMode != i?e.date_creation.split('T')[0] :<input type="Date" defaultValue={e.date_creation.split('T')[0]} className="input-base" ref={dateInput}/>}</td>
                        <td className="border border-gray-300 px-2 py-2">{editMode != i?<button onClick={()=>{setEditMode(i)}}><EditIcon/></button> : <button onClick={()=>{updateMarche(e._id)}}><UpdateIcon/></button>}</td>
                        <td className="border border-gray-300 px-2 py-2">{editMode != i?<button onClick={()=>deleteMarche(e._id)}><DeleteIcon/></button> : <button onClick={()=>{setEditMode(null);setError(["","",""]);setNError(["","",""])}}><CloseIcon/></button>}</td>
                    </tr>

                    })}
                    </tbody>
                </table>
                
            </div>
            <div className="h-screen border-l-2 w-1/2 p-4 flex flex-col items-center">
                <div className="flex gap-2 my-2">
                    <button className="bg-gray-100" onClick={()=>{setAjout(!Ajout);setError(["","",""]);setNError(["","",""])}}>{Ajout?<CloseIcon/>:<AddIcon/>}</button>
                    <div className="">
                        <input type="file" accept=".xlsx, .xls" className="hidden" id="fileInput" onChange={handelExcel}/>
                        <label 
                            htmlFor="fileInput" 
                            className="cursor-pointer flex items-center bg-green-100 text-white p-[10px] rounded hover:bg-green-700 focus:ring focus:ring-green-300"
                        >
                            <ExcelIcon/>
                        </label>
                    </div>
                </div>
                {
                    Ajout? 
                    <div className="flex flex-col gap-3 mt-3 items-center bg-white p-6 rounded-lg shadow-md">
                        <div className="flex flex-col gap-3">
                            <label htmlFor="newType" className="block text-blue-700 font-semibold mb-2">Type</label>
                            <input type="text" id="newType" placeholder="Type" ref={newTypeInput} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[0]?"border-red-500":"")}/>
                            {NError[0] && <p className="text-sm text-red-500 mt-1">{NError[0]}</p>}
                        </div>
                        <div className="flex flex-col gap-3">
                            <label htmlFor="newObject" className="block text-blue-700 font-semibold mb-2">Objet</label>
                            <input type="text" id="newObject" placeholder="Objet" ref={newObjetInput} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[1]?"border-red-500":"")}/>
                            {NError[1] && <p className="text-sm text-red-500 mt-1">{NError[1]}</p>}
                        </div>
                        <div className="flex flex-col gap-3">
                            <label htmlFor="newReference" className="block text-blue-700 font-semibold mb-2">Reference</label>
                            <input type="text" id="newReference" placeholder="Reference" ref={newReferenceInput} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[2]?"border-red-500":"")}/>
                            {NError[2] && <p className="text-sm text-red-500 mt-1">{NError[2]}</p>}
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            <label htmlFor="newFournisseur" className="block text-blue-700 font-semibold mb-2">Fournisseur</label>
                            <select id="newFournisseur" ref={newFournisseurInput} className="w-full">
                                {fournisseur.map((e,i)=>{
                                        return <option value={e._id} key={i}>{e.nom}</option>
                                })}
                            </select>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            <label htmlFor="newDate" className="block text-blue-700 font-semibold mb-2">date de Creation</label>
                            <input type="Date" id="newDate" ref={newDateInput} defaultValue={new Date().toISOString().split('T')[0]} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 "}/>
                        </div>
                        <button className="w-fit" onClick={()=>addMarche()}><SaveIcon/></button>
                    </div>
                : null
                }
            </div>
            {isModalOpen && <WarningModal onConfirm={handleDelete} onCancel={handleCancel} message={"Deleting a fournisseur will delete all marches and articles related"} />}
        </div>
    </div>
    )
}