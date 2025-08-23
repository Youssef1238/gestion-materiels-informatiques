import { CircleAlert, Lock, RotateCcw, Unlock, UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../utils/Api";
import { useNavigate } from "react-router-dom";
import MySelect from "../ui/MySelect";
import {
  SelectItem,
} from "@/components/ui/select"



export default function ArticleForm({ type, onClose, data}) {
            
            switch(type) {
                case 'add':   
                    return <AddArticleForm onClose={onClose} ArticleData={data}/>;
                case 'detail':
                    return <DetailArticleForm onClose={onClose} Article={data}/>;
                default:
                    return null;
                
            }

}


const AddArticleForm = ({onClose , ArticleData}) => {
    // Numero , Type , Marque , Desc , Qte , Pre, Pru 
    const [Error,setError] = useState(["","","","","","",""])
    const Navigate = useNavigate()
    const [selectValue,setselectValue] = useState("")
    const [types,setTypes] = useState([])
    useEffect(()=>{
        const fetch =  async ()=>{
            try{
                const res = await api.get(`http://localhost:5500/type`)
                setTypes(res.data)
            }catch(err){
                Navigate('/error')
            }
        }
        fetch()
    },[])
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        const regex1 = /^[a-zA-Z0-9 ]+$/;
        const regex2 = /^[0-9]+$/;
        const number = Number(data["article-numero"])
        console.log(selectValue)
        const errorNum = data["article-numero"].trim() == ""?"Numero est Obligatoire":
        regex2.test(data["article-numero"])?
        !ArticleData.Articles.map(e=>e.Numero).includes(number)?
        number <= 0 ?"Doit être > 0":
        "":
        "Ce nombre est déjà utilisé!":
        "Numero (Nombre) est Obligatoire"
        const errorMarque = data["article-marque"].trim() == ""?"Marque est Obligatoire":regex1.test(data["article-marque"])?"":"juste a-z A-Z sont accepté"
        const errorDesc = data["article-description"].trim() == ""?"Description est Obligatoire":regex1.test(data["article-description"])?"":"juste a-z A-Z sont accepté pour"
        const errorQte = data["article-quantité"].trim() == ""?"Quantité est Obligatoire":regex2.test(data["article-quantité"])?"":"Doit être un nombre > 0"
        const errorPre = data["article-pre"].trim() == ""?"Prix estimatif est Obligatoire":regex2.test(data["article-pre"])?"":"Doit être un nombre > 0"
        const errorPru = data["article-pru"].trim() == ""?"Prix unitaire est Obligatoire":regex2.test(data["article-pru"])?"":"Doit être un nombre > 0"
        const errorType = selectValue.trim() == ""?"Type est Obligatoire":""
        
        const error = errorNum  + errorType + errorMarque + errorDesc + errorQte + errorPre + errorPru 


        setError([errorNum,errorType,errorMarque,errorDesc,errorQte,errorPre,errorPru])
        if(error == ""){
            try {
                await api.post('http://localhost:5500/articleMarche',{
                    marche_id : ArticleData.marche_id,
                    Numero : data["article-numero"],
                    type_id : selectValue,
                    marque : data["article-marque"].trim(),
                    description : data["article-description"].trim(),
                    quantite : data["article-quantité"],
                    prix_estimatif : data["article-pre"],
                    prix_unitaire : data["article-pru"],
                    prix_totale : data["article-pru"] * data["article-quantité"]
                })
                onClose();
            } catch(err){
                console.error(err)
                if (err.response) {
                    let FilteredError = Error
                    FilteredError[err.response.data.includes("Numero") ? 0 : 1] = err.response.data
                    setError(FilteredError)
                } else {
                    Navigate('/error')
                } 
            }
            
        }
    }
            return (
                
                    <form onSubmit={handleSubmit} onReset={()=>{{setError([]) ; setselectValue(null)}}}  className="bg-white w-1/2  h-fit rounded-md shadow-md flex flex-col items-center gap-2">
                        <div className="w-full py-4 flex justify-center items-center bg-gray-800 rounded-t-md">
                            <h2 className="text-2xl font-bold font-Montserrat text-white">Ajouter un Article</h2>
                        </div>

                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3   w-1/2">
                                    <label htmlFor="article-numero" className="text-sm font-medium font-Roboto">Numero</label>
                                    <input type="number" min={1} id="article-numero" placeholder="Numero" name="article-numero"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[0]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[0] ? <CircleAlert size={16}/>: null }{Error[0] ?? " " }</p>
                            </div>
                            <div className="flex flex-col gap-3 w-1/2">
                                    <label htmlFor="article-marque" className="text-sm font-medium font-Roboto">Marque</label>
                                    <input type="text" id="article-marque" placeholder="Marque" name="article-marque"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[2]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[2] ? <CircleAlert size={16}/>: null }{Error[2] ?? " " }</p>
                            </div>
                             
                        </div>
                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3 w-full">
                                    <label htmlFor="article-description" className="text-sm font-medium font-Roboto">Description</label>
                                    <textarea  id="article-description" placeholder="Description" name="article-description"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[3]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[3] ? <CircleAlert size={16}/>: null }{Error[3] ?? " " }</p>
                            </div> 
                        </div>
                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3 w-full">
                                    <label htmlFor="Type" className="text-sm font-medium font-Roboto">Type</label>
                                    <MySelect placeholder={"Type"} 
                                    width={"w-full"}
                                    value={selectValue} onValueChange={setselectValue}
                                    >
                                        {
                                            Array.from(types).map((e,i)=>{
                                                return <SelectItem value={e._id} key={i}  className={" bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-xs p-4 " + (Error[1]?"border-red-500":"")} >
                                                {e.libelle} 
                                                </SelectItem>
                                            })
                                        }
                                        
                                    </MySelect>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[1] ? <CircleAlert size={16}/>: null }{Error[1] ?? " " }</p>
                            </div>
                        </div>
                        
                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3   w-1/3">
                                    <label htmlFor="article-quantité" className="text-sm font-medium font-Roboto">Quantité</label>
                                    <input type="number" min={1} id="article-quantité" placeholder="Quantité" name="article-quantité"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[4]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[4] ? <CircleAlert size={16}/>: null }{Error[4] ?? " " }</p>
                            </div>
                            
                            <div className="flex flex-col gap-3   w-1/3">
                                    <label htmlFor="article-pre" className="text-sm font-medium font-Roboto">Prix estimatif</label>
                                    <input type="text" id="article-pre" placeholder="Prix estimatif" name="article-pre"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[5]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[5] ? <CircleAlert size={16}/>: null }{Error[5] ?? " " }</p>
                            </div>
                            <div className="flex flex-col gap-3   w-1/3">
                                    <label htmlFor="article-pru" className="text-sm font-medium font-Roboto">Prix unitaire</label>
                                    <input type="text" id="article-pru" placeholder="Prix unitaire" name="article-pru"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[6]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[6] ? <CircleAlert size={16}/>: null }{Error[6] ?? " " }</p>
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
const DetailArticleForm = ({onClose , Article}) => {
    // Numero , Type , Marque , Desc , Qte , Pre, Pru 
    const [Error,setError] = useState(["","","","","","",""])
    const Navigate = useNavigate()
    const [Locked,setLocked] = useState(false)
    const [selectValue,setselectValue] = useState(Article.type_id)
    const [types,setTypes] = useState([])
    useEffect(()=>{
        const fetch =  async ()=>{
            try{
                const res = await api.get(`http://localhost:5500/type`)
                setTypes(res.data)
            }catch(err){
                Navigate('/error')
            }
        }
        fetch()
    },[])
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        const regex1 = /^[a-zA-Z0-9 \n]+$/;
        const regex2 = /^[0-9]+$/;
        const number = Number(data["article-numero"])
        const errorNum = data["article-numero"].trim() == ""?"Numero est Obligatoire":
        regex2.test(data["article-numero"].trim())?number <= 0 ?"Doit être > 0":"":"Numero (Nombre) est Obligatoire"
        const errorMarque = data["article-marque"].trim() == ""?"Marque est Obligatoire":regex1.test(data["article-marque"].trim())?"":"juste a-z A-Z sont accepté"
        const errorDesc = data["article-description"].trim() == ""?"Description est Obligatoire":regex1.test(data["article-description"].trim())?"":"juste a-z A-Z sont accepté pour"
        const errorQte = data["article-quantité"].trim() == ""?"Quantité est Obligatoire":regex2.test(data["article-quantité"].trim())?"":"Doit être un nombre > 0"
        const errorPre = data["article-pre"].trim() == ""?"Prix estimatif est Obligatoire":regex2.test(data["article-pre"].trim())?"":"Doit être un nombre > 0"
        const errorPru = data["article-pru"].trim() == ""?"Prix unitaire est Obligatoire":regex2.test(data["article-pru"].trim())?"":"Doit être un nombre > 0"
        const errorType = selectValue.trim() == ""?"Type est Obligatoire":""
        
        const error = errorNum  + errorType + errorMarque + errorDesc + errorQte + errorPre + errorPru 


        setError([errorNum,errorType,errorMarque,errorDesc,errorQte,errorPre,errorPru])
        if(error == ""){
            try {
                await api.put('http://localhost:5500/articleMarche',{
                    id : Article._id,
                    marche_id : Article.marche_id,
                    Numero : data["article-numero"],
                    type_id : selectValue,
                    marque : data["article-marque"].trim(),
                    description : data["article-description"].trim(),
                    quantite : data["article-quantité"].trim(),
                    prix_estimatif : data["article-pre"].trim(),
                    prix_unitaire : data["article-pru"].trim(),
                    prix_totale : data["article-pru"].trim() * data["article-quantité"].trim()
                })
                onClose();
            } catch(err){
                console.error(err)
                if (err.response) {
                    let FilteredError = Error
                    FilteredError[err.response.data.includes("Numero") ? 0 : 1] = err.response.data
                    setError(FilteredError)
                } else {
                    Navigate('/error')
                } 
            }
            
        }
    }
            return (
                
                    <form onSubmit={handleSubmit} onReset={()=>{{setError([]) ; setselectValue(null)}}}  className="bg-white w-1/2  h-fit rounded-md shadow-md flex flex-col items-center gap-2">
                        <div className="w-full px-8 py-4 flex justify-between items-center bg-gray-800 rounded-t-md">
                            <h2 className="text-2xl font-bold font-Montserrat text-white">Modifier l'article</h2>
                            <button type="button" className="text-white hover:scale-105" onClick={()=>setLocked(l=>!l)}>{Locked? <Lock/> : <Unlock/>}</button>
                        </div>

                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3   w-1/2">
                                    <label htmlFor="article-numero" className="text-sm font-medium font-Roboto">Numero</label>
                                    <input type="number" min={1} id="article-numero" defaultValue={Article.Numero} disabled={Locked} placeholder="Numero" name="article-numero"  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[0]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[0] ? <CircleAlert size={16}/>: null }{Error[0] ?? " " }</p>
                            </div>
                            <div className="flex flex-col gap-3 w-1/2">
                                    <label htmlFor="article-marque" className="text-sm font-medium font-Roboto">Marque</label>
                                    <input type="text" id="article-marque" defaultValue={Article.marque} disabled={Locked} placeholder="Marque" name="article-marque"  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[2]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[2] ? <CircleAlert size={16}/>: null }{Error[2] ?? " " }</p>
                            </div>
                             
                        </div>
                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3 w-full">
                                    <label htmlFor="article-description" className="text-sm font-medium font-Roboto">Description</label>
                                    <textarea  id="article-description" defaultValue={Article.description} disabled={Locked} placeholder="Description" name="article-description"  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[3]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[3] ? <CircleAlert size={16}/>: null }{Error[3] ?? " " }</p>
                            </div> 
                        </div>
                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3 w-full">
                                    <label htmlFor="Type" className="text-sm font-medium font-Roboto">Type</label>
                                    <MySelect placeholder={"Type"} 
                                    width={"w-full"}
                                    value={selectValue} onValueChange={setselectValue}  disabled={Locked}
                                    >
                                        {
                                            Array.from(types).map((e,i)=>{
                                                return <SelectItem value={e._id} key={i}  className={" bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-xs p-4 " + (Error[1]?"border-red-500":"")} >
                                                {e.libelle} 
                                                </SelectItem>
                                            })
                                        }
                                        
                                    </MySelect>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[1] ? <CircleAlert size={16}/>: null }{Error[1] ?? " " }</p>
                            </div>
                        </div>
                        
                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3   w-1/3">
                                    <label htmlFor="article-quantité" className="text-sm font-medium font-Roboto">Quantité</label>
                                    <input type="number" min={1} id="article-quantité" disabled={Locked} defaultValue={Article.quantite} placeholder="Quantité" name="article-quantité"  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[4]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[4] ? <CircleAlert size={16}/>: null }{Error[4] ?? " " }</p>
                            </div>
                            
                            <div className="flex flex-col gap-3   w-1/3">
                                    <label htmlFor="article-pre" className="text-sm font-medium font-Roboto">Prix estimatif</label>
                                    <input type="text" id="article-pre" disabled={Locked} defaultValue={Article.prix_estimatif} placeholder="Prix estimatif" name="article-pre"  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[5]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[5] ? <CircleAlert size={16}/>: null }{Error[5] ?? " " }</p>
                            </div>
                            <div className="flex flex-col gap-3   w-1/3">
                                    <label htmlFor="article-pru" className="text-sm font-medium font-Roboto">Prix unitaire</label>
                                    <input type="text" id="article-pru" disabled={Locked} defaultValue={Article.prix_unitaire} placeholder="Prix unitaire" name="article-pru"  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[6]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[6] ? <CircleAlert size={16}/>: null }{Error[6] ?? " " }</p>
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