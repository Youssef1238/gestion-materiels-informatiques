import {useState } from "react"
import Fournisseur from "../Components/old/Fournisseur"
import EntiteAdmin from "../Components/old/EntiteAdmin"
import Type from "../Components/old/Type"
import NavBar from "../Components/NavBar"
import Accounts from "../Components/old/Accounts"
import Templates from "../Components/old/Templates"
import {jwtDecode} from 'jwt-decode';
import { useAuth } from "../auth/authContext"


export default function Parametere() {
    document.title = "Parametrage"
    const { AccessToken } = useAuth();
    const decoded = jwtDecode(AccessToken);
    const isAdmin = decoded.isAdmin;
    const [option,setOption] = useState(0)
    // eslint-disable-next-line react/jsx-key
    const element = [<Fournisseur/>,<EntiteAdmin/>,<Type/>,<Accounts/>,<Templates/>]




    return(
        <>
        <NavBar/>
        <div className="flex mt-0 pt-0 w-full min-h-screen">
            <div className="flex flex-col min-h-full w-fit flex-none  border-r-2 border-r-[#1A202C]">
                <button onClick={()=>setOption(0)} className={"font-Montserrat w-full  border-gray-100  border border-t-0 rounded-none " + (option == 0?"border-x-[#1A202C] border-x-2 bg-[#1A202C] text-white": "bg-white text-black")}>Fournisseurs</button>
                <button onClick={()=>setOption(1)} className={"font-Montserrat w-full  border-gray-100  border rounded-none " + (option == 1?"border-x-[#1A202C] border-x-2 bg-[#1A202C] text-white": "bg-white text-black")}>Entite Administrative</button>
                <button onClick={()=>setOption(2)} className={"font-Montserrat w-full  border-gray-100  border rounded-none " + (option == 2?"border-x-[#1A202C] border-x-2 bg-[#1A202C] text-white": "bg-white text-black")}>Type</button>
                {isAdmin?<button onClick={()=>setOption(3)} className={"font-Montserrat w-full  border-gray-100  border rounded-none " + (option == 3?"border-x-[#1A202C] border-x-2 bg-[#1A202C] text-white": "bg-white text-black")}>Accounts</button>:null}
                <button onClick={()=>setOption(4)} className={"font-Montserrat w-full  border-gray-100  border rounded-none " + (option == 4?"border-x-[#1A202C] border-x-2 bg-[#1A202C] text-white": "bg-white text-black")}>Templates</button>            
            </div>
            {
                option >= 0 ?  element[option]: null
            }

        </div>
        </>
    )
}