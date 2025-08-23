import { CircleAlert, Lock, RotateCcw, Unlock, UploadIcon } from "lucide-react";
import { useState } from "react";
import api from "../../utils/Api";
import { Switch } from "@radix-ui/react-switch";
import { useNavigate } from "react-router-dom";



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
        const errorPseudo = data["Pseudo"].trim() == ""?"Required":regex1.test(data["Pseudo"].trim())?"":"only Alphanumerics allowed"
        const erroPass = data["Pass"].trim() != ""?data["Pass"].length < 8?"Must have at least 8 caracters":"":"Required"

        const error = errorPseudo + erroPass

        


        setError([errorPseudo,erroPass])
        if(error == ""){
            try {
                await api.post(`http://localhost:5500/user`,{
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
                
                    <form onSubmit={handleSubmit} onReset={()=>setError([])} className="bg-white w-1/2  h-fit rounded-md shadow-md flex flex-col items-center gap-2">
                        <div className="w-full py-4 flex justify-center items-center bg-gray-800 rounded-t-md">
                            <h2 className="text-2xl font-bold font-Montserrat text-white">Ajouter un Compte</h2>
                        </div>

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
const DetailCompteForm = ({onClose , Compte}) => {
    const [Error,setError] = useState(["",""])
    const [Locked,setLocked] = useState(false)
    const Navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const erroPass = data["Pass"].trim() != ""?data["Pass"].trim().length < 8?"Must have at least 8 caracters":"":"Required"

        


        setError(["",erroPass])
        if(erroPass == ""){
            try {
                await api.put(`http://localhost:5500/user`,{
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
                
                    <form onSubmit={handleSubmit} onReset={()=>setError([])} className="bg-white w-1/2  h-fit rounded-md shadow-md flex flex-col items-center gap-2">
                        <div className="w-full px-8 py-4 flex justify-between items-center bg-gray-800 rounded-t-md">
                            <h2 className="text-2xl font-bold font-Montserrat text-white">Modifier le compte</h2>
                            <button type="button" className="text-white hover:scale-105" onClick={()=>setLocked(l=>!l)}>{Locked? <Lock/> : <Unlock/>}</button>
                        </div>

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