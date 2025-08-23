import { CircleAlert, Lock, RotateCcw, Unlock, UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../utils/Api";
import { useNavigate } from "react-router-dom";
import MySelect from "../ui/MySelect";
import {
  SelectItem,
} from "@/components/ui/select"



export default function SubArticleForm({ type, onClose, data}) {
            
            switch(type) {
                case 'add':   
                    return <AddSubArticleForm onClose={onClose} ArticleData={data}/>;
                case 'detail':
                    return <DetailSubArticleForm onClose={onClose} ArticleData={data}/>;
                default:
                    return null;
                
            }

}


const AddSubArticleForm = ({onClose , ArticleData}) => {
    // Numero , Serie , CAB , date 

    const [Error,setError] = useState(["","","",""])
    const Navigate = useNavigate()
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        const regex1 = /^[A-Z0-9]+$/;
        const regex2 = /^[0-9]+$/;
        const number = Number(data["subarticle-numero"])
        const errorDate = !data["date"] ?"la date est Obligatoire":""
        const errorNumber = data["subarticle-numero"] && regex2.test(data["subarticle-numero"].trim())?number <= 0 || number > ArticleData.quantite ?"Numero Invalid":"":"caractére Invalid !"
        const errorSerie = data["subarticle-serie"].trim() == "" ?"Obligatoire":regex1.test(data["subarticle-serie"].trim())?"":"caractére Invalid !"
        const errorCAB = data["subarticle-cab"].trim() == ""?"Obligatoire":regex1.test(data["subarticle-cab"].trim())?"":"caractére Invalid !"
        
        
        const error = errorSerie + errorCAB + errorDate + errorNumber

        setError([errorNumber,errorSerie,errorCAB,errorDate])
        if(error == ""){
            try {
                await api.post('http://localhost:5500/articleLivre',{
                    article_marche_id : ArticleData._id,
                    Numero : number,
                    Numero_Serie : data["subarticle-serie"].trim(),
                    date_Livraison : data["date"],
                    cab : data["subarticle-cab"].trim(),
                    etat : false
                })
                onClose();
            } catch(err){
                console.error(err)
                if (err.response /* && err.response.status == 409 */) {
                    let FilteredError = Error
                    FilteredError[err.response.data.includes("Serie") ? 1 : 0] = err.response.data
                    setError(FilteredError)
                } else {
                    Navigate('/error')
                } 
            }
            
        }
    }
            return (
                
                    <form onSubmit={handleSubmit} onReset={()=>setError([])} className="bg-white w-1/2  h-fit rounded-md shadow-md flex flex-col items-center gap-2">
                        <div className="w-full py-4 flex justify-center items-center bg-gray-800 rounded-t-md">
                            <h2 className="text-2xl font-bold font-Montserrat text-white">Ajouter un Article Livré</h2>
                        </div>
                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                                <div className="flex flex-col gap-3 flex-start w-full">
                                    <label htmlFor="Numero" className="text-sm font-medium font-Roboto ">Numero</label>
                                    <input type="number" min={1} max={ArticleData.quantite} id="Numero" placeholder="Numero" name="subarticle-numero" className={"input-base w-full px-4 py-2 text-xs " + (Error[0]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[0] ? <CircleAlert size={16}/>: null }{Error[0] ?? " " }</p>
                                </div>
                        </div>

                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3  w-1/2">
                                    <label htmlFor="Numero de serie" className="text-sm font-medium font-Roboto">Numero de serie</label>
                                    <input type="text" id="Numero de serie" placeholder="Numero de serie" name="subarticle-serie"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[1]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[1] ? <CircleAlert size={16}/>: null }{Error[1] ?? " " }</p>
                            </div> 
                            <div className="flex flex-col gap-3 flex-start w-1/2">
                                        <label htmlFor="CAB" className="text-sm font-medium font-Roboto">CAB</label>
                                        <input type="text" id="CAB" placeholder="CAB" name="subarticle-cab"  className={"input-base w-full px-4 py-2 text-xs " + (Error[2]?"border-red-500":"")}/>
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[2] ? <CircleAlert size={16}/>: null }{Error[2] ?? " " }</p>
                            </div>
                            
                        </div>

                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                                <div className="flex flex-col gap-3  w-full">
                                    <label htmlFor="Date" className="text-sm font-medium font-Roboto">date de Creation</label>
                                    <input type="Date" id="Date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className={"input-base w-full px-4 py-2 text-xs " + (Error[3]?"border-red-500":"")}/>
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
const DetailSubArticleForm = ({onClose , ArticleData}) => {
    // Numero , Serie , CAB , date 

    const [Error,setError] = useState(["","","",""])
    const Navigate = useNavigate()
    const [Locked,setLocked] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        const regex1 = /^[A-Z0-9]+$/;
        const regex2 = /^[0-9]+$/;
        const number = Number(data["subarticle-numero"])
        const errorDate = !data["date"] ?"la date est Obligatoire":""
        const errorNumber = data["subarticle-numero"] && regex2.test(data["subarticle-numero"].trim())?number <= 0 || number > ArticleData.quantité ?"Numero Invalid":"":"caractére Invalid !"
        const errorSerie = data["subarticle-serie"].trim() == "" ?"Obligatoire":regex1.test(data["subarticle-serie"].trim())?"":"caractére Invalid !"
        const errorCAB = data["subarticle-cab"].trim() == ""?"Obligatoire":regex1.test(data["subarticle-cab"].trim())?"":"caractére Invalid !"
        
        
        const error = errorSerie + errorCAB + errorDate + errorNumber

        setError([errorNumber,errorSerie,errorCAB,errorDate])
        if(error == ""){
            try {
                await api.put('http://localhost:5500/articleLivre',{
                    id : ArticleData.subArticle._id,
                    article_marche_id : ArticleData.subArticle.article_marche_id,
                    Numero : number,
                    Numero_Serie : data["subarticle-serie"].trim(),
                    date_Livraison : data["date"],
                    cab : data["subarticle-cab"].trim(),
                    etat : false
                })
                onClose();
            } catch(err){
                console.error(err)
                if (err.response && err.response.status == 409) {
                    let FilteredError = Error
                    FilteredError[err.response.data.includes("Serie") ? 1 : 0] = err.response.data
                    setError(FilteredError)
                } else {
                    Navigate('/error')
                } 
            }
            
        }
    }
            return (
                
                    <form onSubmit={handleSubmit} onReset={()=>setError([])} className="bg-white w-1/2  h-fit rounded-md shadow-md flex flex-col items-center gap-2">
                        <div className="w-full px-8 py-4 flex justify-between items-center bg-gray-800 rounded-t-md">
                            <h2 className="text-2xl font-bold font-Montserrat text-white">Modifier un Article Livré</h2>
                            <button type="button" className="text-white hover:scale-105" onClick={()=>setLocked(l=>!l)}>{Locked? <Lock/> : <Unlock/>}</button>
                        </div>
                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                                <div className="flex flex-col gap-3 flex-start w-full">
                                    <label htmlFor="Numero" className="text-sm font-medium font-Roboto ">Numero</label>
                                    <input type="number" defaultValue={ArticleData.subArticle.Numero} disabled={Locked} min={1} max={ArticleData.quantité} id="Numero" placeholder="Numero" name="subarticle-numero" className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[0]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[0] ? <CircleAlert size={16}/>: null }{Error[0] ?? " " }</p>
                                </div>
                        </div>

                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3  w-1/2">
                                    <label htmlFor="Numero de serie" className="text-sm font-medium font-Roboto">Numero de serie</label>
                                    <input type="text" defaultValue={ArticleData.subArticle.Numero_Serie} disabled={Locked} id="Numero de serie" placeholder="Numero de serie" name="subarticle-serie"  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[1]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[1] ? <CircleAlert size={16}/>: null }{Error[1] ?? " " }</p>
                            </div> 
                            <div className="flex flex-col gap-3 flex-start w-1/2">
                                        <label htmlFor="CAB" className="text-sm font-medium font-Roboto">CAB</label>
                                        <input type="text" defaultValue={ArticleData.subArticle.cab} disabled={Locked} id="CAB" placeholder="CAB" name="subarticle-cab"  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[2]?"border-red-500":"")}/>
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[2] ? <CircleAlert size={16}/>: null }{Error[2] ?? " " }</p>
                            </div>
                            
                        </div>

                        <div className="w-full  flex flex-col justify-center items-center gap-8 px-8">
                                <div className="flex flex-col gap-3  w-full">
                                    <label htmlFor="Date" className="text-sm font-medium font-Roboto">date de Creation</label>
                                    <input type="Date" defaultValue={ArticleData.subArticle.date_Livraison.split('T')[0]} disabled={Locked} id="Date" name="date" className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[3]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[3] ? <CircleAlert size={16}/>: null }{Error[3] ?? " " }</p>
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