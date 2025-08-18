import api from "@/utils/Api";
import { CircleAlert, Lock, RotateCcw, Unlock, UploadIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

        const errorLibelleFR = data["libelleFR"]?regex1.test(data["libelleFR"])?"only a-z A-Z are allowed":data["libelleFR"].trim() == ""?"Required":"":"Required"
        const errorLibelleAR = data["libelleAR"]?!regex2.test(data["libelleAR"])?"only arabic caracters allowed":data["libelleAR"].trim() == ""?"Required":"":"Required"
        const error = errorLibelleFR + errorLibelleAR

        


        setError([errorLibelleFR,errorLibelleAR])
        if(error == ""){
            try {
                await api.post('http://localhost:5500/entiteAdmin',{
                    libelle_ar : data["libelleAR"].trim(),
                    libelle_fr : data["libelleFR"].trim(),
                })
                
                onClose();
            } catch (err) {
                Navigate('/error')
            }
           
        }
    }
            return (
                
                    <form onSubmit={handleSubmit} className="bg-white w-1/2  h-fit rounded-md shadow-md flex flex-col items-center gap-2">
                        <div className="w-full py-4 flex justify-center items-center bg-gray-800 rounded-t-md">
                            <h2 className="text-2xl font-bold font-Montserrat text-white">Ajouter une Entité Administrative</h2>
                        </div>

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
                        <div className="w-full py-8 gap-8 flex justify-start items-center px-8 mt-8">
                            <div className="flex justify-center items-center w-full">
                                    <button type="submit" className="w-full bg-primary text-white flex justify-center hover:scale-105 transition-all active:bg-black" ><UploadIcon/></button>
                            </div>
                            <div className="flex justify-center items-center w-full">
                                    <button type="reset" className="w-full border border-primary text-primary flex justify-center hover:scale-105 transition-all active:bg-primary" ><RotateCcw/></button>
                            </div>
                        </div>

                    </form>
               
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

        const errorLibelleFR = data["libelleFR"]?regex1.test(data["libelleFR"])?"only a-z A-Z are allowed":data["libelleFR"].trim() == ""?"Required":"":"Required"
        const errorLibelleAR = data["libelleAR"]?!regex2.test(data["libelleAR"])?"only arabic caracters allowed":data["libelleAR"].trim() == ""?"Required":"":"Required"
        const error = errorLibelleFR + errorLibelleAR

        


        setError([errorLibelleFR,errorLibelleAR])
        if(error == ""){
            try {
                await api.put('http://localhost:5500/entiteAdmin',{
                    id : EntiteAdmin._id,
                    libelle_ar : data["libelleAR"].trim(),
                    libelle_fr : data["libelleFR"].trim()
                })
                
                onClose();
            } catch (err) {
                Navigate('/error')
            }
        }
    }
            return (
                
                    <form onSubmit={handleSubmit} className="bg-white w-1/2  h-fit rounded-md shadow-md flex flex-col items-center gap-2">
                        <div className="w-full px-8 py-4 flex justify-between items-center bg-gray-800 rounded-t-md">
                            <h2 className="text-2xl font-bold font-Montserrat text-white">Modifier une Entité Administrative</h2>
                            <button type="button" className="text-white hover:scale-105" onClick={()=>setLocked(l=>!l)}>{Locked? <Lock/> : <Unlock/>}</button>
                        </div>

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
                        <div className="w-full py-8 gap-8 flex justify-start items-center px-8 mt-8">
                            <div className="flex justify-center items-center w-full">
                                    <button type="submit" disabled={Locked} className="w-full bg-primary  disabled:scale-0 text-white flex justify-center hover:scale-105  transition-all active:bg-black" ><UploadIcon/></button>
                            </div>
                            <div className="flex justify-center items-center w-full">
                                    <button type="reset" disabled={Locked} className="w-full border border-primary text-primary flex justify-center hover:scale-105 transition-all active:bg-primary disabled:scale-0" ><RotateCcw/></button>
                            </div>
                        </div>

                    </form>
               
            );
}