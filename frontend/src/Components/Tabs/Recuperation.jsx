import api from "@/utils/Api";
import { BoxIcon, Check, Plus, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination";


export default function Recuperations({onDone,EntitéAdminId,isModalOpen,ResetResetBag}) {
    const [Articles,setArticles] = useState([])
    const [Bag,setBag] = useState([])
    const [Page, setPage] = useState(1);
    const Navigate = useNavigate()

    useEffect(()=>{
        const fetchData = async ()=>{
            try {
                const resA = await api.get(`articleLivre/entite/${EntitéAdminId}`)
                setArticles(resA.data)
            } catch (err) {
                if (err.response) {
                    console.error("custom error",err)
                } else {
                    Navigate('/error')
                }
            }
        }
        fetchData()
    },[isModalOpen])
    useEffect(()=>{
        if(ResetResetBag)
            setBag([])
    },[ResetResetBag])

    const PageData = (n)=>{
        return Articles.slice(Page==1?0:Page*n -n , Math.min((Page==1?0:Page*n -n )+ n,Articles.length))
    }
    const Recuperer = (article,type)=>{
        if(type)
            setBag(v => [...v, article])
        else
            setBag(v => v.filter(item => item !== article))
    }
    const onTerminer = ()=>{
        if(Bag.length !=0){
            onDone(Bag)
        }
        
    }
   
    return (
        <div className="w-full flex flex-col gap-4 py-6 min-h-screen">
            <div  className="w-full flex items-center justify-end gap-4 px-10 py-4">
                    <div className="relative flex justify-center items-center p-2 cursor-pointer">
                        <ShoppingBag size={28} color="orange" />
                        <div className="absolute -top-1 -right-1 rounded-full px-2 py-0.5 flex justify-center items-center bg-red-500">
                            <span className="text-white text-xs font-bold">{Bag.length}</span>
                        </div>
                    </div>
                    
                    <button type="reset" onClick={()=>onTerminer()} className="px-8 py-2 shadow-sm bg-teal-600 text-white  rounded-md hover:shadow-md hover:shadow-teal-300 transition-shadow flex justify-center items-center gap-2">
                        <span className="rounded-sm bg-gray-100 flex justify-center items-center p-1"><Check color="#2dd4bf"  size={12}/></span>
                        Terminer
                    </button>
            </div>
            <div className="w-full py-6 bg-gray-100 px-4 border-t-2 border-gray-200 shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="bg-cyan-500">
                            <th className="px-4 py-2 text-left text-sm"></th>
                            <th className="px-4 py-2 text-left text-sm">Marché</th>
                            <th className="px-4 py-2 text-left text-sm">Numero</th>
                            <th className="px-4 py-2 text-left text-sm">Type</th>
                            <th className="px-4 py-2 text-left text-sm">Marque</th>
                            <th className="px-4 py-2 text-left text-sm">Numero de serie</th>
                            <th className="px-4 py-2 text-left text-sm">CAB</th>
                            <th className="px-4 py-2 text-left text-sm">prix unitaire</th>
                            <th className="px-4 py-2 text-left text-sm">Action</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {
                            PageData(12)?.map((e, index) => (
                                <tr key={index} className="relative hover:bg-cyan-100 transition-colors odd:bg-white even:bg-gray-50 shadow-md rounded-md my-2">
                                    <td className="p-4"><BoxIcon size={24} color="#06b6d4"/></td>
                                    <td className="p-4 text-xs">Marché - {e.paraInfo.marche} N° {e.numAR}</td>
                                    <td className="p-4 text-xs">{e.Numero}</td>
                                    <td className="p-4 text-xs">{e.type}</td>
                                    <td className="p-4 text-xs">{e.marque}</td>
                                    <td className="p-4 text-xs">{e.Numero_Serie}</td>
                                    <td className="p-4 text-xs">{e.cab}</td>
                                    <td className="p-4 text-xs">{e.prix_unitaire}</td>
                                    <td className="p-4 text-xs">{!Bag.some(item => item._id === e._id)?
                                        <button onClick={()=>Recuperer(e,true)} className="px-8 py-2 shadow-sm bg-teal-500 text-white  rounded-md hover:shadow-md hover:shadow-teal-300 transition-shadow flex justify-center items-center gap-2">
                                            <span className="rounded-sm bg-gray-100 flex justify-center items-center p-1"><Plus color="#2dd4bf"  size={12}/></span>
                                            Récuperer
                                        </button>
                                        :
                                        <button onClick={()=>Recuperer(e,false)} className="px-8 py-2 shadow-sm text-black border border-gray-400  rounded-md hover:shadow-md hover:shadow-gray-500 transition-shadow flex justify-center items-center gap-2">
                                            <span className="rounded-sm flex justify-center items-center p-1"><X color="#6b7280"  size={12}/></span>
                                            Annuler
                                        </button>
                                        
                                    }
                                    </td>
                                </tr>
                            ))
                        }
                        
                        
                    </tbody>
                </table>
                <Pagination page={Page} pages={Math.ceil(Articles.length / 12)} setPage={setPage}/> 
            </div>
        </div>
    )
}