import { CircleAlert} from "lucide-react";
import { useState } from "react";
import api from "../../utils/Api";
import { Switch } from "@radix-ui/react-switch";
import { useNavigate } from "react-router-dom";
import FormLayout from "../layout/FormLayout";



export default function CompteForm({ type, onClose, data}) {
            
            switch(type) {
                case 'add':   
                    return <AddCompteForm onClose={onClose}/>;
                case 'detail':
                    return <DetailCompteForm onClose={onClose} Compte={data}/>;
                default:
                    return null;
                
            }

}


const AddCompteForm = ({onClose}) => {
    // Pseudo , Pass 
    const [Error,setError] = useState(["",""])
    const [isAdmin, setIsAdmin] = useState(false);
    const Navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        const regex1 = /^[a-zA-Z0-9]+$/;

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const errorPseudo = data["Pseudo"].trim() == ""?"Obligatoire":regex1.test(data["Pseudo"].trim())?"":"juste les alphanumériques sont accepté"
        const erroPass = data["Pass"].trim() != ""?data["Pass"].length < 8?"Doit avoir minimum 8 caractères !":"":"Obligatoire"

        const error = errorPseudo + erroPass

        


        setError([errorPseudo,erroPass])
        if(error == ""){
            try {
                await api.post(`user`,{
                    pseudo : data["Pseudo"].trim(),
                    password : data["Pass"].trim(),
                    admin : isAdmin,
                })
                onClose();
            } catch(err){
                if (err.response) {
                    setError(["Pseudo already used", ""])
                } else {
                    Navigate('/error')
                } 
            }
            
        }
    }
            return (
            <FormLayout onClose={onClose} onSubmit={handleSubmit} onReset={()=>setError([])}
            Title={"Ajouter un Compte"}  Type={"add"} >
                <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                        <div className="flex flex-col gap-3 flex-start w-full">
                            <label htmlFor="Pseudo" className="text-sm font-medium font-Roboto ">Pseudo</label>
                            <input type="text" id="Pseudo" placeholder="Pseudo" name="Pseudo" className={"input-base w-full px-4 py-2 text-xs " + (Error[0]?"border-red-500":"")}/>
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[0] ? <CircleAlert size={16}/>: null }{Error[0] ?? " " }</p>
                        </div>
                </div>

                <div className="w-full px-8 flex gap-2 justify-start items-center">
                    <div className="flex flex-col gap-3  w-full">
                            <label htmlFor="Pass" className="text-sm font-medium font-Roboto">Password</label>
                            <input type="text" id="Pass" placeholder="Password" name="Pass"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[1]?"border-red-500":"")}/>
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[1] ? <CircleAlert size={16}/>: null }{Error[1] ?? " " }</p>
                    </div> 
                    
                </div>
                <div className="w-full px-8 flex gap-2 justify-start items-center">
                    <div className="flex flex-col gap-3  w-full">
                            <label htmlFor="Admin" className="text-sm font-medium font-Roboto">Admin</label>
                            <Switch checked={isAdmin} onCheckedChange={setIsAdmin} id="article-affecté"  className={"w-5 h-3 "+ (!isAdmin?"bg-gray-300" : "bg-gray-600")+ " rounded-full relative  transition-colors duration-200"}>
                                <span className={"absolute " + (!isAdmin?"left-1" : "right-1")+"  top-1 w-2 h-2 bg-white rounded-full transition-transform duration-200 transform" }/>
                            </Switch>
                            <input type="hidden" name="admin" value={isAdmin} />
                    </div>
                    
                </div>
            </FormLayout>

            );
}
const DetailCompteForm = ({onClose , Compte}) => {
    const [Error,setError] = useState(["",""])
    const [Locked,setLocked] = useState(false)
    const Navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const erroPass = data["Pass"].trim() != ""?data["Pass"].trim().length < 8?"Doit avoir minimum 8 caractères !":"":"Obligatoire"

        


        setError(["",erroPass])
        if(erroPass == ""){
            try {
                await api.put(`user`,{
                    id : Compte._id,
                    password : data["Pass"].trim(),
                })
                onClose();
            } catch (err) {
                Navigate('/error')
            }
            
        }
    }
            return (
                    <FormLayout onClose={onClose} onSubmit={handleSubmit} onReset={()=>setError([])}
                    Title={"Modifier le compte"} Locked={Locked} Type={"detail"} setLocked={setLocked}>
                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                                <div className="flex flex-col gap-3 flex-start w-full">
                                    <label htmlFor="Pseudo" className="text-sm font-medium font-Roboto ">Pseudo</label>
                                    <input type="text" id="Pseudo" defaultValue={Compte.pseudo} placeholder="Pseudo" name="Pseudo" disabled={true} className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[0]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[0] ? <CircleAlert size={16}/>: null }{Error[0] ?? " " }</p>
                                </div>
                        </div>

                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3  w-full">
                                    <label htmlFor="Pass" className="text-sm font-medium font-Roboto">Password</label>
                                    <input type="text" id="Pass" placeholder="Password" name="Pass" disabled={Locked}  className={"input-base w-full px-4 py-2 text-xs  disabled:border-gray-300 " + (Error[1]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[1] ? <CircleAlert size={16}/>: null }{Error[1] ?? " " }</p>
                            </div> 
                            
                        </div>
                    </FormLayout>
               
            );
}