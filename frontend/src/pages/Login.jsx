import { useRef, useState } from "react"
import { useAuth } from "../auth/authContext"
import { useNavigate } from "react-router-dom"
import {CircleAlert, MonitorCog} from 'lucide-react'

import AdminInfoModal from "../Components/AdminInfoModal.jsx"

export default function Login() {
    document.title = "Login"
    const adminData = {
        email: "admin123@gmail.com",
        phone: "0588123456",
    }
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    const pseudo = useRef()
    const pass = useRef()
    const Navigate = useNavigate()
    // Pseudo , Pass 
    const [Error,setError] = useState(["",""])
    const { login } = useAuth();

    const Clear = (e) => {
        if(e.target.id == "pseudo")
            setError([ "", Error[1] ])
        else if(e.target.id == "password")
            setError([ Error[0], "" ])
    }

    async function handelLogin() {
        const errorPseudo = pseudo.current.value.trim() == ""?"Required":""
        const errorPass = pass.current.value.trim() == ""?"Required":""
        

        setError([errorPseudo,errorPass])
        if(errorPseudo == "" && errorPass  == ""){
                const res = await login(pseudo.current.value, pass.current.value);
                if(res.success) {
                    Navigate('/')
                }else{
                    if(res.error){
                        Navigate('/error',res.message)
                    }else{
                        setError(res.message)
                    }
                }
        }
        
    }

   

    return(
        <div className="min-h-screen flex  justify-stretch  bg-cover bg-center items-stretch">
            
            <div className="w-[50%] min-h-screen relative">
                <div className="bg-primary w-full h-full diagonal-cut py-8 px-6 inset-1">
                  
                    <h1 className="flex items-center gap-2 text-4xl text-white font-Montserrat mt-14 mb-8">
                          <MonitorCog size={64}/>
                        Gestion des Matériels Informatiques</h1>
                    <p className="text-2xl text-primary font-Roboto font-light">
                        Plateforme de gestion du matériel informatique du  <b>Conseil Provincial d&apos;Errachidia</b>.
                    </p>
                    <div className="w-[50%] h-[50%] bg-intro bg-cover bg-center m-auto mt-8"></div>
                    
                </div>
                <p className="absolute right-4 bottom-8 text-light text-xl font-Montserrat text-primary">
                        © 2025 - All rights reserved
                </p>
            </div>
            {isOpen && <AdminInfoModal isOpen={isOpen} onClose={closeModal} adminData={adminData} />}
            <div className="flex flex-col  items-center px-6 bg-white  grow border-l-2 border-[#7fd0c7]">
                <div className="text-center my-20">
                    <h2 className="text-6xl font-Roboto font-light text-gray-700">Bienvenue</h2>
                    <p className="text-xl font-Montserrat text-primary font-light mt-6 text-wrap w-[80%] m-auto">
                        Si vous avez oublié vos coordonnées ou si vous ne possédez pas de compte, veuillez contacter
                        <span className="font-medium text-secondary hover:text-primary cursor-pointer" onClick={openModal}> l&apos;administrateur</span>.
                    </p>
                </div>
                
                <div className="w-[50%] flex flex-col gap-4 mt-20" onKeyDown={(e)=> {if(e.key == "Enter") handelLogin()}}>
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="pseudo" className="block text-primary font-semibold font-Montserrat mb-2">Pseudo</label>
                        <input type="text"id="pseudo"
                        className={"input-base w-full px-4 py-2 border  rounded-md shadow-sm focus:ring-secondary focus:border-secondary outline-none " + (Error[0]?"border-red-500":"border-primary")}
                        placeholder="Enter your pseudo"
                        ref={pseudo}
                        onChange={Clear}
                        required
                        />
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1 h-6">{Error[0] ? <CircleAlert />: null }{Error[0] ?? " " }</p>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="password" className="block text-primary font-semibold font-Montserrat mb-2">Password</label>
                        <input type="password" id="password"
                        className={"input-base w-full px-4 py-2 border rounded-md shadow-sm focus:ring-secondary focus:border-secondary outline-none " + (Error[1]?"border-red-500":"border-primary")}
                        placeholder="Enter your password"
                        ref={pass}
                        onChange={Clear}
                        required
                        />
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1 h-6">{Error[1] ? <CircleAlert /> : null }{Error[1] ?? " " }</p>
                    </div>
                    <button onClick={()=>handelLogin()} className="w-full bg-primary hover:bg-secondary mt-6 text-white text-xl focus:ring-2 focus:ring-secondary focus:ring-offset-2">
                    Login
                    </button>
                </div>
                
                
            </div>
        </div>

    )
}