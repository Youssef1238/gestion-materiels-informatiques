import Layout from "@/Components/layout/layout";
import { ArrowDownNarrowWide, BoxIcon, BoxSelectIcon, Building2, Handshake, LayoutGrid, PlusIcon, SearchIcon, Settings2, StoreIcon, TableIcon, TagIcon, User2 } from "lucide-react";
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
import { useState } from "react";
import  {useAuth}  from "../auth/authContext"
import {jwtDecode} from 'jwt-decode';
import Filters from "@/Components/Filters";
import Sortfields from "@/Components/SortFields";
import Forms from "@/Components/Forms";
import Card from "@/Components/Card";
import Table from "@/Components/Tables";

export default function Manage() {
    const { AccessToken } = useAuth();
    const decoded = jwtDecode(AccessToken);
    const isAdmin = decoded.isAdmin;
    const [Entity, setEntity] = useState("Marché");
    const [isTable, setIsTable] = useState(false);
    const [isFormOpen , setIsFormOpen] = useState(false);
    const [isFilterOpen , setIsFilterOpen] = useState(false);
    const [formType, setFormType] = useState(null);
    const [isAscending, setIsAscending] = useState(false);
    const placeholder = {
        "Marché": "Entrer la référence de marché",
        "Entité Admin.": "Entrer le nom de l'entité",
        "Article": "Entrer le serial nombre de l'article",
        "Fournisseur": "Entrer le nom du fournisseur",
        "Type de matériel": "Entrer le type de matériel", 
        ...(isAdmin && { "Compte": "Entrer le nom de l'utilisateur" })
    } 
    const icons = {
        "Marché": <StoreIcon size={32} color="#818cf8"/>,
        "Entité Admin.": <Building2 size={32} color="#22c55e"/>,
        "Article": <BoxIcon size={32} color="#06b6d4"/>,
        "Fournisseur": <Handshake size={32} color="#f59e0b" />,
        "Type de matériel": <TagIcon size={32} color="#a855f7"/>, 
        ...(isAdmin && { "Compte": <User2 size={32} color="#f43f5e"/> })
    } 
    const closeForm = () => {
        document.body.style.overflow = '';
        setIsFormOpen(false);
        setFormType(null);
    }
    const changeEntity = (value) => {
        setEntity(value);
        setIsFormOpen(false);
        setFormType(null);
    }
    const Shortcuts = (e)=>{
        console.log(e.key)
        if(e.key == "r" &&  !["Compte","Entité Admin.","Type de matériel"].includes(Entity))
            setIsTable(t=>!t);
        
    }
    const openForm = ()=>{
        document.body.style.overflow = 'hidden';
        setIsFormOpen(true)
    }

    return (        
    <Layout>
        { isFormOpen && formType && <Forms type={formType} entity={Entity} onClose={closeForm} /> }
        <div className="flex flex-col w-full min-h-screen focus:outline-none" tabIndex={0}  onKeyDown={(e)=>Shortcuts(e)} id="manage-main">
            
            <div className="w-full py-8 px-8 flex justify-around items-center" id="manage-header" >
                <div className="relative w-1/2">
                    <input type="text" name="query" id="query" 
                    className="text-black text-sm rounded-full w-full outline-dark border-2 border-primary bg-white px-12 py-3"
                    placeholder={Entity ? placeholder[Entity] : "Rechercher..."}
                    />
                    <button className="px-6 absolute top-0 right-0 h-full bg-primary text-gray-50 rounded-full hover:opacity-75"><SearchIcon /></button>
                    
                    <div className="rounded-full h-full w-fit absolute top-0 right-20">
                        <Select value={Entity} onValueChange={(value) => changeEntity(value)}>
                            <SelectTrigger className="w-[240px] text-sm rounded-full h-full border-0 shadow-none">
                                <SelectValue placeholder="Entité" />
                            </SelectTrigger>
                            <SelectContent className="w-[240px] p-0 m-0" >
                                {Object.keys(placeholder).map((key) => (
                                    <SelectItem key={key} className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-sm p-4" value={key}>
                                        {key}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex gap-8 items-center justify-center">
                    <button onClick={()=> {setFormType("add");openForm()}}
                        className="w-[250px] px-10 py-4 bg-primary text-gray-50 hover:bg-dark disabled:bg-gray-300 disabled:text-gray-50  rounded-full text-sm relative" disabled={Entity == "Article"}
                    >
                        <PlusIcon size={24} className="absolute top-1/2 left-8 -translate-x-1/2 -translate-y-1/2"/> {Entity=="Type de matériel"?"Type":Entity}
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
                        disabled={["Entité Admin.","Type de matériel"].includes(Entity)}
                    >
                        Filter <Settings2 size={24}/>
                    </PopoverTrigger>
                    {   ["Entité Admin.","Type de matériel"].includes(Entity) ?
                        null :
                        <Filters  entity={Entity} setIsOpen={setIsFilterOpen}/>}
                </Popover>
                <div className="w-fit h-full  flex items-center justify-center gap-2">
                    <Select>
                        <SelectTrigger className="w-fit px-4 py-2 text-sm h-full border-0 shadow-sm">
                            <SelectValue placeholder="Sort by"/>
                        </SelectTrigger>
                        <Sortfields  entity={Entity}/>
                    </Select>
                    <button className="px-4 py-2"
                        onClick={()=>setIsAscending(!isAscending)}
                    >
                        {
                            !isAscending ? <ArrowDownNarrowWide size={24} color="#000"/> : <ArrowDownNarrowWide size={24} color="#000" className="rotate-180"/>
                        }
                    </button>
                </div>  
                
            </div>
            
            <div className="w-full flex gap-4 items-center justify-start px-8 py-8">
                {icons[Entity]}
                <h2 className="text-2xl font-semibold font-Montserrat">{Entity}</h2>
            </div>
            <div className={"w-full grow " + (isTable || ["Compte","Entité Admin.","Type de matériel"].includes(Entity)?"":"grid grid-cols-4 gap-8 py-12 px-8")} id="manage-content">
                {   isTable || ["Compte","Entité Admin.","Type de matériel"].includes(Entity) ?
                    <Table entity={Entity} onEdit={()=>{setFormType('detail');openForm()}} onDelete={() => {}} onDetail={()=>{setFormType('detail');openForm()}}/>
                    :
                    Array(12).fill(0).map((_, index) => (
                        <Card key={index} entity={Entity} data={[]}  onDelete={() => {}} onDetail={()=>{setFormType('detail');openForm()}}/>
                    ))
                }
                
            </div>
        </div>
    </Layout>
    )
}