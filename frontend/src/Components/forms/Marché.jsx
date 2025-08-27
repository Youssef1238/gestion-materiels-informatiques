import { CircleAlert} from "lucide-react";
import { useEffect, useState } from "react";
import {
  SelectItem,
} from "@/components/ui/select"
import MySelect from "../MySelect";
import api from "@/utils/Api";
import { useNavigate } from "react-router-dom";
import FormLayout from "../layout/FormLayout";

export default function MarchéForm({ type, onClose , data }) {

            switch(type) {
                case 'add':   
                    return <AddMarchéForm onClose={onClose} />;
                case 'detail':
                    return <DetailMarchéForm onClose={onClose} Marché={data}/>;
                default:
                    return null;
                
            }

}


const AddMarchéForm = ({onClose}) => {
    // Type ,  Reference , Objet  , date , fournisseur  
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

        const errorDate = data["date"]?"":"Obligatoire"
        const errorObjet = data["Objet"].trim() == ""?"Obligatoire":regex1.test(data["Objet"])?"":"juste a-z A-Z sont accepté"
        const errorReference = data["Reference"].trim() == ""?"Obligatoire":regex3.test(data["Reference"])?"":"Format incorrecte utiliser 'xxxx/yy'"
        const errorType = data["Type"].trim() == ""?"Obligatoire":regex1.test(data["Type"])?"":"juste a-z A-Z sont accepté"
        const errorFournisseur = selectValue.trim() == ""?"Obligatoire":""

        
        const error = errorObjet + errorReference + errorType + errorFournisseur + errorDate


        setError([errorType,errorReference,errorObjet,errorDate,errorFournisseur])
        if(error == ""){
            try {
                await api.post('marche',{
                    objet : data["Objet"].trim(),
                    reference : data["Reference"],
                    type : data["Type"],
                    fournisseur_id : selectValue,
                    date_creation : data["date"]
                })
                onClose();
            } catch(err){
                if(err.response){
                    if(err.response.status == 404 && !err.response.data) onClose()
                    const error = err.response.status == 409?["","",err.response.data,""]: ["","","",err.response.data]
                    setError(error)
                }else{
                    console.log(err)
                    Navigate('/error')
                }
                
                
            }
        }
    }
    useEffect(()=>{
        const fetch =  async ()=>{
            try{
                const res = await api.get(`fournisseur`)
                setFournisseurs(res.data)
            }catch(err){
                Navigate('/error')
            }
        }
        fetch()
    },[])

            return (
                    <FormLayout onClose={onClose} onSubmit={handleSubmit} onReset={()=>{{setselectValue(null) ;setError([])}}}
                    Title={"Ajouter un Marché"}  Type={"add"} >
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
                                    <input type="text" id="Reference" placeholder="Reference xxxx/yy" name="Reference"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[1]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[1] ? <CircleAlert size={16}/>: null }{Error[1] ?? " " }</p>
                            </div> 
                            <div className="flex flex-col gap-3 flex-start w-1/2">
                                        <label htmlFor="Object" className="text-sm font-medium font-Roboto">Objet</label>
                                        <input type="text" id="Object" placeholder="Objet" name="Objet"  className={"input-base w-full px-4 py-2 text-xs " + (Error[2]?"border-red-500":"")}/>
                                        <p className="text-xs text-red-500 mt-2 flex items-center gap-1 h-6">{Error[2] ? <CircleAlert size={16}/>: null }{Error[2] ?? " " }</p>
                            </div>
                            
                        </div>

                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                             <div className="flex flex-col gap-3  w-full">
                                    <label htmlFor="Date" className="text-sm font-medium font-Roboto">date de Creation</label>
                                    <input type="Date" id="Date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className={"input-base w-full px-4 py-2 text-xs " + (Error[3]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1 h-6">{Error[3] ? <CircleAlert size={16}/>: null }{Error[3] ?? " " }</p>
                            </div>         
                        </div>

                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                            <div className="flex flex-col gap-3 w-full">
                                    <label htmlFor="Fournisseur" className="text-sm font-medium font-Roboto">Fournisseur</label>
                                    <MySelect placeholder={"Fournisseur"}
                                    width={"w-full"}
                                    value={selectValue} onValueChange={setselectValue}>
   

                                        {
                                            Array.from(fournisseurs).map((e,i)=>{
                                                return <SelectItem value={e._id} key={i}  className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-black text-xs p-4" >
                                                {e.nom} 
                                                </SelectItem>
                                            })
                                        }

                                    </MySelect>
                                    
                                    <p className="text-xs text-red-500  mt-1 flex items-center gap-1 h-6">{Error[4] ? <CircleAlert size={16}/>: null }{Error[4] ?? " " }</p>
                                    
                            </div>     
                        </div>
                        
                    </FormLayout>
               
            );
}
const DetailMarchéForm = ({onClose , Marché}) => {
    // Type , Objet , date , fournisseur  
    const [Error,setError] = useState(["","","",""])
    const [selectValue,setselectValue] = useState(Marché.fournisseur_id)
    const [Locked,setLocked] = useState(false)
    const [fournisseurs,setFournisseurs] = useState([])
    const Navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        const regex1 = /^[a-zA-Z ]+$/;

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const errorDate = data["date"]?"":"Obligatoire"
        const errorObjet = data["Objet"].trim() == ""?"Obligatoire":regex1.test(data["Objet"])?"":"juste a-z A-Z sont accepté"
        const errorType = data["Type"].trim() == ""?"Obligatoire":regex1.test(data["Type"])?"":"juste a-z A-Z sont accepté"
        const errorFournisseur = selectValue.trim() == ""?"Obligatoire":""

        
        const error = errorObjet + errorType + errorFournisseur + errorDate


        setError([errorType,errorObjet,errorDate,errorFournisseur])
        if(error == ""){
            try {
                await api.put('marche',{
                    id : Marché._id,
                    objet : data["Objet"].trim(),
                    type : data["Type"],
                    fournisseur_id : selectValue,
                    date_creation : data["date"]
                })
                onClose();
            } catch(err){
                if(err.response){
                    if(err.response.status == 404 && !err.response.data) onClose()
                    const error = err.response.status == 409?["","",err.response.data,""]: ["","","",err.response.data]
                    setError(error)
                }else{
                    console.log(err)
                    Navigate('/error')
                }
                
                
            }
        }
    }
    useEffect(()=>{
        const fetch =  async ()=>{
            try{
                const res = await api.get(`fournisseur`)
                setFournisseurs(res.data)
            }catch(err){
                Navigate('/error')
            }
        }
        fetch()
    },[])

            return (
                    <FormLayout onClose={onClose} onSubmit={handleSubmit} onReset={()=>{{setselectValue(null) ;setError([])}}}
                    Title={"Marché - " + Marché.reference} Locked={Locked} Type={"detail"} setLocked={setLocked}>
                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                                <div className="flex flex-col gap-3 flex-start w-full">
                                    <label htmlFor="Type" className="text-sm font-medium font-Roboto ">Type</label>
                                    <input type="text" defaultValue={Marché.type} disabled={Locked} id="Type" placeholder="Type" name="Type" className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[0]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[0] ? <CircleAlert size={16}/>: null }{Error[0] ?? " " }</p>
                                </div>
                        </div>

                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3 flex-start w-full">
                                        <label htmlFor="Object" className="text-sm font-medium font-Roboto">Objet</label>
                                        <input type="text" defaultValue={Marché.objet} disabled={Locked} id="Object" placeholder="Objet" name="Objet"  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[1]?"border-red-500":"")}/>
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[1] ? <CircleAlert size={16}/>: null }{Error[1] ?? " " }</p>
                            </div>
                            
                        </div>

                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                             <div className="flex flex-col gap-3  w-full">
                                    <label htmlFor="Date" className="text-sm font-medium font-Roboto">date de Creation</label>
                                    <input type="Date" disabled={Locked} id="Date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[2]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[2] ? <CircleAlert size={16}/>: null }{Error[2] ?? " " }</p>
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
                        
                    </FormLayout>
               
            );
}