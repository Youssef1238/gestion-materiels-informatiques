import api from "@/utils/Api"
import { Download } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Pagination from "../Pagination"


export default function Log({EntitéAdminId,Libelle}) {

    const [Logs,setLogs] = useState([])
    const [FilteredLogs,setFilteredLogs] = useState([])
    const Navigate = useNavigate()
    const [Type,setType] = useState(0)
    const [Page, setPage] = useState(1);
    const DateInput = useRef(null)


    const Filter = (date,type)=>{
        let data = Logs
        if(date)
            data = Logs.filter(e=>e.date.split('T')[0] == date)
        data = type == 0? data :
        type == 1 ? data.filter(e=>e.affectation) : data.filter(e=>!e.affectation)
        setType(type)
        setFilteredLogs(data)
        setPage(1)


    }

    useEffect(()=>{
        const fetchData = async ()=>{
            try {
                const res = await api.get(`entiteLog/${EntitéAdminId}`)
                setLogs(res.data)
                setFilteredLogs(res.data)
            } catch (err) {
                if (err.response) {
                    console.error("custom error",err)
                } else {
                    console.error("custom error",err)
                    Navigate('/error')
                }
            } 
        }
        fetchData()
    },[])
    const PageData = (n)=>{
        return FilteredLogs.slice(Page==1?0:Page*n -n , Math.min((Page==1?0:Page*n -n )+ n,FilteredLogs.length))
    }

    const DownloadRapport = async (log)=>{
        try {
            const date = log.date.split('T')[0]
            const res = await api.post(`articleLivre/items`,{
                itemsId : log.articles
            }) 
            console.log(res.data)
            const response = await api.post(`generate`,{
                decharge : log.affectation,
                entiteAdmin : Libelle,
                date : date,
                items : res.data
            }, {
                responseType: 'blob',  
            })
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', (log.affectation?'Decharge_':'Reprise_')+Libelle+'_'+date+'.docx'); 
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            if (err.response) {
                console.error("custom error",err)
            } else {
                console.error("custom error",err)
                Navigate('/error')
            }
        } 
    }   
return (
    <div className="w-full flex flex-col px-4 py-12">
        <div className="w-full py-6 flex items-center justify-between gap-4">
            <div className="flex justify-center items-center gap-2">
                <button onClick={()=>Filter(DateInput.current.value,0)} className={"border border-amber-400 " + (Type == 0?"bg-amber-300":"")}>All</button>
                <button onClick={()=>Filter(DateInput.current.value,1)} className={"border border-amber-400 " + (Type == 1?"bg-amber-300":"")}>Affectations</button>
                <button onClick={()=>Filter(DateInput.current.value,2)} className={"border border-amber-400 " + (Type == 2?"bg-amber-300":"")}>Récuperations</button>
            </div>
            <input
                type="date"
                id="date"
                name="date"
                required
                className="border rounded px-8 py-2"
                ref={DateInput}
                onChange={(e)=>Filter(e.target.value,Type)}
            />
        </div>
        <div className="w-full min-h-screen flex flex-col items-center gap-2 p-2 bg-gray-50 border-t-2 border-gray-200 shadow-sm ">
            {
                FilteredLogs && FilteredLogs.length !== 0 ?
                PageData(12).map((e,i)=>{
                    return <div key={i}
                    className="py-4 px-2 w-full border-l-4  border-amber-400 bg-white shadow-sm shadow-amber-300 flex gap-6 items-center justify-between "
                    >
                        <span className="text-xl font-Montserrat font-semibold">{e.date.split('T')[0]}</span>
                        <span className="text-lg font-Montserrat font-light">{e.affectation?"affectation " : "recuperation "}de {e.articles?.length} article{'(s)'}</span>
                        <button 
                        onClick={()=>DownloadRapport(e)}
                        className="px-8 py-2 shadow-sm bg-amber-600 text-white  rounded-md hover:shadow-md hover:shadow-amber-300 transition-shadow flex justify-center items-center gap-2"
                        >
                            <span className="rounded-sm bg-gray-100 flex justify-center items-center p-1"><Download color="#d97706"  size={12}/></span>
                            Rapport
                        </button>
                    </div>
                }) 
                :
                <div className="w-full py-16 flex justify-center">
                    <span className="text-xl font-Montserrat font-semibold">Aucun Log.</span>
                </div>
            }
            <Pagination page={Page} pages={Math.ceil(FilteredLogs.length / 12)} setPage={setPage}/>
        </div>
    </div>
    
)



}