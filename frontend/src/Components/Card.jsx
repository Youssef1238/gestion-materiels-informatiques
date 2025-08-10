import { BoxIcon, Edit2, Eye, FormInput, FormInputIcon, Handshake, StoreIcon, Trash2 } from "lucide-react"

export default function Card({ entity, data, onEdit, onDelete , onDetail }) {
    switch (entity) {
        case "Marché":
            return <MarchéCard data={data} onEdit={onEdit} onDelete={onDelete} onDetail={onDetail} />;
        case "Fournisseur":
            return <FournisseurCard data={data} onEdit={onEdit} onDelete={onDelete} onDetail={onDetail}/>;
        case "Article":
            return <ArticleCard data={data} onEdit={onEdit} onDelete={onDelete} onDetail={onDetail}/>;
        default:
            return <div className="text-center text-gray-500">No cards available for this entity.</div>;
    
    }


}

const MarchéCard = ({ data , onDelete , onDetail }) => {
    return (
        <div className={"py-4 px-6 rounded-md shadow-md flex flex-col items-center gap-6  bg-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105"}>
            <div className="w-full px-2 flex items-center justify-between">
                <h3 className="text-xl font-bold font-Montserrat">Marché 12/2025</h3>
                <StoreIcon size={24} color="#818cf8" />
            </div>
            <div className={"p-6 rounded-md shadow-sm flex flex-col justify-start items-start gap-4  border-2 border-indigo-300"}> 
                    <div className="flex  items-center gap-2 justify-start">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Type: </span>
                        <span className="text-black text-sm font-semibold font-poppins">Something</span> 
                    </div>
                    <div className="flex  items-center gap-2">
                        <span className="text-gray-600 text-sm font-medium font-Montserrat">Fournisseur: </span>
                        <span className="text-black text-sm font-semibold font-poppins">Ahmed Foughali</span> 
                    </div>
                    <div className="flex  items-center gap-2">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Objet: </span>
                        <span className="text-black text-sm font-semibold font-poppins">Fourniture</span> 
                    </div>
                    <div className="flex  items-center gap-2">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Date: </span>
                        <span className="text-black text-sm font-semibold font-poppins">1/12/2025</span> 
                    </div>
                    
                
            </div>
            <div className="w-full py-4 flex items-center justify-center gap-2">
                <button onClick={onDetail} className="px-2 py-1 shadow-sm border border-indigo-300  rounded-md hover:shadow-md transition-shadow"><FormInput color="#a5b4fc"/></button>
                <button onClick={onDelete} className="px-2 py-1 shadow-sm border border-red-300 rounded-md hover:shadow-md transition-shadow"><Trash2 color="#f87171"/></button>
                
            </div>
        </div>
    )
}

const FournisseurCard = ({ data , onDelete  , onDetail }) => {
    return (
        <div className={"py-4 px-6 rounded-md shadow-md flex flex-col items-center gap-6  bg-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105"}>
            <div className="w-full px-2 flex items-center justify-between">
                <h3 className="text-xl font-bold font-Montserrat">Ahmed Ghalaf</h3>
                <Handshake size={24} color="#f59e0b" />
            </div>
            <div className={"p-6 rounded-md shadow-sm flex flex-col justify-start items-start gap-4  border-2 border-amber-500"}> 
                    <div className="flex  items-center gap-2 justify-start">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Qualité: </span>
                        <span className="text-black text-sm font-semibold font-poppins">Something</span> 
                    </div>
                    <div className="flex  items-center gap-2">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Sociéte: </span>
                        <span className="text-black text-sm font-semibold font-poppins">Ahmed Foughali</span> 
                    </div>
                    <div className="flex  items-center gap-2">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Patente: </span>
                        <span className="text-black text-sm font-semibold font-poppins">Fourniture</span> 
                    </div>
                    <div className="flex  items-center gap-2">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Adresse: </span>
                        <span className="text-black text-sm font-semibold font-poppins">1/12/2025</span> 
                    </div>
                    
                
            </div>
            <div className="w-full py-4 flex items-center justify-center gap-2">
                <button onClick={onDetail} className="px-2 py-1 shadow-sm border border-amber-300  rounded-md hover:shadow-md transition-shadow"><FormInput color="#f59e0b"/></button>
                <button onClick={onDelete} className="px-2 py-1 shadow-sm border border-red-300 rounded-md hover:shadow-md transition-shadow"><Trash2 color="#f87171"/></button>
                
            </div>
        </div>
    )
}

const ArticleCard = ({ data , onDelete , onDetail }) => {
    return (
        <div className={"py-4 px-6 rounded-md shadow-md flex flex-col items-center gap-6  bg-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105"}>
            <div className="w-full px-2 flex items-center justify-between">
                <h3 className="text-xl font-bold font-Montserrat">DJGJHJ457OO</h3>
                <BoxIcon size={24} color="#06b6d4" />
            </div>
            <div className={"py-6 px-12 rounded-md shadow-sm flex flex-col justify-start items-start gap-4  border-2 border-cyan-500"}> 
                    <div className="flex  items-center gap-2 justify-start">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Marché: </span>
                        <span className="text-black text-sm font-semibold font-poppins">122/17</span> 
                    </div>
                    <div className="flex  items-center gap-2 justify-start">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Numero: </span>
                        <span className="text-black text-sm font-semibold font-poppins">1</span> 
                    </div>
                    <div className="flex  items-center gap-2">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Date: </span>
                        <span className="text-black text-sm font-semibold font-poppins">1/12/2025</span> 
                    </div>
                    <div className="flex  items-center gap-2">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">CAB: </span>
                        <span className="text-black text-sm font-semibold font-poppins">GVHGGHCHG</span> 
                    </div>
                    <div className="flex  items-center gap-2">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Affectée: </span>
                        <span className="text-black text-sm font-semibold font-poppins">Oui</span> 
                    </div>
                    
                
            </div>
            <div className="w-full py-4 flex items-center justify-center gap-2">
                <button onClick={onDetail} className="px-2 py-1 shadow-sm border border-cyan-400  rounded-md hover:shadow-md transition-shadow"><FormInput color="#22d3ee"/></button>
                <button onClick={onDelete} className="px-2 py-1 shadow-sm border border-red-300 rounded-md hover:shadow-md transition-shadow"><Trash2 color="#f87171"/></button>
                
            </div>
        </div>
    )
}



