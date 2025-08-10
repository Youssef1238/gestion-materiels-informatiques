import api from '../../utils/Api';
import * as XLSX from'xlsx'
import { useEffect, useRef, useState } from "react"
import {EditIcon,DeleteIcon,CloseIcon,AddIcon,SaveIcon,UpdateIcon,ExcelIcon} from '../../assets/Icons';
import { WarningModal } from "../WarningModal";
import { useNavigate } from "react-router-dom";
import NotificationExcelPanel from "../NotificationExcelPanel";

export default function EntiteAdmin() {

    const [editMode,setEditMode] = useState(null)
    const [changed,setChanged] = useState(false)
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [modalPromise, setModalPromise] = useState(null);
    const libelleArInput = useRef(null)
    const libelleFrInput = useRef(null)
    const newLibelleArInput = useRef(null)
    const newLibelleFrInput = useRef(null)
    const [Ajout,setAjout] = useState(false);
    const [data,setData] = useState([])
    const Navigate = useNavigate()
    const [libelleARError,setlibelleARError] = useState("")
    const [libelleFRError,setlibelleFRError] = useState("")
    const [NlibelleARError,setNlibelleARError] = useState("")
    const [NlibelleFRError,setNlibelleFRError] = useState("")
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const [ExcelResult, setExcelResult] = useState([0,0]);

    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const res = await api.get(`http://localhost:5500/entiteAdmin`)
                
                setData(res.data)
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

    async function updateEntiteAdmin(id){
        const error = ValidateInput(libelleArInput.current.value,libelleFrInput.current.value,1)
        if(error == ""){
            try{
                await api.put('http://localhost:5500/entiteAdmin',{
                    id : id,
                    libelle_ar : libelleArInput.current.value.trim(),
                    libelle_fr : libelleFrInput.current.value.trim()
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

    async function addEntiteAdmin(){
        const error = ValidateInput(newLibelleArInput.current.value,newLibelleFrInput.current.value,0)
        if(error == ""){
            try {
                await api.post('http://localhost:5500/entiteAdmin',{
                    libelle_ar : newLibelleArInput.current.value.trim(),
                    libelle_fr : newLibelleFrInput.current.value.trim(),
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
    async function deleteEntiteAdmin(id){
        const userConfirmed = await showModal();
        if(userConfirmed){
            try {
                await api.delete('http://localhost:5500/entiteAdmin',{
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
            const entiteAdmins = XLSX.utils.sheet_to_json(sheet)
            entiteAdmins.forEach(async (e)=>{
                const error = ValidateInput(e["Libelle en Arabe"],e["Libelle en Français"],2)
                if(error == ""){
                    setExcelResult(prv=>[prv[0] + 1 , prv[1]])
                    try {
                        await api.post('http://localhost:5500/entiteAdmin',{
                            libelle_ar : e["Libelle en Arabe"].trim(),
                            libelle_fr : e["Libelle en Français"].trim(),
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
    function ValidateInput(libelleAR,libelleFR,type){
        const regex1 = /[^A-Za-z\s]/;
        const regex2 = /^[\u0600-\u06FF\s]+$/;

        const errorLibelleFR = libelleFR?regex1.test(libelleFR)?"only a-z A-Z are allowed":libelleFR.trim() == ""?"Required":"":"Required"
        const errorLibelleAR = libelleFR?!regex2.test(libelleAR)?"only arabic caracters allowed":libelleAR.trim() == ""?"Required":"":"Required"
        const error = errorLibelleFR + errorLibelleAR
        if(type == 0){
            setNlibelleFRError(errorLibelleFR)
            setNlibelleARError(errorLibelleAR)
        }else if(type == 1){
            setlibelleFRError(errorLibelleFR)
            setlibelleARError(errorLibelleAR)
        }
        
        return error
    }




    return(
        <div className="flex flex-col w-full">
            {isPanelVisible && <NotificationExcelPanel addedRows={ExcelResult[0]} declinedRows={ExcelResult[1]} visiblity={isPanelVisible} setVisible={setIsPanelVisible}/> }
            <h1 className="font-bold text-blue-500 mb-2 text-center mt-4">Entite administrative</h1>
            <div className="mt-3 ml-3 flex gap-10 w-full">
                <div className="w-1/2">
                    <table className="mt-4 table-auto border-collapse border border-gray-300 w-full shadow-md">
                        <thead>
                            <tr className="bg-blue-500 text-white">
                                <th className="border border-gray-300 px-6 py-3">Libelle AR</th>
                                <th className="border border-gray-300 px-6 py-3">Libelle FR</th>
                                <th className="border border-gray-300 px-6 py-3"></th>
                                <th className="border border-gray-300 px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                        {data.map((e,i)=>{
                            return <tr key={i} className="odd:bg-gray-100 even:bg-gray-50 hover:bg-blue-100 text-sm">
                            <td className="border border-gray-300 px-6 py-3">{editMode != i ?e.libelle_ar :<input type="text" defaultValue={e.libelle_ar} ref={libelleArInput} className={"input-base " +  (libelleARError?"border-red-500":"")}/>}
                            {libelleARError && editMode == i && <p className="text-sm text-red-500 mt-1">{libelleARError}</p>}
                            </td>
                            <td className="border border-gray-300 px-6 py-3">{editMode != i ?e.libelle_fr :<input type="text" defaultValue={e.libelle_fr} ref={libelleFrInput} className={"input-base " +  (libelleFRError?"border-red-500":"")}/>}
                            {libelleFRError && editMode == i && <p className="text-sm text-red-500 mt-1">{libelleFRError}</p>}
                            </td>
                            <td className="border border-gray-300 px-6 py-3">{editMode != i ?<button onClick={()=>setEditMode(i)}><EditIcon/></button> : <button onClick={()=>updateEntiteAdmin(e._id)}><UpdateIcon/></button>}</td>
                            <td className="border border-gray-300 px-6 py-3">{editMode != i ?<button onClick={()=>deleteEntiteAdmin(e._id)}><DeleteIcon/></button> : <button onClick={()=>{setEditMode(null);setlibelleARError("");setlibelleFRError("")}}><CloseIcon/></button>}</td>
                        </tr>
                        })}
                        </tbody>
                    </table>
                </div>
                <div className="h-screen border-l-2 w-1/2 p-4 flex flex-col items-center">
        <div className="flex gap-2 my-2">
                <button className="bg-gray-100" onClick={()=>{setAjout(!Ajout);setNlibelleARError("");setNlibelleFRError("")}}>{Ajout?<CloseIcon/>:<AddIcon/>}</button>
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
                    <div className="flex flex-col gap-3 mt-3 items-center bg-white p-6 rounded-lg shadow-md ">
                        <div className="flex flex-col gap-3">
                            <label htmlFor="newLibelleAR" className="block text-blue-700 font-semibold mb-2">Libelle en Arabe</label>
                            <input type="text" placeholder="الإسم" id="newLibelleAR" ref={newLibelleArInput} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NlibelleARError?"border-red-500":"")}/>
                            {NlibelleARError && <p className="text-sm text-red-500 mt-1">{NlibelleARError}</p>}
                        </div>
                        <div className="flex flex-col gap-3">
                            <label htmlFor="newLibelleFR" className="block text-blue-700 font-semibold mb-2">Libelle en Français</label>
                            <input type="text" placeholder="Libelle" id="newLibelleFR" ref={newLibelleFrInput} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NlibelleFRError?"border-red-500":"")}/>
                            {NlibelleFRError && <p className="text-sm text-red-500 mt-1">{NlibelleFRError}</p>}
                        </div>
                        <button className="w-fit" onClick={()=>addEntiteAdmin()}><SaveIcon/></button>
                    </div>
                    : null
                }
                </div>
                {isModalOpen && <WarningModal onConfirm={handleDelete} onCancel={handleCancel} message={"Deleting an entiteAdmin will delete all affectations related"} />}
            </div>
        </div>

    )
}