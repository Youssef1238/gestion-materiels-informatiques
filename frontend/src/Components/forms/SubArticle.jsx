import { CircleAlert} from "lucide-react";
import { useState } from "react";
import api from "../../utils/Api";
import { useNavigate } from "react-router-dom";
import FormLayout from "../layout/FormLayout";



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
        const errorNumber = data["subarticle-numero"] && regex2.test(data["subarticle-numero"].trim())?number <= 0 || number > ArticleData.quantite ?"Numero Invalid":"":"caractère Invalid !"
        const errorSerie = data["subarticle-serie"].trim() == "" ?"Obligatoire":regex1.test(data["subarticle-serie"].trim())?"":"caractère Invalid !"
        const errorCAB = data["subarticle-cab"].trim() == ""?"Obligatoire":regex1.test(data["subarticle-cab"].trim())?"":"caractère Invalid !"
        
        
        const error = errorSerie + errorCAB + errorDate + errorNumber

        setError([errorNumber,errorSerie,errorCAB,errorDate])
        if(error == ""){
            try {
                await api.post('articleLivre',{
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
                    
                    <FormLayout onClose={onClose} onSubmit={handleSubmit} onReset={()=>setError([])}
                    Title={"Ajouter un Article Livré"}  Type={"add"} >
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

                        
                    </FormLayout>
                                   
               
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
        const errorNumber = data["subarticle-numero"] && regex2.test(data["subarticle-numero"].trim())?number <= 0 || number > ArticleData.quantité ?"Numero Invalid":"":"caractère Invalid !"
        const errorSerie = data["subarticle-serie"].trim() == "" ?"Obligatoire":regex1.test(data["subarticle-serie"].trim())?"":"caractère Invalid !"
        const errorCAB = data["subarticle-cab"].trim() == ""?"Obligatoire":regex1.test(data["subarticle-cab"].trim())?"":"caractère Invalid !"
        
        
        const error = errorSerie + errorCAB + errorDate + errorNumber

        setError([errorNumber,errorSerie,errorCAB,errorDate])
        if(error == ""){
            try {
                await api.put('articleLivre',{
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
                    
                    <FormLayout onClose={onClose} onSubmit={handleSubmit} onReset={()=>setError([])}
                    Title={"Modifier l'Article Livré"} Locked={Locked} Type={"detail"} setLocked={setLocked}>
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

                        
                    </FormLayout>
                                   
               
            );
}