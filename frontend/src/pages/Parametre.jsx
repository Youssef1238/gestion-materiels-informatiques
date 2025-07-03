import { useEffect, useState } from "react"
import Fournisseur from "../Components/Fournisseur"
import EntiteAdmin from "../Components/EntiteAdmin"
import Type from "../Components/Type"
import NavBar from "../Components/NavBar"
import Accounts from "../Components/Accounts"
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"
import Templates from "../Components/Templates"


export default function Parametere() {
    document.title = "Parametrage"
    const Navigate = useNavigate()
    const admin = Cookies.get('admin') == "true"
    const [option,setOption] = useState(0)
    const element = [<Fournisseur/>,<EntiteAdmin/>,<Type/>,<Accounts/>,<Templates/>]
useEffect(()=>{
    const auth = Cookies.get('id')
    if(!auth) Navigate('/login')
},[])



    return(
        <>
        <NavBar/>
        <div className="flex mt-0 pt-0 w-full min-h-screen">
            <div className="flex flex-col min-h-full w-fit flex-none  border-r-2 border-r-[#1A202C]">
                <button onClick={()=>setOption(0)} className={"font-Montserrat w-full  border-gray-100  border border-t-0 rounded-none " + (option == 0?"border-x-[#1A202C] border-x-2 bg-[#1A202C] text-white": "bg-white text-black")}>Fournisseurs</button>
                <button onClick={()=>setOption(1)} className={"font-Montserrat w-full  border-gray-100  border rounded-none " + (option == 1?"border-x-[#1A202C] border-x-2 bg-[#1A202C] text-white": "bg-white text-black")}>Entite Administrative</button>
                <button onClick={()=>setOption(2)} className={"font-Montserrat w-full  border-gray-100  border rounded-none " + (option == 2?"border-x-[#1A202C] border-x-2 bg-[#1A202C] text-white": "bg-white text-black")}>Type</button>
                {admin?<button onClick={()=>setOption(3)} className={"font-Montserrat w-full  border-gray-100  border rounded-none " + (option == 3?"border-x-[#1A202C] border-x-2 bg-[#1A202C] text-white": "bg-white text-black")}>Accounts</button>:null}
                <button onClick={()=>setOption(4)} className={"font-Montserrat w-full  border-gray-100  border rounded-none " + (option == 4?"border-x-[#1A202C] border-x-2 bg-[#1A202C] text-white": "bg-white text-black")}>Templates</button>            
            </div>
            {
                option >= 0 ?  element[option]: null
            }

        </div>
        </>
    )
}