import api from "@/utils/Api";
import { CircleAlert, Lock, RotateCcw, Unlock, UploadIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TypeForm({ type, onClose , data }) {
            
        switch(type) {
            case 'add':   
                return <AddTypeForm onClose={onClose}/>;
            case 'detail':
                return <DetailTypeForm onClose={onClose} Type={data} />;
            default:
                return null;
            
        }

}


const AddTypeForm = ({onClose}) => {
    // Libelle , order 
    const [Error,setError] = useState(["",""])
    const Navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const regex1 = /^[a-zA-Z ]+$/;
        const regex2 = /^[0-9]+$/;
        const number = Number(data["Order"])
        const errorLibelle = data["Libelle"] ?regex1.test(data["Libelle"])?data["Libelle"].trim() == ""?"Required":"":"only a-z A-Z are allowed":"Required"
        const errorOrder = data["Order"] && regex2.test(data["Order"])?number <= 0?"Ordre Invalid":"": "Ordre (Nombre) est Obligatoire"
        const error = errorOrder + errorLibelle

        


        setError([errorLibelle,errorOrder])
        if(error == ""){
            try {
                await api.post('http://localhost:5500/type',{
                    libelle : data["Libelle"],
                    order : data["Order"]
                })
                onClose();
            } catch (err) {
                if(err.response){

                    const error =  err.response.data.split(" ").includes("Ordre") ? ["",err.response.data] : [err.response.data,""]
                    setError(error)
                }else{
                    console.log(err)
                    Navigate('/error')
                }
            }
           
        }
    }
            return (
                
                    <form onSubmit={handleSubmit} onReset={()=>setError([])} className="bg-white w-1/2  h-fit rounded-md shadow-md flex flex-col items-center gap-2">
                        <div className="w-full py-4 flex justify-center items-center bg-gray-800 rounded-t-md">
                            <h2 className="text-2xl font-bold font-Montserrat text-white">Ajouter un Type d'article</h2>
                        </div>

                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                                <div className="flex flex-col gap-3 flex-start w-full">
                                    <label htmlFor="Libelle" className="text-sm font-medium font-Roboto ">Libelle</label>
                                    <input type="text" id="Libelle" placeholder="Libelle" name="Libelle" className={"input-base w-full px-4 py-2 text-xs " + (Error[0]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[0] ? <CircleAlert size={16}/>: null }{Error[0] ?? " " }</p>
                                </div>
                        </div>

                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3  w-full">
                                    <label htmlFor="Order" className="text-sm font-medium font-Roboto">Order</label>
                                    <input type="text" id="Order" placeholder="Order" name="Order"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[1]?"border-red-500":"")}/>
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
const DetailTypeForm = ({onClose , Type}) => {
    // Libelle , order 
    const [Error,setError] = useState(["",""])
    const [Locked,setLocked] = useState(false)
    const Navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const regex1 = /^[a-zA-Z ]+$/;
        const regex2 = /^[0-9]+$/;
        const number = Number(data["Order"])
        const errorLibelle = data["Libelle"] ?regex1.test(data["Libelle"].trim())?data["Libelle"].trim() == ""?"Required":"":"only a-z A-Z are allowed":"Required"
        const errorOrder = data["Order"] && regex2.test(data["Order"].trim())?number <= 0?"Ordre Invalid":"": "Ordre (Nombre) est Obligatoire"
        const error = errorOrder + errorLibelle

        


        setError([errorLibelle,errorOrder])
        if(error == ""){
            try{
                await api.put('http://localhost:5500/type',{
                    id : Type._id,
                    libelle : data["Libelle"].trim(),
                    order : data["Order"]
                    
                })
                
                onClose();
            }catch(err){
                if(err.response){ 
                    const error =  err.response.data.split(" ").includes("Ordre") ? ["",err.response.data] : [err.response.data,""]
                    setError(error)
                }else{
                    console.log(err)
                    Navigate('/error')
                }
            }
            
            
        }
    }
            return (
                
                    <form onSubmit={handleSubmit} onReset={()=>setError([])} className="bg-white w-1/2  h-fit rounded-md shadow-md flex flex-col items-center gap-2">
                        <div className="w-full px-8 py-4 flex justify-between items-center bg-gray-800 rounded-t-md">
                            <h2 className="text-2xl font-bold font-Montserrat text-white">Modifier le Type d'article</h2>
                            <button type="button" className="text-white hover:scale-105" onClick={()=>setLocked(l=>!l)}>{Locked? <Lock/> : <Unlock/>}</button>
                        </div>

                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                                <div className="flex flex-col gap-3 flex-start w-full">
                                    <label htmlFor="Libelle" className="text-sm font-medium font-Roboto ">Libelle</label>
                                    <input type="text" id="Libelle" defaultValue={Type.libelle} placeholder="Libelle" name="Libelle" disabled={Locked} className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[0]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[0] ? <CircleAlert size={16}/>: null }{Error[0] ?? " " }</p>
                                </div>
                        </div>

                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3  w-full">
                                    <label htmlFor="Order" className="text-sm font-medium font-Roboto">Order</label>
                                    <input type="number" defaultValue={Type.order} id="Order" placeholder="Order" name="Order" disabled={Locked}  className={"input-base w-full px-4 py-2 text-xs  disabled:border-gray-300 " + (Error[1]?"border-red-500":"")}/>
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