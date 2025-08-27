import api from "@/utils/Api";
import { CircleAlert} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLayout from "../layout/FormLayout";

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
        const errorLibelle = data["Libelle"] ?regex1.test(data["Libelle"])?data["Libelle"].trim() == ""?"Obligatoire":"":"juste a-z A-Z sont accepté":"Obligatoire"
        const errorOrder = data["Order"] && regex2.test(data["Order"])?number <= 0?"Ordre Invalid":"": "Ordre (Nombre) est Obligatoire"
        const error = errorOrder + errorLibelle

        


        setError([errorLibelle,errorOrder])
        if(error == ""){
            try {
                await api.post('type',{
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
                    <FormLayout onClose={onClose} onSubmit={handleSubmit} onReset={()=>setError([])}
                    Title={"Ajouter un Type d'article"}  Type={"add"} >
                
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
                    </FormLayout>
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
                await api.put('type',{
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
                    <FormLayout onClose={onClose} onSubmit={handleSubmit} onReset={()=>setError([])}
                    Title={"Modifier le Type d'article"} Locked={Locked} Type={"detail"} setLocked={setLocked}>

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
                    </FormLayout>
               
            );
}