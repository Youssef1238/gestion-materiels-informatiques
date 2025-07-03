import axios from "axios"
import * as XLSX from'xlsx'
import { useEffect, useRef, useState } from "react"
import {EditIcon,DeleteIcon,CloseIcon,AddIcon,SaveIcon,UpdateIcon,ExcelIcon} from '../assets/Icons';
import { WarningModal } from "./WarningModal";
import { useNavigate } from "react-router-dom";
import NotificationExcelPanel from "./NotificationExcelPanel";
import Cookies from "js-cookie"

export default function Type() {
    
    const [editMode,setEditMode] = useState(null)
    const [changed,setChanged] = useState(false)
    const libelleInput = useRef(null)
    const orderInput = useRef(null)
    const newLibelleInput = useRef(null)
    const newOrderInput = useRef(null)
    const [orderError,setOrderError] = useState("")
    const [libelleError,setLibelleError] = useState("")
    const [NorderError,setNOrderError] = useState("")
    const [NlibelleError,setNLibelleError] = useState("")
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [modalPromise, setModalPromise] = useState(null);
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const [ExcelResult, setExcelResult] = useState([0,0]);
    const [Ajout,setAjout] = useState(false);
    const [data,setData] = useState([])
    const Navigate = useNavigate()
    const auth = Cookies.get('id')

    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const res = await axios.get(`http://localhost:5500/type`,{
                    headers : {
                        'authorization' : auth
                    }
                })
                
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

    async function updateType(id){
        
        const error = ValidateInput(id)
        if(error == ""){
            try{
                const res = await axios.put('http://localhost:5500/type',{
                    id : id,
                    libelle : libelleInput.current.value.trim(),
                    order : orderInput.current.value.trim()
                    
                },{
                    headers : {
                        'authorization' : auth
                    }
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

    async function addType(){
        const error = ValidateNewInput(newOrderInput.current.value,newLibelleInput.current.value)

        if(error == ""){
            try {
                const res = await axios.post('http://localhost:5500/type',{
                    libelle : newLibelleInput.current.value.trim(),
                    order : newOrderInput.current.value.trim()
                },{
                    headers : {
                        'authorization' : auth
                    }
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
    async function deleteType(id){
        const userConfirmed = await showModal();
        if(userConfirmed){
            try {
                const res = await axios.delete('http://localhost:5500/type',{
                    data : {id : id},
                    
                        headers : {
                            'authorization' : auth
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
                const error = ValidateNewInput(e["Order"],e["Libelle"])
                if(error == ""){
                    
                    try {
                        const res = await axios.post('http://localhost:5500/type',{
                            libelle : e["Libelle"].trim(),
                            order : e["Order"]
                        },{
                            headers : {
                                'authorization' : auth
                            }
                        })
                        
                        setExcelResult(prv=>[prv[0] + 1 , prv[1]])
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
    function ValidateInput(id){
        const regex1 = /^[a-zA-Z]+$/;
        const number = Number(orderInput.current.value)
        console.log(number)
        const previousNumber = Number(data.find(e=>e._id == id).order)
        const errorLibelle = libelleInput.current.value?regex1.test(libelleInput.current.value)?libelleInput.current.value.trim() == ""?"Required":"":"only a-z A-Z are allowed":"Required"
        const errorOrder = orderInput.current.value?
        number == previousNumber || !data.map(e=>e.order).includes(number)?
        number <= 0?"not Valid":
        "":
        "Already exists":
        "a Number is Required"
        const error = errorOrder + errorLibelle
        setLibelleError(errorLibelle)
        setOrderError(errorOrder)
        return error
    }
    function ValidateNewInput(order,libelle){
        const regex1 = /^[a-zA-Z ]+$/;
        const regex2 = /^[0-9]+$/;
        const number = Number(order)
        const errorLibelle = libelle ?regex1.test(libelle)?libelle.trim() == ""?"Required":"":"only a-z A-Z are allowed":"Required"
        const errorOrder = order && regex2.test(order)?!data.map(e=>e.order).includes(number)?
        number <= 0?"not Valid":
        "":
        "Already exists"
        : order && Number(order) < 0? "not Valid" : "Required"
        const error = errorOrder + errorLibelle
        setNLibelleError(errorLibelle)
        setNOrderError(errorOrder)
        return error
    }



    return(
        <div className="flex flex-col w-full"> 
            {isPanelVisible && <NotificationExcelPanel addedRows={ExcelResult[0]} declinedRows={ExcelResult[1]} visiblity={isPanelVisible} setVisible={setIsPanelVisible}/> }
            <h1 className="font-bold text-blue-500 mb-2 text-center mt-4">Types d'articles</h1>
            <div className="mt-3 ml-3 flex gap-10 w-full">
                <div className="w-1/2">

                    
                    <table className="mt-4 table-auto border-collapse border border-gray-300 w-full shadow-md">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="border border-gray-300 px-6 py-3">Ordre</th>
                            <th className="border border-gray-300 px-6 py-3">Libelle</th>
                            <th className="border border-gray-300 px-6 py-3"></th>
                            <th className="border border-gray-300 px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.sort((a,b)=>a.order-b.order).map((e,i)=>{
                            return <tr key={i} className="odd:bg-gray-100 even:bg-gray-50 hover:bg-blue-100 text-sm">
                            <td  className="border border-gray-300 px-6 py-3">{editMode != i?e.order :<input type="text" defaultValue={e.order} ref={orderInput} className={"input-base " +  (orderError?"border-red-500":"")}/>}
                            {orderError && editMode == i && <p className="text-sm text-red-500 mt-1">{orderError}</p>}
                            </td>
                            <td  className="border border-gray-300 px-6 py-3">{editMode != i?e.libelle :<input type="text" defaultValue={e.libelle} ref={libelleInput} className={"input-base " +  (libelleError?"border-red-500":"")}/>}
                            {libelleError && editMode == i && <p className="text-sm text-red-500 mt-1">{libelleError}</p>}
                            </td>
                            <td  className="border border-gray-300 px-6 py-3">{editMode != i?<button onClick={()=>setEditMode(i)}><EditIcon/></button> : <button onClick={()=>updateType(e._id)}><UpdateIcon/></button>}</td>
                            <td  className="border border-gray-300 px-6 py-3">{editMode != i?<button onClick={()=>deleteType(e._id)}><DeleteIcon/></button> : <button onClick={()=>{setEditMode(null);setOrderError("");setLibelleError("")}}><CloseIcon/></button>}</td>
                        </tr>
                        })}
                        </tbody>
                    </table>
                
                </div>
                <div className="h-screen border-l-2 w-1/2 p-4 flex flex-col items-center">
                    <div className="flex gap-2 my-2">
                        <button className="bg-gray-100" onClick={()=>{setAjout(!Ajout);setNLibelleError("");setNOrderError("")}}>{Ajout?<CloseIcon/>:<AddIcon/>}</button>
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
                            <div className={"flex flex-col gap-3"}>
                                <label htmlFor="order" className="block text-blue-700 font-semibold mb-2">Order</label>
                                <input type="number" id="order" placeholder="Order" ref={newOrderInput} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NorderError?"border-red-500":"")} 
                                />
                                {NorderError && <p className="text-sm text-red-500 mt-1">{NorderError}</p>}
                            </div>
                            <div className="flex flex-col gap-3">
                                <label htmlFor="libelle" className="block text-blue-700 font-semibold mb-2">Libelle</label>
                                <input type="text" id="libelle" placeholder="Libelle" ref={newLibelleInput} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NlibelleError?"border-red-500":"")}/>
                                {NlibelleError && <p className="text-sm text-red-500 mt-1">{NlibelleError}</p>}
                            </div>
                            <button className="w-fit" onClick={()=>addType()}><SaveIcon/></button>
                    </div>  
                        
                    : null
                }
                </div>
            
                {isModalOpen && <WarningModal onConfirm={handleDelete} onCancel={handleCancel} message={"Deleting a fournisseur will delete all marches and articles related"} />}
            </div>
            

        </div>
    )
}