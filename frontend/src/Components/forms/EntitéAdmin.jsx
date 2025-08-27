import api from "@/utils/Api";
import { CircleAlert} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLayout from "../layout/FormLayout";

export default function EntitéAdminForm({ type, onClose, data }) {

            switch(type) {
                case 'add':   
                    return <AddEntitéAdminForm onClose={onClose}/>;
                case 'detail':
                    return <DetailEntitéAdminForm onClose={onClose} EntiteAdmin={data}/>;
                default:
                    return null;
                
            }

}


const AddEntitéAdminForm = ({onClose}) => {
    // LibelleAR , LibelleFR 
    const [Error,setError] = useState(["",""])
    const Navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const regex1 = /[^A-Za-z\s]/;
        const regex2 = /^[\u0600-\u06FF\s]+$/;

        const errorLibelleFR = data["libelleFR"]?regex1.test(data["libelleFR"].trim())?"juste a-z A-Z sont accepté pour Libelle en Français":data["libelleFR"].trim() == ""?"Obligatoire":"":"Obligatoire"
        const errorLibelleAR = data["libelleAR"]?!regex2.test(data["libelleAR"].trim())?"juste les lettres arabes sont accepté pour Libelle en Arabe":data["libelleAR"].trim() == ""?"Obligatoire":"":"Obligatoire"
        const error = errorLibelleFR + errorLibelleAR

        


        setError([errorLibelleFR,errorLibelleAR])
        if(error == ""){
            try {
                await api.post('entiteAdmin',{
                    libelle_ar : data["libelleAR"].trim(),
                    libelle_fr : data["libelleFR"].trim(),
                })
                
                onClose();
            } catch (err) {
                if(err.response){ 
                    console.log(err.response.data)
                    const error =  err.response.data.split(" ").includes("Français") ? ["",err.response.data] : [err.response.data,""]
                    setError(error)
                }else{
                    console.log(err)
                    Navigate('/error')
                }
            }
           
        }
    }
            return (
                    <FormLayout onClose={onClose} onSubmit={handleSubmit} onReset={()=>setError([])}
                    Title={"Ajouter une Entité Administrative"}  Type={"add"} >
                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                                <div className="flex flex-col gap-3 flex-start w-full">
                                    <label htmlFor="libelleAR" className="text-sm font-medium font-Roboto ">libelle en Arabe</label>
                                    <input type="text" id="libelleAR" placeholder="libelle en Arabe" name="libelleAR" className={"input-base w-full px-4 py-2 text-xs " + (Error[0]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[0] ? <CircleAlert size={16}/>: null }{Error[0] ?? " " }</p>
                                </div>
                        </div>

                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3  w-full">
                                    <label htmlFor="libelleFR" className="text-sm font-medium font-Roboto">libelle en Français</label>
                                    <input type="text" id="libelleFR" placeholder="libelle en Français" name="libelleFR"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[1]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[1] ? <CircleAlert size={16}/>: null }{Error[1] ?? " " }</p>
                            </div> 
                            
                        </div>
                    </FormLayout>
               
            );
}
const DetailEntitéAdminForm = ({onClose , EntiteAdmin}) => {
    const [Error,setError] = useState(["",""])
    const [Locked,setLocked] = useState(false)
    const Navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const regex1 = /[^A-Za-z\s]/;
        const regex2 = /^[\u0600-\u06FF\s]+$/;

        const errorLibelleFR = data["libelleFR"]?regex1.test(data["libelleFR"].trim())?"juste a-z A-Z sont accepté pour Libelle en Français":data["libelleFR"].trim() == ""?"Obligatoire":"":"Obligatoire"
        const errorLibelleAR = data["libelleAR"]?!regex2.test(data["libelleAR"].trim())?"juste les lettres arabes sont accepté pour Libelle en Arabe":data["libelleAR"].trim() == ""?"Obligatoire":"":"Obligatoire"
        const error = errorLibelleFR + errorLibelleAR

        


        setError([errorLibelleFR,errorLibelleAR])
        if(error == ""){
            try {
                await api.put('entiteAdmin',{
                    id : EntiteAdmin._id,
                    libelle_ar : data["libelleAR"].trim(),
                    libelle_fr : data["libelleFR"].trim()
                })
                
                onClose();
            } catch (err) {
                if(err.response){ 
                    console.log(err.response.data)
                    const error =  err.response.data.split(" ").includes("Français") ? ["",err.response.data] : [err.response.data,""]
                    setError(error)
                }else{
                    console.log(err)
                    Navigate('/error')
                }
            }
        }
    }
            return (
                    <FormLayout onClose={onClose} onSubmit={handleSubmit} onReset={()=>setError([])}
                    Title={"Modifier une Entité Administrative"} Locked={Locked} Type={"detail"} setLocked={setLocked}>
                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                                <div className="flex flex-col gap-3 flex-start w-full">
                                    <label htmlFor="libelleAR" className="text-sm font-medium font-Roboto ">libelle en Arabe</label>
                                    <input type="text" id="libelleAR" defaultValue={EntiteAdmin.libelle_ar} placeholder="libelle en Arabe" name="libelleAR" disabled={Locked} className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[0]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[0] ? <CircleAlert size={16}/>: null }{Error[0] ?? " " }</p>
                                </div>
                        </div>

                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3  w-full">
                                    <label htmlFor="libelleFR" className="text-sm font-medium font-Roboto">libelle en Français</label>
                                    <input type="text" defaultValue={EntiteAdmin.libelle_fr} id="libelleFR" placeholder="libelle en Français" name="libelleFR" disabled={Locked}  className={"input-base w-full px-4 py-2 text-xs  disabled:border-gray-300 " + (Error[1]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[1] ? <CircleAlert size={16}/>: null }{Error[1] ?? " " }</p>
                            </div> 
                            
                        </div>
                    </FormLayout>
               
            );
}