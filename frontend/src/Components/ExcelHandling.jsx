import * as XLSX from'xlsx'
import SubmitExcelType from '../lib/Excel/Type'
import SubmitExcelMarché from '../lib/Excel/Marché'
import SubmitExcelFournisseur from '../lib/Excel/Fournisseur'
import SubmitExcelEntitéAdmin from '../lib/Excel/EntitéAdmin'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowRight, Circle } from 'lucide-react'
import getEntityInfo from '@/lib/Entity'
export default function ExcelHandling({e, Entity  , onClose }){
        const Navigate = useNavigate()
        const [ExcelResult,setExcelResult] = useState([0,0])
        const [Errors,setErrors] = useState({})
        const [Current,setCurrent] = useState(0)
        const [isCompatible,setIsCompatible] = useState(true)
        const [Entities,setEntities] = useState([])
        const {ExcelHeaders} = getEntityInfo()

        const handleFunc = {
            "Marché": (row)=>SubmitExcelMarché(row,setExcelResult,setErrors),
            "Entité Admin.": (row)=>SubmitExcelEntitéAdmin(row,setExcelResult,setErrors),
            "Fournisseur": (row)=>SubmitExcelFournisseur(row,setExcelResult,setErrors),
            "Type de matériel": (row)=>SubmitExcelType(row,setExcelResult,setErrors), 
        }
        useEffect(()=>{
            const load = ()=>{
                
                setExcelResult([0,0])
                const reader = new FileReader()
                reader.readAsArrayBuffer(e.target.files[0])
                reader.onload = (e)=>{
                    const data = e.target.result
                    const workbook = XLSX.read(data, { type: "array" })
                    const sheet = workbook.Sheets[workbook.SheetNames[0]]
                    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })
                    const headers = rows[0] || []
                    const expectedKeys = ExcelHeaders[Entity]
                    const headersMatch = expectedKeys.every(key => headers.includes(key))
                    if (!headersMatch) {
                        setIsCompatible(false)
                        return
                    }

                    // Remove header row and set entities
                    setEntities(XLSX.utils.sheet_to_json(sheet))
                }
            }
            load()
            
        },[])
        useEffect(()=>{
            const handle = async ()=>{
                Entities?.forEach(async (row)=>{
                    try {
                        await handleFunc[Entity](row)
                        setCurrent(c=>c+1)
                            
                    } catch (error) {
                        console.error(error)
                        Navigate('/error')
                    }
                })
                
            }
            handle()
            
        },[Entities])
        
        
        const handleBackdropClick = (event) => {
            if (event.target === event.currentTarget) {
                onClose();
            }
        };

        return (
            <div onClick={handleBackdropClick} className="fixed inset-0 z-30 w-full min-h-screen flex py-12 justify-center bg-black bg-opacity-50">
            {
            isCompatible ?
            <div className='w-1/2 rounded-md h-fit max-h-full bg-white flex flex-col justify-center py-12 gap-8'>
                <h1 className="text-lg font-Montserrat text-center">{Current == Entities.length ? "Importation est fini." : "Importation en cours"}</h1>
                <div className="rounded-md py-6 px-4 flex flex-col gap-6">
                <progress value={Current} max={Entities.length} className='custom-progress'></progress>
                </div>
                <div className="flex justify-between px-4">
                <span className="text-xs flex items-center font-light gap-2"><Circle fill='#22c55e' size={16} color='#22c55e'/> {ExcelResult[0] + ' / ' + Entities.length}</span>
                <span className="text-xs flex items-center font-light gap-2"><Circle size={16} color='#ef4444' fill='#ef4444'/> {ExcelResult[1] + ' / ' + Entities.length}</span>
                </div>
                {
                Errors && Object.keys(Errors).length > 0 &&
                <div className='py-6 px-4 flex flex-col gap-2 overflow-y-scroll max-h-64'>
                    {
                    Object.entries(Errors).map(([key, value], i) => (
                        <details key={i} className='w-full rounded-md p-2 flex flex-col justify-start gap-2 bg-red-200 items-start transition-all'>
                        <summary className='cursor-pointer text-sm font-semibold'>{key}</summary>
                        <ul className='list-disc list-inside pl-4 text-xs font-Montserrat font-md'>
                            {Array.isArray(value) && value.length > 0 ? (
                            value.map((err, idx) => (
                                <li key={idx}>{err}</li>
                            ))
                            ) : (
                            <li>{value}</li>
                            )}
                        </ul>
                        </details>
                    ))
                    }
                </div>
                }
            </div>
            :
            <div className='w-1/2 rounded-md min-h-full  bg-white flex flex-col items-center justify-center py-12 px-4 gap-8'>
                <div className="rounded-md py-6 px-4 bg-red-200 flex flex-col  items-center">
                <h1 className='text-2xl font-Montserrat text-center font-light'>Les colonnes sont Incompatibles avec l'entité</h1>
                <span className='text-xl font-Montserrat font-semibold'>{Entity}</span>
                </div>
                <div className="w-full flex justify-center items-center gap-2">
                Consulter le Manuelle 
                <button className='text-black hover:text-secondary shadow-none'><ArrowRight/></button>
                </div>
            </div>
            }
            </div>
        )
        

}
