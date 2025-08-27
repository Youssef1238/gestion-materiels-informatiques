import { useNavigate } from "react-router-dom"

export default function SearchModal({data ,Entity}) {
    const Navigate = useNavigate()
    const Load = (id)=>{
        if(Entity == "Marché")
            Navigate('/Marché', { state: { marchéId: id } });
        else
            Navigate('/EntitéAdmin', { state: { entitéAdminId: id } });
    }
    const hoverClasses = {
        "Marché": "hover:bg-indigo-200  hover:border-indigo-500",
        "Entité Admin.": "hover:bg-green-200  hover:border-green-500"
    }


   return (
    <div  className="absolute rounded-md top-full left-0 z-30  w-full flex flex-col justify-center items-center bg-white shadow-md bg-opacity-50">
        {
            data && data.length !== 0 ?
                data.map((e,i)=>{
                    return <div key={i} onMouseDown={()=>Load(e.id)}
                    className={"w-full p-4 flex items-center justify-start bg-gray-100 cursor-pointer rounded-md rounded-b-none border-b-2 border-gray-500 " + hoverClasses[Entity]}>
                        <span className="text-lg font-Montserrat font-light">
                            {Entity == "Marché"? "Marché - " :""} {e.label}
                        </span>
                    </div>
                })
            :
            <div className="w-full p-4 flex items-center justify-center bg-gray-100 cursor-default">
                    Aucun Resultat ...
            </div>
        }
    </div> 
   )
            
}

