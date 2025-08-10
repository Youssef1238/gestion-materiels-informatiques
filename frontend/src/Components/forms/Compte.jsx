import { CircleAlert, Lock, RotateCcw, Unlock, UploadIcon } from "lucide-react";
import { useState } from "react";

export default function CompteForm({ type, onClose }) {

            switch(type) {
                case 'add':   
                    return <AddCompteForm onClose={onClose}/>;
                case 'detail':
                    return <DetailCompteForm onClose={onClose}/>;
                default:
                    return null;
                
            }

}


const AddCompteForm = ({onClose}) => {
    // Pseudo , Pass 
    const [Error,setError] = useState(["",""])
    const handleSubmit = (e) => {
        e.preventDefault();
        const regex1 = /^[a-zA-Z0-9]+$/;

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        console.log(data["Pseudo"])
        const errorPseudo = data["Pseudo"].trim() == ""?"Required":regex1.test(data["Pseudo"])?"":"only Alphanumerics allowed"
        const erroPass = data["Pass"].trim() == ""?"Required":""

        const error = errorPseudo + erroPass

        


        setError([errorPseudo,erroPass])
        if(error == ""){
            onClose();
        }
    }
            return (
                
                    <form onSubmit={handleSubmit} className="bg-white w-1/2  h-fit rounded-md shadow-md flex flex-col items-center gap-2">
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
const DetailCompteForm = ({onClose , id}) => {
    const [Error,setError] = useState(["",""])
    const [Locked,setLocked] = useState(false)
    const Compte = {
        pseudo: "ahmed123",
        password: "12345"
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted")
        const regex1 = /^[a-zA-Z0-9]+$/;

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        console.log(data["Pseudo"])
        const errorPseudo = data["Pseudo"].trim() == ""?"Required":regex1.test(data["Pseudo"])?"":"only Alphanumerics allowed"
        const erroPass = data["Pass"].trim() == ""?"Required":""

        const error = errorPseudo + erroPass

        


        setError([errorPseudo,erroPass])
        if(error == ""){
            onClose();
        }
    }
            return (
                
                    <form onSubmit={handleSubmit} className="bg-white w-1/2  h-fit rounded-md shadow-md flex flex-col items-center gap-2">
                        <div className="w-full px-8 py-4 flex justify-between items-center bg-gray-800 rounded-t-md">
                            <h2 className="text-2xl font-bold font-Montserrat text-white">Modifier le compte</h2>
                            <button type="button" className="text-white hover:scale-105" onClick={()=>setLocked(l=>!l)}>{Locked? <Lock/> : <Unlock/>}</button>
                        </div>

                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                                <div className="flex flex-col gap-3 flex-start w-full">
                                    <label htmlFor="Pseudo" className="text-sm font-medium font-Roboto ">Pseudo</label>
                                    <input type="text" id="Pseudo" defaultValue={Compte.pseudo} placeholder="Pseudo" name="Pseudo" disabled={Locked} className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[0]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[0] ? <CircleAlert size={16}/>: null }{Error[0] ?? " " }</p>
                                </div>
                        </div>

                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3  w-full">
                                    <label htmlFor="Pass" className="text-sm font-medium font-Roboto">Password</label>
                                    <input type="text" defaultValue={Compte.password} id="Pass" placeholder="Password" name="Pass" disabled={Locked}  className={"input-base w-full px-4 py-2 text-xs  disabled:border-gray-300 " + (Error[1]?"border-red-500":"")}/>
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