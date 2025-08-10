import api from '../../utils/Api';
import * as XLSX from'xlsx'
import {useEffect, useRef, useState } from "react"
import {EditIcon,DeleteIcon,CloseIcon,AddIcon,SaveIcon,ExcelIcon,ExpandIcon,CollapseIcon} from '../../assets/Icons';
import { WarningModal } from "../WarningModal";
import { useNavigate } from "react-router-dom";
import NotificationExcelPanel from "../NotificationExcelPanel";

export default function Fournisseur() {

    const nomInput = useRef(null)
    const qualiteInput = useRef(null)
    const societeInput = useRef(null)
    const capitalInput = useRef(null)
    const patenteInput = useRef(null)
    const RCLieuInput = useRef(null)
    const RCNumInput = useRef(null)
    const CNSSInput = useRef(null)
    const adresseInput = useRef(null)
    const RIBInput = useRef(null)
    const newNomInput = useRef(null)
    const newQualiteInput = useRef(null)
    const newSocieteInput = useRef(null)
    const newCapitalInput = useRef(null)
    const newPatenteInput = useRef(null)
    const newRCLieuInput = useRef(null)
    const newRCNumInput = useRef(null)
    const newCNSSInput = useRef(null)
    const newAdresseInput = useRef(null)
    const newRIBInput = useRef(null)
    // Nom , Qualite , Societe , Capital , Patente , RCLieu , RCNum , CNSS , Adress , RIB
    const [Error,setError] = useState(["","","","","","","","","",""])
    const [NError,setNError] = useState(["","","","","","","","","",""])
    const [Ajout,setAjout] = useState(false);
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [modalPromise, setModalPromise] = useState(null);
    const [data,setData] = useState([])
    const [changed,setChanged] = useState(false)
    const [isExpanded,setIsExpanded] = useState(false)
    const [fournisseur,setFournisseur] = useState(null)
    const [Update,setUpdate] = useState(false)
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const [ExcelResult, setExcelResult] = useState([0,0]);
    const Navigate = useNavigate()


    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const res = await api.get(`http://localhost:5500/fournisseur`)
                
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

    async function updateFournisseur(id){
        const error = ValidateInput(nomInput.current.value,qualiteInput.current.value,societeInput.current.value,
            capitalInput.current.value,patenteInput.current.value,RCLieuInput.current.value,RCNumInput.current.value,
            CNSSInput.current.value,adresseInput.current.value,RIBInput.current.value,1
        )
        if(error == ""){
            try{
                await api.put('http://localhost:5500/fournisseur',{
                    id : id,
                    nom : nomInput.current.value.trim(),
                    qualite : qualiteInput.current.value.trim(),
                    nom_societe : societeInput.current.value.trim(),
                    capital : capitalInput.current.value.trim(),
                    patente : patenteInput.current.value.trim(),
                    RC_lieu : RCLieuInput.current.value.trim(),
                    RC_num : RCNumInput.current.value.trim(),
                    CNSS : CNSSInput.current.value.trim(),
                    adresse : adresseInput.current.value.trim(),
                    RIB : RIBInput.current.value.trim(),
                    
                })
                
                setUpdate(false)
                setFournisseur(null);
                
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

    async function addFournisseur(){
        const error = ValidateInput(newNomInput.current.value,newQualiteInput.current.value,newSocieteInput.current.value,
            newCapitalInput.current.value,newPatenteInput.current.value,newRCLieuInput.current.value,newRCNumInput.current.value,
            newCNSSInput.current.value,newAdresseInput.current.value,newRIBInput.current.value,0
        )
        if(error == ""){
            try {
                await api.post('http://localhost:5500/fournisseur',{
                    nom : newNomInput.current.value.trim(),
                    qualite : newQualiteInput.current.value.trim(),
                    nom_societe : newSocieteInput.current.value.trim(),
                    capital : newCapitalInput.current.value.trim(),
                    patente : newPatenteInput.current.value.trim(),
                    RC_lieu : newRCLieuInput.current.value.trim(),
                    RC_num : newRCNumInput.current.value.trim(),
                    CNSS : newCNSSInput.current.value.trim(),
                    adresse : newAdresseInput.current.value.trim(),
                    RIB : newRIBInput.current.value.trim(),
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
    async function deleteFournisseur(id){
        const userConfirmed = await showModal();
        if(userConfirmed){
            try {
                await api.delete('http://localhost:5500/fournisseur',{
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
            const fournisseurs = XLSX.utils.sheet_to_json(sheet)
            fournisseurs.forEach(async (e,_)=>{
                const error = ValidateInput(e["Nom"],e["Qualite"],e["Societe"],e["Capital"],e["Patente"],e["RC Lieu"],
                    e["RC Numero"],e["CNSS"],e["Adresse"],e["RIB"],2
                )
                if(error == ""){
                    setExcelResult(prv=>[prv[0] + 1 , prv[1]])
                    try {
                        await api.post('http://localhost:5500/fournisseur',{
                            nom : e["Nom"].trim(),
                            qualite : e["Qualite"].trim(),
                            nom_societe : e["Societe"].trim(),
                            capital : e["Capital"],
                            patente : e["Patente"],
                            RC_lieu : e["RC Lieu"].trim(),
                            RC_num : e["RC Numero"],
                            CNSS : e["CNSS"],
                            adresse : e["Adresse"].trim(),
                            RIB : e["RIB"],
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
    function ValidateInput(nom,qualite,societe,capital,patente,RCLieu,RCNum,CNSS,adresse,RIB,type){
        const regex1 = /^[a-zA-Z ]+$/;
        const regex2 = /^[0-9]+$/;
        const regex3 = /^[a-zA-Z0-9° ]+$/;

        const errorNom = nom?regex1.test(nom)?nom.trim() == ""?"Required":"":"only a-z A-Z are allowed":"Required"
        const errorQualite = qualite?regex1.test(qualite)?qualite.trim() == ""?"Required":"":"only a-z A-Z are allowed":"Required"
        const errorSociete = societe?regex1.test(societe)?societe.trim() == ""?"Required":"":"only a-z A-Z are allowed":"Required"
        const errorCapital = capital && regex2.test(capital)?capital <= 0?"not Allowed":"":"a Number is Required"
        const errorPatente = patente && regex2.test(patente)?patente <= 0?"not Allowed":"":"a Number is Required"
        const errorRCLieu = RCLieu ?regex3.test(RCLieu)?RCLieu.trim() == ""?"Required":"":"unallowed caractere spotted":"Required"
        const errorRCNum = RCNum && regex2.test(RCNum)?RCNum <= 0?"not Allowed":"":"a Number is Required"
        const errorCNSS = CNSS && regex2.test(CNSS)?CNSS <= 0?"not Allowed":"":"a Number is Required"
        const errorAdresse = adresse?regex3.test(adresse)?adresse.trim() == ""?"Required":"":"unallowed caractere spotted":"Required"
        const errorRIB = RIB && regex2.test(RIB)?RIB <= 0?"not Allowed":"":"a Number is Required"
        const error = errorNom + errorQualite + errorSociete + errorCapital + errorPatente + errorRCLieu + errorRCNum + errorCNSS + errorAdresse + errorRIB
        if(type == 0){
            setNError([errorNom,errorQualite,errorSociete,errorCapital,errorPatente,errorRCLieu,errorRCNum,errorCNSS,errorAdresse,errorRIB])
        }else if(type == 1){
            setError([errorNom,errorQualite,errorSociete,errorCapital,errorPatente,errorRCLieu,errorRCNum,errorCNSS,errorAdresse,errorRIB])
        }
        return error
        
    }

    return(
        <div className="flex flex-col w-full">
            {isPanelVisible && <NotificationExcelPanel addedRows={ExcelResult[0]} declinedRows={ExcelResult[1]} visiblity={isPanelVisible} setVisible={setIsPanelVisible}/> }
            <h1 className="font-bold text-blue-500 mb-2 text-center mt-4">Fournisseurs</h1>
            <div className="mt-3 ml-3 flex gap-10 w-full"> 
                <div className="w-fit">
                    <div className="flex gap-2 my-2">
                        <button className="bg-gray-100 " onClick={()=>setIsExpanded(!isExpanded)}>{isExpanded?<CollapseIcon/>:<ExpandIcon/>}</button>
                    </div>
                    <table className="mt-4 table-auto border-collapse border border-gray-300 w-full shadow-md">
                        <thead>
                            <tr className="bg-blue-500 text-white">
                                <th className="border border-gray-300 px-6 py-3">Nom</th>
                                {isExpanded?<th className="border border-gray-300 px-6 py-3">Qualite</th>:null}
                                <th className="border border-gray-300 px-6 py-3">Societe</th>
                                {isExpanded?<th className="border border-gray-300 px-6 py-3">Capital</th>:null}
                                <th className="border border-gray-300 px-6 py-3">Patente</th>
                                {isExpanded?<th className="border border-gray-300 px-6 py-3">RC</th>:null}
                                {isExpanded?<th className="border border-gray-300 px-6 py-3">CNSS</th>:null}
                                <th className="border border-gray-300 px-6 py-3">Adresse</th>
                                {isExpanded?<th className="border border-gray-300 px-6 py-3">RIB</th>:null}
                                {!isExpanded?<th className="border border-gray-300 px-6 py-3"></th>:null}
                                {!isExpanded?<th className="border border-gray-300 px-6 py-3"></th>:null}
                            </tr>
                        </thead>
                        <tbody>
                        {data.map((e,i)=>{
                            return  <tr key={i} className="odd:bg-gray-100 even:bg-gray-50 hover:bg-blue-100 text-sm">
                                <td className="border border-gray-300 px-6 py-3">{e.nom}</td>
                                {isExpanded?<td className="border border-gray-300 px-6 py-3">{e.qualite}</td>:null}
                                <td className="border border-gray-300 px-6 py-3">{e.nom_societe}</td>
                                {isExpanded?<td className="border border-gray-300 px-6 py-3">{e.capital}</td>:null}
                                <td className="border border-gray-300 px-6 py-3">{e.patente}</td>
                                {isExpanded?<td className="border border-gray-300 px-6 py-3">{e.RC_lieu + " n ° " +  e.RC_num}</td>:null}
                                {isExpanded?<td className="border border-gray-300 px-6 py-3">{e.CNSS}</td>:null}
                                <td className="border border-gray-300 px-6 py-3">{e.adresse}</td>
                                {isExpanded?<td className="border border-gray-300 px-6 py-3">{e.RIB}</td>:null}
                                {!isExpanded?<td className="border border-gray-300 px-6 py-3">{<button onClick={(fournisseur && fournisseur._id != e._id || !Update)?()=>{setFournisseur(e);setUpdate(true);setAjout(false)}:()=>{setFournisseur(null);setUpdate(false);setError(["","","","","","","","","",""]);setNError(["","","","","","","","","",""])}}>{(fournisseur && fournisseur._id != e._id || !Update)?<EditIcon/>:<CloseIcon/>}</button>}</td>:null}
                                {!isExpanded?<td className="border border-gray-300 px-6 py-3">{<button onClick={()=>deleteFournisseur(e._id)}><DeleteIcon/></button>}</td>:null}
                            </tr>
                        })}

                        </tbody>
                    </table>
                </div>
                {!isExpanded?
                    <div className="min-h-screen border-l-2 w-1/2 p-4 flex flex-col items-center">
                        <div className="flex gap-2 my-2">
                            <button className="bg-gray-100" onClick={()=>{setAjout(!Ajout);setUpdate(false);setError(["","","","","","","","","",""]);setNError(["","","","","","","","","",""])}}>{Ajout?<CloseIcon/>:<AddIcon/>}</button>
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
                            Ajout && !Update? 
                        <div className="flex flex-col bg-white p-6 rounded-lg shadow-md gap-3">
                            <div className="flex gap-3 mt-3">
                                <div className="flex flex-col gap-3 ">
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="newNom" className="block text-blue-700 font-semibold mb-2">Nom</label>
                                        <input type="text" id="newNom" placeholder="Nom" ref={newNomInput}  className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[0]?"border-red-500":"")}
                                        />
                                        {NError[0] && <p className="text-sm text-red-500 mt-1">{NError[0]}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="newQualite" className="block text-blue-700 font-semibold mb-2">Qualite</label>
                                        <input type="text" id="newQualite" placeholder="Qualite" ref={newQualiteInput}  className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[1]?"border-red-500":"")}/>
                                        {NError[1] && <p className="text-sm text-red-500 mt-1">{NError[1]}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="newSociete" className="block text-blue-700 font-semibold mb-2">Societe</label>
                                        <input type="text" id="newSociete" placeholder="Societe" ref={newSocieteInput}  className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[2]?"border-red-500":"")}/>
                                        {NError[2] && <p className="text-sm text-red-500 mt-1">{NError[2]}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="newCapital" className="block text-blue-700 font-semibold mb-2">Capital</label>
                                        <input type="number" id="newCapital" placeholder="Capital" ref={newCapitalInput} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[3]?"border-red-500":"")}/>
                                        {NError[3] && <p className="text-sm text-red-500 mt-1">{NError[3]}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="newPatente" className="block text-blue-700 font-semibold mb-2">Patente</label>
                                        <input type="number" id="newPatente" placeholder="Patente" ref={newPatenteInput}  className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[4]?"border-red-500":"")}/>
                                        {NError[4] && <p className="text-sm text-red-500 mt-1">{NError[4]}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 ">
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="newRcLieu" className="block text-blue-700 font-semibold mb-2">RC Lieu</label>
                                        <input type="text" id="newRcLieu" placeholder="Lieu" ref={newRCLieuInput}  className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[5]?"border-red-500":"")}/>
                                        {NError[5] && <p className="text-sm text-red-500 mt-1">{NError[5]}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="newRCNum" className="block text-blue-700 font-semibold mb-2">RC numero</label>
                                        <input type="number" id="newRCNum" placeholder="Numero" ref={newRCNumInput}  className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[6]?"border-red-500":"")}/>
                                        {NError[6] && <p className="text-sm text-red-500 mt-1">{NError[6]}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="newCNSS" className="block text-blue-700 font-semibold mb-2">CNSS</label>
                                        <input type="number" id="newCNSS" placeholder="CNSS" ref={newCNSSInput} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[7]?"border-red-500":"")}/>
                                        {NError[7] && <p className="text-sm text-red-500 mt-1">{NError[7]}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="newAdresse" className="block text-blue-700 font-semibold mb-2">Adresse</label>
                                        <input type="text" id="newAdresse" placeholder="Adresse" ref={newAdresseInput}  className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[8]?"border-red-500":"")}/>
                                        {NError[8] && <p className="text-sm text-red-500 mt-1">{NError[8]}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="newRIB" className="block text-blue-700 font-semibold mb-2">RIB</label>
                                        <input type="number" id="newRIB" placeholder="RIB" ref={newRIBInput}  maxLength={24} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (NError[9]?"border-red-500":"")}/>
                                        {NError[9] && <p className="text-sm text-red-500 mt-1">{NError[9]}</p>}
                                    </div>
                                </div>
                                
                            </div>  
                            <div className="flex justify-center">
                                <button className="w-fit" onClick={()=>addFournisseur()}><SaveIcon/></button>
                            </div>
                                    
                        </div>  
                            : null
                        }
                        {
                            Update && !Ajout? 
                        <div className="flex flex-col bg-white p-6 rounded-lg shadow-md gap-3">
                            <div className="flex  gap-3 mt-3  ">
                                <div className="flex flex-col gap-3 ">
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="nom" className="block text-blue-700 font-semibold mb-2">Nom</label>
                                        <input type="text" id="nom" placeholder="Nom" ref={nomInput} defaultValue={fournisseur.nom} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[0]?"border-red-500":"")}
                                        />
                                        {Error[0] && <p className="text-sm text-red-500 mt-1">{Error[0]}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="qualite" className="block text-blue-700 font-semibold mb-2">Qualite</label>
                                        <input type="text" id="qualite" placeholder="Qualite" ref={qualiteInput} defaultValue={fournisseur.qualite} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[1]?"border-red-500":"")}/>
                                        {Error[1] && <p className="text-sm text-red-500 mt-1">{Error[1]}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="societe" className="block text-blue-700 font-semibold mb-2">Societe</label>
                                        <input type="text" id="societe" placeholder="Societe" ref={societeInput} defaultValue={fournisseur.nom_societe} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[2]?"border-red-500":"")}/>
                                        {Error[2] && <p className="text-sm text-red-500 mt-1">{Error[2]}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="Capital" className="block text-blue-700 font-semibold mb-2">Capital</label>
                                        <input type="number" id="Capital" placeholder="Capital" ref={capitalInput} defaultValue={fournisseur.capital} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[3]?"border-red-500":"")}/>
                                        {Error[3] && <p className="text-sm text-red-500 mt-1">{Error[3]}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="Patente" className="block text-blue-700 font-semibold mb-2">Patente</label>
                                        <input type="number" id="Patente" placeholder="Patente" ref={patenteInput} defaultValue={fournisseur.patente} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[4]?"border-red-500":"")}/>
                                        {Error[4] && <p className="text-sm text-red-500 mt-1">{Error[4]}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 ">
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="RcLieu" className="block text-blue-700 font-semibold mb-2">RC Lieu</label>
                                        <input type="text" id="RcLieu" placeholder="Lieu" ref={RCLieuInput} defaultValue={fournisseur.RC_lieu} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[5]?"border-red-500":"")}/>
                                        {Error[5] && <p className="text-sm text-red-500 mt-1">{Error[5]}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="RCNum" className="block text-blue-700 font-semibold mb-2">RC numero</label>
                                        <input type="number" id="RCNum" placeholder="Numero" ref={RCNumInput} defaultValue={fournisseur.RC_num} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[6]?"border-red-500":"")}/>
                                        {Error[6] && <p className="text-sm text-red-500 mt-1">{Error[6]}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="CNSS" className="block text-blue-700 font-semibold mb-2">CNSS</label>
                                        <input type="number" id="CNSS" placeholder="CNSS" ref={CNSSInput} defaultValue={fournisseur.CNSS} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[7]?"border-red-500":"")}/>
                                        {Error[7] && <p className="text-sm text-red-500 mt-1">{Error[7]}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="Adresse" className="block text-blue-700 font-semibold mb-2">Adresse</label>
                                        <input type="text" id="Adresse" placeholder="Adresse" ref={adresseInput} defaultValue={fournisseur.adresse} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[8]?"border-red-500":"")}/>
                                        {Error[8] && <p className="text-sm text-red-500 mt-1">{Error[8]}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="RIB" className="block text-blue-700 font-semibold mb-2">RIB</label>
                                        <input type="number" id="RIB" placeholder="RIB" ref={RIBInput} defaultValue={fournisseur.RIB} maxLength={24} className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[9]?"border-red-500":"")}/>
                                        {Error[9] && <p className="text-sm text-red-500 mt-1">{Error[9]}</p>}
                                    </div>
                                </div>        
                            </div>
                            <div className="flex justify-center">
                                <button className="w-fit" onClick={()=>updateFournisseur(fournisseur._id)}><SaveIcon/></button>
                            </div>
                        </div>
                            : null
                        }
                    </div>
                :null}
                {isModalOpen && <WarningModal onConfirm={handleDelete} onCancel={handleCancel} message={"Deleting a fournisseur will delete all marches and articles related"} />}
            </div>   
        </div>
    )
}