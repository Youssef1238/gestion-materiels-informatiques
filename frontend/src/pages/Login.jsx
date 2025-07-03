import axios from "axios"
import { useRef, useState } from "react"
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom"

export default function Login() {
    document.title = "Login"
    const Navigate = useNavigate() 
    const pseudo = useRef()
    const pass = useRef()
    // Pseudo , Pass 
    const [Error,setError] = useState(["",""])
    

    async function handelLogin() {
        const errorPseudo = pseudo.current.value.trim() == ""?"Required":""
        const errorPass = pass.current.value.trim() == ""?"Required":""
        

        setError([errorPseudo,errorPass])
        if(errorPseudo == "" && errorPass  == ""){
            try {
                const res = await axios.post("http://localhost:5500/user/login",{
                    "pseudo" : pseudo.current.value,
                    "password" : pass.current.value
                })
                if(res.data == "pseudo")
                    setError(["Incorrect Pseudo",""])
                else if (res.data == "pass")
                    setError(["","Incorrect Password"])
                else{
                    Cookies.set('id',res.data._id, { sameSite: 'None', secure: true })
                    Cookies.set('admin',res.data.admin, { sameSite: 'None', secure: true })
                    Navigate('/')
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
        }
        
    }

   

    return(
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <div className="flex flex-col gap-4 items-center bg-white p-16 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-black text-center mb-6">Login to Your Account</h2>
                <div>
                    <label htmlFor="pseudo" className="block text-blue-700 font-semibold mb-2">Pseudo</label>
                    <input type="text"id="pseudo"
                    className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[0]?"border-red-500":"")}
                    placeholder="Enter your pseudo"
                    ref={pseudo}
                    required
                    />
                    {Error[0] && <p className="text-sm text-red-500 mt-1">{Error[0]}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="block text-blue-700 font-semibold mb-2">Password</label>
                    <input type="password" id="password"
                    className={"input-base w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 " + (Error[1]?"border-red-500":"")}
                    placeholder="Enter your password"
                    ref={pass}
                    required
                    />
                    {Error[1] && <p className="text-sm text-red-500 mt-1">{Error[1]}</p>}
                </div>
                <button onClick={()=>handelLogin()} className="w-fit p-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Login
                </button>
            </div>
        </div>

    )
}