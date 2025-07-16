import { Link, useNavigate } from "react-router-dom"
import  {useAuth}  from "../auth/authContext"
import {House , Settings2} from 'lucide-react'

export default function NavBar() {

    const { logout , AccessToken } = useAuth();
    const logged = AccessToken != null
    const Navigate = useNavigate()
    const Logout = async () => {
        await logout();
        Navigate('/login');
    }



    return(
        <nav className="sticky top-0 bg-gray-100 w-full py-5 px-12 flex justify-between items-center border border-b-gray-400 border-b-2" id="nav">
            <Link to={'/'} className="p-2">
                <House size={48}/>
            </Link>
            <div className="flex items-center justify-center grow gap-2">
                <input type="text" name="query" id="query" 
                className="text-black rounded-full w-2/3 border-2 border-primary bg-white px-4 py-2"
                placeholder="Entrer la réference de marché"
                />
                <select name="type" id="type" className="border-primary border-2 rounded-full px-4 py-2 font-Montserrat">
                    <option className="border-primary hover:text-white hover:bg-primary bg-white text-black  px-4 py-2 font-Montserrat rounded-full" value="Marché">Marché</option>
                    <option className="border-primary bg-white text-black px-4 py-2 font-Montserrat" value="Article">Article</option>
                </select>
                
            </div>
            <Settings2 size={48}/>
        </nav>
            
    )
}