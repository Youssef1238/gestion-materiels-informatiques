import { Link, useNavigate } from "react-router-dom"
import  {useAuth}  from "../auth/authContext"
import {House , LayoutDashboard , LogOut,SearchIcon} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

export default function NavBar() {
    const [Entity, setEntity] = useState("Marché");
    const { logout , AccessToken } = useAuth();
    const logged = AccessToken != null
    const placeholder = {
        "Marché": "Entrer la référence de marché",
        "Entité Admin.": "Entrer le nom de l'entité"
    }
    const Location = window.location.pathname;
    const Navigate = useNavigate()
    const Logout = async () => {
        await logout();
        Navigate('/login');
    }



    return(
        <nav className="sticky top-0 z-50 bg-gray-100 w-full py-5 px-12 flex justify-between items-center border border-b-gray-300 border-b-2" id="nav">
            <div className="w-1/3  relative">
                    <input type="text" name="query" id="query" 
                    className="text-black rounded-full w-full outline-dark border-2 border-primary bg-white px-12 py-3"
                    placeholder={Entity ? placeholder[Entity] : "Rechercher..."}
                    />
                    <SearchIcon className="absolute top-3 left-4 text-gray-500"/>
                    <div className="rounded-full h-full w-fit absolute top-0 right-0">
                        <Select value={Entity} onValueChange={(value) => setEntity(value)}>
                            <SelectTrigger className="w-fit text-xl rounded-full h-full border-0 shadow-none">
                                <SelectValue placeholder="Entité" />
                            </SelectTrigger>
                            <SelectContent className="w-[180px] p-0 m-0" >
                                <SelectItem  className="hover:bg-primary cursor-pointer hover:text-white text-xl p-4" value="Marché" >Marché</SelectItem>
                                <SelectItem className="hover:bg-primary cursor-pointer hover:text-white text-xl p-4" value="Entité Admin.">Entité Admin.</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
            </div>

            <div className="flex items-center gap-12  justify-between">
                <Link to={'/'}  className={"nav-link " + (Location == '/'? "text-teal-600 font-semibold border-b-2 border-teal-600 " : " text-gray-600")}>
                    <House size={48} />
                </Link>
                <Link to={'/Gerer'}  className={"nav-link " + (Location == '/Gerer'? "text-teal-600 font-semibold border-b-2 border-teal-600 " : " text-gray-600")}>
                    <LayoutDashboard size={48} />
                </Link>
                <Link onClick={()=>Logout()}  className={"nav-link text-gray-600"}>
                    <LogOut size={48}/>
                </Link>
 
            </div>
            
        </nav>
            
    )
}