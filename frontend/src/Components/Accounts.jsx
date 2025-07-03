import axios from "axios";
import { useEffect, useRef, useState  } from "react";
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import {EditIcon,DeleteIcon,CloseIcon,AddIcon,SaveIcon,UpdateIcon} from '../assets/Icons';


export default function Accounts() {

    const [editSubject,setEditSubject] = useState(null)
    const [changed,setChanged] = useState(false)
    const [Ajout,setAjout] = useState(false)
    const [data,setData] = useState([])
    const pseudoInput = useRef(null)
    const passInput = useRef(null)
    const AdminInput = useRef(null)
    const Admin = useRef(null)
    const [pseduoError,setPseudoError] = useState()
    const [passError,setPassError] = useState()
    const Navigate = useNavigate()
    const auth = Cookies.get('id')
    useEffect(()=>{
        const fetch = async ()=>{
            try {
                
                const response = await axios.get(`http://localhost:5500/user/${auth}`,{
                    headers : {
                      'authorization' : auth
                  }
                })
                setData(response.data)
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
        fetch()
    },[changed])

    const updateUser = async (id)=>{
        try {
            const response = await axios.put(`http://localhost:5500/user`,{
                id : id,
                admin : Admin.current.value
            },{
                headers : {
                  'authorization' : auth
              }
            })
            setChanged(c=>!c)
        } catch (error) {
            if (error.response) {
                Navigate('/error',{state : {message : error.response.data ,code : error.response.status}})
            } else if (error.request) {
                Navigate('/error',{state : {message :'No response received: ' + error.request}})
            } else {
                Navigate('/error',{state : {message :'Error setting up the request: ' + error.message}})
            }
        }finally{
            setEditSubject(null)
        }
    }
    const deleteUser = async (id)=>{
        try {
            const response = await axios.delete(`http://localhost:5500/user`,{
                data : {id : id},
                headers : {
                    'authorization' : auth
                }
            },)
            
            setChanged(c=>!c)
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
    const addUser = async ()=>{
        const regex1 = /^[a-zA-Z0-9]+$/;

        const accessPseudo = pseudoInput.current.value.trim() != "" && regex1.test(pseudoInput.current.value)
        const accessPass = passInput.current.value.trim() != ""

        setPseudoError(pseudoInput.current.value.trim() == ""?"Required":regex1.test(pseudoInput.current.value)?"":"only Alphanumerics allowed")
        setPassError(passInput.current.value.trim() == ""?"Required":"")

        if(accessPseudo && accessPass){
            try {
                const response = await axios.post(`http://localhost:5500/user`,{
                    pseudo : pseudoInput.current.value,
                    password : passInput.current.value,
                    admin : AdminInput.current.value,
                },{
                    headers : {
                      'authorization' : auth
                  }
                })
                setAjout(false)
                setChanged(c=>!c)
                
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 409) {
                        setPseudoError(error.response.data)
                    } else {
                        console.error('Other error:', error.response.status);
                    }
                  } else if (error.request) {
                    Navigate('/error',{state : {message :'No response received: ' + error.request}})
                  } else {
                    Navigate('/error',{state : {message :'Error setting up the request: ' + error.message}})
                  }
                
            }
        }
        
        
    }



    return(
        
        <div className="h-screen mt-3 ml-3 w-full px-10">
            <h1 className="font-bold text-blue-500 mb-2 text-center">Accounts</h1>
            <button className="my-3 bg-gray-100 " onClick={()=>setAjout(!Ajout)}><AddIcon/></button>
            <table className="mt-4 table-auto border-collapse border border-gray-300 w-full shadow-md">
                <thead>
                    <tr className="bg-blue-500 text-white">
                        <th className="border border-gray-300 px-6 py-3">Pseudo</th>
                        <th className="border border-gray-300 px-6 py-3">Password</th>
                        <th className="border border-gray-300 px-6 py-3">Role</th>
                        <th className="border border-gray-300 px-6 py-3"></th>
                        <th className="border border-gray-300 px-6 py-3"></th>
                    </tr>
                </thead>
                <tbody>
                {data.map((e,i)=>{
                    return <tr key={i} className="odd:bg-gray-100 even:bg-gray-50 hover:bg-blue-100 text-sm">
                    <td className="border border-gray-300 px-6 py-3">{e.pseudo}</td>
                    <td className="border border-gray-300 px-6 py-3">{e.password}</td>
                    <td className="border border-gray-300 px-6 py-3">{editSubject != e._id?e.admin?"Admin":"Editeur":
                            <select ref={Admin} defaultValue={e.admin}>
                                <option value={true}>Admin</option>
                                <option value={false}>Editeur</option>
                            </select>
                        }</td>
                    <td className="border border-gray-300 px-6 py-3"><button  onClick={editSubject != e._id?()=>setEditSubject(e._id):()=>updateUser(e._id)}>{editSubject == e._id?<UpdateIcon/>:<EditIcon/>}</button></td>
                    <td className="border border-gray-300 px-6 py-3"><button  onClick={editSubject != e._id?()=>deleteUser(e._id):()=>setEditSubject(null)}>{editSubject == e._id?<CloseIcon/>:<DeleteIcon/>}</button></td>
                </tr>
                })}
                {
                    Ajout?
                    <tr className="odd:bg-gray-100 even:bg-gray-50 hover:bg-blue-100 text-sm">
                        <td className="border border-gray-300 px-6 py-3"><input type="text" ref={pseudoInput} className={"input-base " +  (pseduoError?"border-red-500":"")}></input>
                        {pseduoError &&  <p className="text-sm text-red-500 mt-1">{pseduoError}</p>}
                        </td>
                        <td className="border border-gray-300 px-6 py-3"><input type="text" ref={passInput} className={"input-base " +  (passError?"border-red-500":"")}></input>
                        {passError &&  <p className="text-sm text-red-500 mt-1">{passError}</p>}
                        </td>
                        <td className="border border-gray-300 px-6 py-3">
                            <select ref={AdminInput}>
                                    <option value={true}>Admin</option>
                                    <option value={false}>Editeur</option>
                            </select>
                        </td>
                        <td className="border border-gray-300 px-6 py-3"><button  onClick={()=>addUser()}><SaveIcon/></button></td>
                        <td className="border border-gray-300 px-6 py-3"><button  onClick={()=>{setAjout(false);setPassError("");setPseudoError("")}}><CloseIcon/></button></td>
                    </tr>
                    : null
                }
                </tbody>
            </table>
            
        </div>
        
    )
}