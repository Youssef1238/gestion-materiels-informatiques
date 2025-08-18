import { CircleAlert, Lock, RotateCcw, Unlock, UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  SelectItem,
} from "@/components/ui/select"
import MySelect from "../MySelect";
import api from "@/utils/Api";
import { useNavigate } from "react-router-dom";

export default function MarchéForm({ type, onClose }) {

            switch(type) {
                case 'add':   
                    return <AddMarchéForm onClose={onClose} />;
                case 'detail':
                    return <DetailMarchéForm onClose={onClose}/>;
                default:
                    return null;
                
            }

}


const AddMarchéForm = ({onClose}) => {
    // Type , Objet , reference , fournisseur  
    const [Error,setError] = useState(["","","",""])
    const [selectValue,setselectValue] = useState("")
    const [fournisseurs,setFournisseurs] = useState([])
    const Navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        const regex1 = /^[a-zA-Z ]+$/;
        const regex3 = /^\d+\/\d{2}$/;

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const errorObjet = data["Objet"].trim() == ""?"Required":regex1.test(data["Objet"])?"":"only a-z A-Z are allowed"
        const errorReference = data["Reference"].trim() == ""?"Required":regex3.test(data["Reference"])?"":"format incorrecte"
        const errorType = data["Type"].trim() == ""?"Required":regex1.test(data["Type"])?"":"only a-z A-Z are allowed"
        const errorFournisseur = selectValue.trim() == ""?"Required":""

        
        const error = errorObjet + errorReference + errorType + errorFournisseur


        setError([errorType,errorObjet,errorReference,errorFournisseur])
        if(error == ""){
            try {
                await api.post('http://localhost:5500/marche',{
                    objet : data["Objet"].trim(),
                    reference : data["Reference"],
                    type : data["Type"],
                    fournisseur_id : selectValue,
                    date_creation : data["date"]
                })
                onClose();
            } catch(err){
                console.log(err)
                Navigate('/error')
                
            }
        }
    }
    useEffect(()=>{
        const fetch =  async ()=>{
            try{
                const res = await api.get(`http://localhost:5500/fournisseur`)
                setFournisseurs(res.data)
            }catch(err){
                Navigate('/error')
            }
        }
        fetch()
    },[])

            return (
                
                    <form onSubmit={handleSubmit} onReset={()=>{setselectValue(null)}} className="bg-white w-1/2  h-fit rounded-md shadow-md flex flex-col items-center gap-2">
                        <div className="w-full py-4 flex justify-center items-center bg-gray-800 rounded-t-md">
                            <h2 className="text-2xl font-bold font-Montserrat text-white">Ajouter un Marché</h2>
                        </div>

                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                                <div className="flex flex-col gap-3 flex-start w-full">
                                    <label htmlFor="Type" className="text-sm font-medium font-Roboto ">Type</label>
                                    <input type="text" id="Type" placeholder="Type" name="Type" className={"input-base w-full px-4 py-2 text-xs " + (Error[0]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[0] ? <CircleAlert size={16}/>: null }{Error[0] ?? " " }</p>
                                </div>
                        </div>

                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3  w-1/2">
                                    <label htmlFor="Reference" className="text-sm font-medium font-Roboto">Reference</label>
                                    <input type="text" id="Reference" placeholder="Reference xxxx/yy" name="Reference"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[2]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[2] ? <CircleAlert size={16}/>: null }{Error[2] ?? " " }</p>
                            </div> 
                            <div className="flex flex-col gap-3 flex-start w-1/2">
                                        <label htmlFor="Object" className="text-sm font-medium font-Roboto">Objet</label>
                                        <input type="text" id="Object" placeholder="Objet" name="Objet"  className={"input-base w-full px-4 py-2 text-xs " + (Error[1]?"border-red-500":"")}/>
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[1] ? <CircleAlert size={16}/>: null }{Error[1] ?? " " }</p>
                            </div>
                            
                        </div>

                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                             <div className="flex flex-col gap-3  w-full">
                                    <label htmlFor="Date" className="text-sm font-medium font-Roboto">date de Creation</label>
                                    <input type="Date" id="Date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className={"input-base w-full px-4 py-2 text-xs "}/>
                            </div>         
                        </div>

                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                            <div className="flex flex-col gap-3 w-full">
                                    <label htmlFor="Fournisseur" className="text-sm font-medium font-Roboto">Fournisseur</label>
                                    <MySelect placeholder={"Fournisseur"}
                                    width={"w-full"}
                                    value={selectValue} onValueChange={setselectValue}
                                    >
                                        {
                                            Array.from(fournisseurs).map((e,i)=>{
                                                return <SelectItem value={e._id} key={i}  className=" bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-xs p-4" >
                                                {e.nom} 
                                                </SelectItem>
                                            })
                                        }
                                        
                                    </MySelect>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[3] ? <CircleAlert size={16}/>: null }{Error[3] ?? " " }</p>
                                    
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
const DetailMarchéForm = ({onClose , id}) => {
    const [Error,setError] = useState(["","","",""])
    const [Locked,setLocked] = useState(false)
    const [selectValue,setselectValue] = useState()
    const Marché = {
        reference : "12/22",
        type : "Something",
        objet : "Fourniture",
        date :  Date.now(),
        fournisseur : "2"
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const regex1 = /^[a-zA-Z ]+$/;
        const regex3 = /^\d+\/\d{2}$/;

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        console.log(data)

        const errorObjet = data["Objet"].trim() == ""?"Required":regex1.test(data["Objet"])?"":"only a-z A-Z are allowed"
        const errorReference = data["Reference"].trim() == ""?"Required":regex3.test(data["Reference"])?"":"format incorrecte"
        const errorType = data["Type"].trim() == ""?"Required":regex1.test(data["Type"])?"":"only a-z A-Z are allowed"

        
        const error = errorObjet + errorReference + errorType  


        setError([errorType,errorObjet,errorReference])
        if(error == ""){
            onClose();
        }
    }
            return (
                
                    <form onSubmit={handleSubmit} onReset={()=>{setselectValue(Marché.fournisseur)}} className="bg-white w-1/2 h-fit rounded-md shadow-md flex flex-col items-center gap-2">
                        <div className="w-full px-8 py-4 flex justify-between items-center bg-gray-800 rounded-t-md">
                            <h2 className="text-2xl font-bold font-Montserrat text-white">Marché {Marché.reference}</h2>
                            <button type="button" className="text-white hover:scale-105" onClick={()=>setLocked(l=>!l)}>{Locked? <Lock/> : <Unlock/>}</button>
                        </div>

                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                                <div className="flex flex-col gap-3 flex-start w-full">
                                    <label htmlFor="Type" className="text-sm font-medium font-Roboto ">Type</label>
                                    <input type="text" defaultValue={Marché.type} id="Type" disabled={Locked} placeholder="Type" name="Type" className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[0]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[0] ? <CircleAlert />: null }{Error[0] ?? " " }</p>
                                </div>
                                <div className="flex flex-col gap-3 flex-start w-full">
                                        <label htmlFor="Objet" className="text-sm font-medium font-Roboto">Objet</label>
                                        <input type="text" defaultValue={Marché.objet} disabled={Locked} id="Objet" placeholder="Objet" name="Objet"  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[1]?"border-red-500":"")}/>
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[1] ? <CircleAlert />: null }{Error[1] ?? " " }</p>
                                </div>
                        </div>

                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                             <div className="flex flex-col gap-3  w-full">
                                    <label htmlFor="Date" className="text-sm font-medium font-Roboto">date de Creation</label>
                                    <input type="Date" id="Date" disabled={Locked} defaultValue={Marché.date} className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300  "}/>
                            </div>         
                        </div>

                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                            <div className="flex flex-col gap-3 w-full">
                                    <label htmlFor="Fournisseur" className="text-sm font-medium font-Roboto">Fournisseur</label>
                                    <MySelect defaultValue={Marché.fournisseur} value={selectValue} onValueChange={setselectValue} disabled={Locked} placeholder={"Fournisseur"}
                                    width={"w-full"}
                                    >
                                        <SelectItem value="1"  className=" bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-xs p-4" >
                                        Fournisseur 1  
                                        </SelectItem>
                                        <SelectItem value="2"  className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-xs p-4" >
                                        Fournisseur 2 
                                        </SelectItem>
                                        <SelectItem value="3"  className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-xs p-4" >
                                        Fournisseur 3  
                                        </SelectItem>
                                    </MySelect>
                                    
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