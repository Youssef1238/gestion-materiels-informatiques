import Layout from "@/Components/layout/layout";
import api from "@/utils/Api";
import { ArrowDownNarrowWide, LayoutGrid, PlusIcon, RefreshCcw, SearchIcon, Settings2, TableIcon} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useRef, useState } from "react";
import  {useAuth}  from "../auth/authContext"
import {jwtDecode} from 'jwt-decode';
import Filters from "@/Components/Filters";
import Sortfields from "@/Components/SortFields";
import Forms from "@/Components/modals/Forms";
import Card from "@/Components/Tabs/Card";
import Table from "@/Components/Tabs/Tables";
import { useNavigate } from "react-router-dom";
import getEntityInfo from "@/lib/Entity";
import Pagination from "@/Components/Pagination";
import { ExcelIcon } from "@/assets/Icons";
import ExcelHandling from "@/Components/modals/ExcelHandling";

export default function Manage() {
    document.title = "Gérer"
    const { AccessToken } = useAuth();
    const decoded = jwtDecode(AccessToken);
    const isAdmin = decoded.isAdmin;
    const {placeholder, icons , apiRoute , searchFunc, entityClasses} = getEntityInfo(isAdmin)
    const [Entity, setEntity] = useState("Marché");
    const [data,setData] = useState([])
    const [filteredData,setFilteredData] = useState([])
    const [sortedData,setSortedData] = useState([])
    const [formData,setFormData] = useState([])
    const [Error,setError] = useState(false)
    const [isLoading,setIsLoading] = useState(false)
    const [changed,setChanged] = useState(false)
    const Navigate = useNavigate()
    const [isTable, setIsTable] = useState(false);
    const [isFormOpen , setIsFormOpen] = useState(false);
    const [isFilterOpen , setIsFilterOpen] = useState(false);
    const [formType, setFormType] = useState(null);
    const [isAscending, setIsAscending] = useState(false);
    const [sortCol, setSortCol] = useState('');
    const [Page, setPage] = useState(1);
    const QueryInput= useRef(null)
    const [ExcelEvent, setExcelEvent] = useState(null);
    const ExcelInput = useRef();
    
    const fetchData = async (Entity)=>{
            try{
                setIsLoading(true)
                const res = await api.get(`${apiRoute[Entity]}`)
                setData(res.data)
                setFilteredData(res.data)
                setSortedData(res.data)
                setError(false)
            }catch(err){
                if (err.response) {
                    setError(true)
                    console.log(err)
                } else {
                    Navigate('/error')
                }
            }finally{
                setIsLoading(false)
            }
    }
    useEffect(()=>{
        fetchData(Entity)
        if(!isFormOpen) document.body.style.overflow = '';
    },[changed , Entity , isFormOpen])

    const closeForm = async () => {
        
        setSortCol('')
        setIsAscending(false)
        document.body.style.overflow = '';
        setIsFormOpen(false);
        setFormType(null);
        
    }
    const closeExcel = async ()=>{
        await fetchData(Entity);
        setExcelEvent(null)
        ExcelInput.current.value = ""

    }

    const changeEntity = async (value) => {
        await fetchData(value);
        setPage(1)
        setSortCol('')
        setEntity(value);
        setIsFormOpen(false);
        setFormType(null);
        setExcelEvent(null)
        
    }
    const Shortcuts = (e)=>{
        if(e.key == "r" && e.target.tagName !== 'INPUT' &&  !["Compte","Entité Admin.","Type de matériel"].includes(Entity))
            setIsTable(t=>!t);
        
    }
    const openForm = (data)=>{
        document.body.style.overflow = 'hidden';
        if(formType != "add")
            setFormData(data)
        setIsFormOpen(true)
    }
    const resetSort = ()=> {
        setSortedData(filteredData)
        setSortCol('')
        setIsAscending(false) 
        setPage(1)
    }
    const reverseData = ()=>{
        const Rdata = Array.from(sortedData).reverse()
        setSortedData(Rdata)
        setIsAscending(a=>!a) 
        setPage(1)
    }
    const sortData = (col,_data)=>{
        var Sdata = _data?? filteredData
        if(col){
            const type = typeof(data[0][col])
            Sdata = type == 'string' ? Array.from(Sdata).sort((a, b) => a[col].localeCompare(b[col])) :
            Array.from(Sdata).sort((a, b) => a[col] - b[col]);
            setSortedData(Sdata)
            setSortCol(col)
            setPage(1)
        }else
            setSortedData(Sdata)

        
        
    }
    const FilterData = (data)=>{
        setFilteredData(data)
        sortData(sortCol,data)
        setPage(1)
    }
    const PageData = (n)=>{
        return sortedData.slice(Page==1?0:Page*n -n , Math.min((Page==1?0:Page*n -n )+ n,sortedData.length))
    }
    const search = ()=>{
        const query = QueryInput.current.value;
        FilterData(searchFunc[Entity](data,query ))
    }

    return (        
    <Layout>
        { isFormOpen && formType && <Forms type={formType} data={formData}  entity={Entity} onClose={closeForm} /> }
        { ExcelEvent && <ExcelHandling e={ExcelEvent}  Entity={Entity} onClose={closeExcel} /> }
        <div className="flex flex-col w-full min-h-screen focus:outline-none" tabIndex={0}  onKeyDown={(e)=>Shortcuts(e)} id="manage-main">
            
            <div className="w-full py-8 px-8 flex justify-around items-center" id="manage-header" >
                <div className="relative w-1/2">
                    <input type="text" name="query" id="query" 
                    className={`text-black text-sm w-full rounded-full outline-dark border-2  ${entityClasses[Entity].border} shadow-md bg-white px-12 py-3`}
                    placeholder={Entity ? placeholder[Entity] : "Rechercher..."}
                    ref={QueryInput}
                    onKeyDown={(e)=>{if(e.key == "Enter") search()}}
                    />
                    <button onClick={search} className={"px-6 absolute rounded-full top-0 right-0 h-full bg-gradient-to-tr " +entityClasses[Entity].gradient+" text-gray-50  hover:opacity-75"}><SearchIcon /></button>
                    
                    <div className=" h-full w-fit absolute top-0 right-20">
                        <Select value={Entity} onValueChange={(value) => changeEntity(value)}>
                            <SelectTrigger className="w-fit text-sm h-full  border-0 shadow-none">
                                <SelectValue placeholder="Entité" />
                            </SelectTrigger>
                            <SelectContent className="w-[200px] p-0 m-0" >
                                {Object.keys(placeholder).map((key) => (
                                    <SelectItem key={key} className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-sm p-4" value={key}>
                                        {key}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex gap-16 items-center justify-center">
                    <button 
                        className={"w-[200px] px-10 py-4 "+entityClasses[Entity].bg+"  text-gray-50 cursor-default  disabled:bg-gray-300 disabled:text-gray-50  rounded-full text-sm relative"} disabled={Entity == "Article"}
                    >
                        <div disabled={Entity == "Article"} onClick={()=> {setFormType("add");openForm()}} className={"h-full cursor-pointer flex justify-center items-center px-8 absolute top-1/2 left-0 rounded-l-full "+entityClasses[Entity].shadow +" hover:shadow-md transition-shadow -translate-x-1/2 -translate-y-1/2 " + (Entity == "Article"?"bg-gray-300" : entityClasses[Entity].bg)}>
                                {Entity != "Article" && <PlusIcon  size={24} /> }
                        </div>
                        {Entity=="Type de matériel"?"Type":Entity}
                        
                        <input disabled={Entity == "Article" || Entity == "Compte"} type="file" accept=".xlsx, .xls" className="hidden " id="excelInput" onChange={setExcelEvent} ref={ExcelInput}/>
                        <label disabled={Entity == "Article" || Entity == "Compte"} htmlFor="excelInput" className={" h-full flex justify-center items-center px-8 absolute top-1/2 right-0 rounded-r-full shadow-primary  translate-x-1/2 -translate-y-1/2 " + (Entity == "Article"?"bg-gray-300" : entityClasses[Entity].bg) + (Entity != "Compte"?" cursor-pointer hover:shadow-md "+entityClasses[Entity].shadow + " transition-shadow":"")}>
                               
                            {Entity != "Article" && Entity != "Compte" &&  <ExcelIcon/>}
                        </label>
                    </button>
                    <button className={"relative w-48 px-24 py-4  text-sm rounded-full border-2 flex items-center  border-primary text-gray-400 disabled:border-gray-500 " + (!isTable ? "justify-start":"justify-end") }
                        onClick={() => setIsTable(!isTable)}
                        disabled={["Compte","Entité Admin.","Type de matériel"].includes(Entity)}
                    >
                        <div className={"absolute top-0 h-full px-8 flex justify-center items-center  "+(isTable ? "  right-0":"  left-0")}>
                            {isTable || ["Compte","Entité Admin.","Type de matériel"].includes(Entity)  ? <TableIcon size={24} color="#000"/> : <LayoutGrid size={24} color="#000"/>}
                        </div>
                        {isTable || ["Compte","Entité Admin.","Type de matériel"].includes(Entity) ? "Tableau" : "Cartes"}
                    </button>
                </div>
            </div>
            <div className="w-full py-8 px-16 flex justify-between items-center bg-gray-50" id="filter-header">
                    
                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <PopoverTrigger className="flex gap-4 text-sm items-center bg-white disabled:bg-gray-300 disabled:text-gray-50"
                        onClick={() => setIsFilterOpen(true)}
                        disabled={["Entité Admin.","Type de matériel","Fournisseur"].includes(Entity)}
                    >
                        Filtrer <Settings2 size={24}/>
                    </PopoverTrigger>
                    {   ["Entité Admin.","Type de matériel","Fournisseur"].includes(Entity) ?
                        null :
                        <Filters  entity={Entity} setIsOpen={setIsFilterOpen} data={data} FilterData={(d)=>FilterData(d)}/>
                        
                    }
                </Popover>
                
                <div className="w-fit h-full  flex items-center justify-center gap-2">
                    <Sortfields  entity={Entity} sortData={(col)=>sortData(col)} sortCol={sortCol}/>
                    <button className="px-4 py-2"
                        onClick={()=>reverseData()}
                    >
                        {
                            !isAscending ? <ArrowDownNarrowWide size={24} color="#000"/> : <ArrowDownNarrowWide size={24} color="#000" className="rotate-180"/>
                        }
                    </button>
                    <button className="px-4 py-2"
                        onClick={()=>resetSort()}
                    >
                        <RefreshCcw size={24} color="#000"/>
                    </button>
                </div>  
                
            </div>
            
            <div className="w-full flex justify-between items-center  px-8 py-8">
                <div className="w-full flex gap-4 items-center justify-start ">
                    {icons[Entity]}
                    <h2 className="text-2xl font-semibold font-Montserrat">{Entity}</h2>
                </div>
                {
                    sortedData.length > 0 &&
                    <h2 className="text-2xl font-light font-Montserrat text-nowrap">Page {Page} / {Math.ceil(sortedData.length / 12)}</h2>
                }
            </div>
            
                {   
                    isLoading ?
                    <div className="w-full h-screen flex justify-center">
                        <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.364A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3.93-1.574z"></path>
                        </svg>
                    </div>
                    :
                    Error?
                    <div className="w-full h-screen flex flex-col items-center   gap-8">
                        
                        <h1 className="text-xl text-red-400 font-Montserrat">Probléme de Connexion</h1>
                        <button onClick={()=>setChanged(c=>!c)} className="bg-red-500 text-white hover:scale-105 transition-all"><RefreshCcw/></button>
                    
                    </div>
                    :
                    <div className="w-full">
                        <div className={"w-full grow " + (isTable || ["Compte","Entité Admin.","Type de matériel"].includes(Entity)?"":"grid grid-cols-4 gap-8 py-12 px-8")} id="manage-content">
                        {isTable || ["Compte","Entité Admin.","Type de matériel"].includes(Entity) ?
                        <Table entity={Entity} data={PageData(12)} setChanged={setChanged} onDetail={(data)=>{setFormType('detail');openForm(data)}}/>
                        :
                        PageData(12).map((item, index) => (
                            <Card key={index} entity={Entity} data={item} setChanged={setChanged} onDetail={(data)=>{setFormType('detail');openForm(data)}}/>
                        ))}
                        
                        </div>
                        <Pagination page={Page} pages={Math.ceil(sortedData.length / 12)} setPage={setPage}/>
                    </div>
                }
                
            
        </div>
    </Layout>
    )
}