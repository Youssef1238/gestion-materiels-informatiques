import { useState } from "react"
import NavBar from "../Components/NavBar"
import Marche from "../Components/Marche"
import ArticleMarche from "../Components/ArticleMarche"
import Affectation from "../Components/Affectation"
import Log from "../Components/Log"


export default function Edit() {
    document.title = "Gestion"
    const [marcheId,setMarcheId] = useState(null)
    const [option,setOption] = useState(0)
    const element = [<Marche setMarcheId={(id)=>setMarcheId(id)} setOption={(N)=>setOption(N)}/>,
                    <ArticleMarche marcheId={marcheId}/>,
                    <Affectation/>,<Log/>]

    const handelSwitch = (N)=>{
        setOption(N)
        if(N != 1) setMarcheId(null)
    }




    return(
        <>
        <NavBar/>
        <div className="flex mt-0 pt-0 w-full min-h-screen">
            <div className="flex flex-col  min-h-full w-fit flex-none  border-r-2 border-r-[#1A202C]">
                <button onClick={()=>handelSwitch(0)} className={"font-Montserrat w-full px-2 border-gray-100 border border-t-0 rounded-none " + (option == 0?"border-x-[#1A202C] border-x-2 bg-[#1A202C] text-white": "bg-white text-black")}>Marche</button>
                <button onClick={()=>handelSwitch(1)} className={"font-Montserrat w-full px-2 border-gray-100 border rounded-none " + (option == 1?"border-x-[#1A202C] border-x-2 bg-[#1A202C] text-white": "bg-white text-black")}>Articles</button>
                <button onClick={()=>handelSwitch(2)} className={"font-Montserrat w-full px-2 border-gray-100 border rounded-none " + (option == 2?"border-x-[#1A202C] border-x-2 bg-[#1A202C] text-white": "bg-white text-black")}>Affectation</button>
                <button onClick={()=>handelSwitch(3)} className={"font-Montserrat w-full px-2 border-gray-100 border rounded-none " + (option == 3?"border-x-[#1A202C] border-x-2 bg-[#1A202C] text-white": "bg-white text-black")}>Log</button>
            </div>
            {
                option >= 0 ?  element[option]: null
            }

        </div>
        </>
    )
}