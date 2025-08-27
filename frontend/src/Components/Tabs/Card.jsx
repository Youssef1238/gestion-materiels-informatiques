import api from "@/utils/Api";
import { ArrowRight, BoxIcon, FormInput, Handshake, StoreIcon, Trash2 } from "lucide-react"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Card({ entity, data, setChanged, onDetail }) {
    switch (entity) {
        case "Marché":
            return <MarchéCard data={data}  />;
        case "Fournisseur":
            return <FournisseurCard data={data} setChanged={setChanged} onDetail={onDetail}/>;
        case "Article":
            return <ArticleCard data={data} />;
        default:
            return <div className="text-center text-gray-500">No cards available for this entity.</div>;
    
    }


}

const MarchéCard = ({ data }) => {
    const Navigate = useNavigate()
    const onDetail = () => {
        Navigate('/Marché', { state: { marchéId: data._id } });
    }
    return (
        <div className={"py-4 px-6 rounded-md shadow-md flex flex-col items-center gap-6  bg-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105"}>
            <div className="w-full px-2 flex items-center justify-between">
                <h3 className="text-xl font-bold font-Montserrat">Marché {data.reference}</h3>
                <StoreIcon size={24} color="#818cf8" />
            </div>
            <div className={"p-6 rounded-md shadow-sm flex flex-col justify-start items-start gap-4  border-2 border-indigo-300"}> 
                    <div className="flex  items-center gap-2 justify-start">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Type: </span>
                        <span className="text-black text-sm font-semibold font-poppins">{data.type}</span> 
                    </div>
                    <div className="flex  items-center gap-2">
                        <span className="text-gray-600 text-sm font-medium font-Montserrat">Fournisseur: </span>
                        <span className="text-black text-sm font-semibold font-poppins">{data.fournisseur.nom}</span> 
                    </div>
                    <div className="flex  items-center gap-2">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Objet: </span>
                        <span className="text-black text-sm font-semibold font-poppins">{data.objet}</span> 
                    </div>
                    <div className="flex  items-center gap-2">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Date: </span>
                        <span className="text-black text-sm font-semibold font-poppins">{data.date_creation.split('T')[0]}</span> 
                    </div>
                    
                
            </div>
            <div className="w-full py-4 flex items-center justify-center gap-2">
                <button onClick={()=>onDetail()} className="px-6 py-2 shadow-sm border border-indigo-300 flex items-center justify-center gap-2  rounded-md hover:shadow-md transition-shadow">Consulter <ArrowRight/></button>
            </div> 
        </div>
    )
}

const FournisseurCard = ({ data, onDetail, setChanged }) => {
    const Navigate = useNavigate()
    const [isDelete , setIsDelete] = useState(false)
    const sliceAdresse = (add) =>{
        return add.split(" ").slice(0,2).join(' ')
    }
    const deleteFournisseur = async (id)=>{
        try {
            await api.delete('fournisseur',{
                    data : {id : id}
            })
            setChanged(c=>!c)
        } catch (error) {
            Navigate('/error')
        }
    }
    return (
        <div className={"relative py-4 px-6 rounded-md shadow-md flex flex-col items-center gap-6  bg-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105"}>
            <div className="w-full px-2 flex items-center justify-between">
                <h3 className="text-xl font-bold font-Montserrat">{data.nom}</h3>
                <Handshake size={24} color="#f59e0b" />
            </div>
            <div className={"p-6 rounded-md shadow-sm flex flex-col justify-start items-start gap-4  border-2 border-amber-500"}> 
                    <div className="flex  items-center gap-2">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Qualité: </span>
                        <span className="text-black text-sm font-semibold font-poppins">{data.qualite}</span> 
                    </div>
                    <div className="flex  items-center gap-2">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Sociéte: </span>
                        <span className="text-black text-sm font-semibold font-poppins">{data.nom_societe}</span> 
                    </div>
                    <div className="flex  items-center gap-2">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Patente: </span>
                        <span className="text-black text-sm font-semibold font-poppins">{data.patente}</span> 
                    </div>
                    <div className="flex  items-center gap-2 ">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Adresse: </span>
                        <span className="text-black text-sm font-semibold font-poppins">{sliceAdresse(data.adresse)}</span> 
                    </div>
                    
                
            </div>
            <div className="w-full py-4 flex items-center justify-center gap-2">
                <button onClick={()=>onDetail(data)} className="px-2 py-1 shadow-sm border border-amber-300  rounded-md hover:shadow-md transition-shadow"><FormInput color="#f59e0b"/></button>
                <button onClick={()=>setIsDelete(true)} className="px-2 py-1 shadow-sm border border-red-300 rounded-md hover:shadow-md transition-shadow"><Trash2 color="#f87171"/></button>
            </div>
            {
                isDelete?
                <div className="absolute bg-white left-0 right-0 top-0 bottom-0 flex flex-col justify-around items-center gap-2 p-2 z-10 shadow-lg rounded-md">
                    <h1 className="font-light bg-white text-sm text-gray-700 text-center">Toutes les données et relations liées à ce fournisseur seront également supprimées ! Êtes-vous sûr de vouloir continuer ?</h1>
                    <div className="flex gap-2 ">
                        <button onClick={()=>deleteFournisseur(data._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Confirmer</button>
                        <button onClick={()=>setIsDelete(false)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">Annuler</button>
                    </div>
                </div>
                :
                null
            }
        </div>
    )
}

const ArticleCard = ({ data  }) => {
    return (
        <div className={"py-4 px-6 rounded-md shadow-md flex flex-col items-center gap-6  bg-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105"}>
            <div className="w-full px-2 flex items-center justify-between">
                <h3 className="text-xl font-bold font-Montserrat">{data.Numero_Serie}</h3>
                <BoxIcon size={24} color="#06b6d4" />
            </div>
            <div className={"py-6 px-12 rounded-md shadow-sm flex flex-col justify-start items-start gap-4  border-2 border-cyan-500"}> 
                    <div className="flex  items-center gap-2 justify-start">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Marché: </span>
                        <span className="text-black text-sm font-semibold font-poppins">{data.marcheReference}</span> 
                    </div>
                    <div className="flex  items-center gap-2 justify-start">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Numero: </span>
                        <span className="text-black text-sm font-semibold font-poppins">{data.Numero}</span> 
                    </div>
                    <div className="flex  items-center gap-2">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Date: </span>
                        <span className="text-black text-sm font-semibold font-poppins">{data.date_Livraison.split('T')[0]}</span> 
                    </div>
                    <div className="flex  items-center gap-2">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">CAB: </span>
                        <span className="text-black text-sm font-semibold font-poppins">{data.cab}</span> 
                    </div>
                    <div className="flex  items-center gap-2">
                        <span className="text-gray-600 text-xs font-medium font-Montserrat">Affectée: </span>
                        <span className="text-black text-sm font-semibold font-poppins">{data.etat?"Oui":"Non"}</span> 
                    </div>
                    
                
            </div>
            
        </div>
    )
}



