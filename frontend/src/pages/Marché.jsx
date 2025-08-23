import { ExcelIcon } from "@/assets/Icons";
import ExcelHandling from "@/Components/ExcelHandling";
import Footer from "@/Components/Footer";
import Forms from "@/Components/Forms";
import api from "@/utils/Api";
import { ArrowDownNarrowWide, ArrowLeft, ArrowRight, BoxIcon, Clipboard, Edit2, MoveLeft, PlusIcon, SearchIcon, StoreIcon, Trash2 } from "lucide-react";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useLocation, useNavigate } from "react-router-dom";




export default function Marché() {
    const Navigate = useNavigate();
    const Location = useLocation();
    const { marchéId } = Location.state || {};
    const [isLoading, setIsLoading] = useState(true);
    const [marché, setMarché] = useState(null);
    const [articles, setArticles] = useState(null);
    const [subArticles, setSubArticles] = useState(null);
    const [filteredSubArticles, setFilteredSubArticles] = useState(null);
    const [error, setError] = useState(false);
    const [isDetail,setIsDetail] = useState(false)
    const [isAnimated,setIsAnimated] = useState(false)
    const [currentArticle,setCurrentArticle] = useState()
    const [ExcelEvent, setExcelEvent] = useState(null);
    const ExcelInput = useRef();
    const [isFormOpen , setIsFormOpen] = useState(false);
    const [formInfo,setFormInfo] = useState([])
    const [isAscending,setIsAscending] = useState([false,false])
    const [isDelete,setIsDelete] = useState(null)
    const [isMarchéDelete,setIsMarchéDelete] = useState(false)
    const rowRef = useRef(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(!isFormOpen) document.body.style.overflow = '';
                setIsLoading(true)
                const res = await api.get(`http://localhost:5500/marche/${marchéId}`);
                setMarché(res.data)
                document.title = `Marché - ${res.data.reference}`;
                const resA = await api.get(`http://localhost:5500/articleMarche/marche/${marchéId}`);
                setArticles(Array.from(resA.data).sort((a,b)=> a.Numero - b.Numero))
                setCurrentArticle(resA.data[0]?._id || null) 
                await fetchDetail(resA.data[0]?._id || null)
                setError(false)
            } catch (err) {
                if (err.response) {
                    setError(true)
                    console.error("custom error",err)
                } else {
                    Navigate('/error')
                }
            } finally {
                setIsLoading(false)
            }
        }   
        fetchData();
    }, [marchéId]);
    useEffect(() => {
        if(!isFormOpen){
            fetchArticles()
        } 
    }, [isFormOpen]);
    useEffect(()=>{
        if(isAnimated){
            if(rowRef.current)
                rowRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center' // Positions row in center of viewport
                });
            const endAnimation = setTimeout(()=>{
                setIsAnimated(false)
            },1000)
            return () => clearTimeout(endAnimation);
        }
        
    },[isAnimated])
    const fetchArticles = async () => {
        try {
            const resA = await api.get(`http://localhost:5500/articleMarche/marche/${marchéId}`);
            setArticles(Array.from(resA.data).sort((a,b)=> a.Numero - b.Numero))
            setCurrentArticle(resA.data[0]?._id || null) 
            await fetchDetail(resA.data[0]?._id || null)
            setError(false)
        } catch (err) {
            if (err.response) {
                setError(true)
                console.error(err)
            } else {
                Navigate('/error')
            }
        }  
    }
    const fetchDetail = async (id)=>{
            try {
                if(id){
                    const resSA = await api.get(`http://localhost:5500/articleLivre/${id}`);
                    setSubArticles(Array.from(resSA.data).sort((a,b)=> a.Numero - b.Numero))
                    setFilteredSubArticles(Array.from(resSA.data).sort((a,b)=> a.Numero - b.Numero))
                }
                
            } catch (error) {
                if (error.response) {
                    setError(true)
                    console.error("custom error",error)
                } else {
                    Navigate('/error')
                }
            }
    }
    const changeContent = async (type,val)=>{
        if(val && val != currentArticle){
            await fetchDetail(val)
            setCurrentArticle(val)
        }
        setIsDetail(type)
        setIsDelete(null)
        const contentElement = window.document.getElementById('content');
        if (contentElement) {
            contentElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    const Back = ()=>{
        setIsAnimated(true)
        setIsDetail(false)
        setIsDelete(null)
        
    }
    const openForm = (type , entity , id)=>{
        document.body.style.overflow = 'hidden';
        let formData
        if(entity == "Article")
            formData = type == "add" ? {Articles : articles , marche_id : marchéId} : articles.find(e=>e._id == id)
        else 
            formData = type == "add" ? articles.find(e=>e._id == currentArticle) : {subArticle : subArticles.find(e=>e._id == id) , quantité : articles.find(e=>e._id == currentArticle).quantite} 
        setFormInfo([type,entity,formData])
        setIsFormOpen(true)
    }
    const closeForm = async () => {
        if(formInfo[1] == "Marché"){
            try {
                setIsLoading(true)
                const res = await api.get(`http://localhost:5500/marche/${marchéId}`);
                setMarché(res.data)
            } catch (err) {
                if (err.response) {
                    setError(true)
                    console.error("custom error",err)
                } else {
                    Navigate('/error')
                }
            } finally {
                setIsLoading(false)
            }
        }else{
            setIsAscending(v=>formInfo[1] == "Article" ?[false,v[1]]:[v[0],false])
        }
        
        document.body.style.overflow = '';
        setIsFormOpen(false);
        
    }
    const reverseArticles = ()=>{
        const Rdata = Array.from(articles).reverse()
        setArticles(Rdata)
        setIsAscending(v=>[!v[0],v[1]]) 
    }
    const reverseSubArticles = ()=>{
        const Rdata = Array.from(filteredSubArticles).reverse()
        setFilteredSubArticles(Rdata)
        setIsAscending(v=>[v[0],!v[1]]) 
    }
    const deleteArticle = async (id)=>{
        try {
            await api.delete('http://localhost:5500/articleMarche',{
                    data : {id : id}
            })
            setIsDelete(null)
            await fetchArticles()
        } catch (error) {
            console.error(error)
            Navigate('/error')
        }
    }
    const deleteSubArticle = async (id)=>{
        try {
            await api.delete(`http://localhost:5500/articleLivre`,{
                data : {
                    id : id
                }
            })
            setIsDelete(null)
            await fetchDetail(currentArticle)
        } catch (error) {
            console.error(error)
            Navigate('/error')
        }
    }
    const editMarché = ()=>{
        document.body.style.overflow = 'hidden';
        setFormInfo(["detail","Marché",marché])
        setIsFormOpen(true)
    }
    const deleteMarché = async ()=>{
        try {
            await api.delete('http://localhost:5500/marche',{
                    data : {id : marchéId},              
            })
            Navigate('/Gerer')
        } catch (error) {
            console.error(error)
            Navigate('/error')
        }
    }
    const closeExcel = async ()=>{
        if(!isDetail)
            await fetchArticles();
        else
            await fetchDetail(currentArticle)
        setExcelEvent(null)
        ExcelInput.current.value = ""

    }
    const Filter = (e)=>{
        e.preventDefault()
        const query = Object.fromEntries(new FormData(e.target).entries())["query"];
        const Nsubarticles = !query? Array.from(subArticles) : Array.from(subArticles.filter(e=>e.Numero_Serie.toLowerCase().includes(query.toLowerCase()))) 
        setFilteredSubArticles(isAscending[1]?Nsubarticles.reverse() : Nsubarticles)

    }
    if(isLoading) {
        return (<div className="w-full h-screen flex justify-center">
            <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.364A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3.93-1.574z"></path>
            </svg>
        </div>
        )
        
    }
    if (error) {
        return (
            <div>
                <div className="w-full h-screen flex flex-col items-center justify-center   gap-8">
                    
                    <h1 className="text-xl text-red-400 font-Montserrat">Probléme de Connexion ou le Marché n'existe pas</h1>
                    <button
                    onClick={() => Navigate('/')}
                    className="hover:bg-primary hover:text-white text-2xl text-secondary px-8 py-4 border border-dark focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                    >
                    Home
                    </button> 
                
                </div>
            </div>
        );
    }
    return (
            <div className="w-full min-h-screen flex flex-col items-center gap-16">
                { isFormOpen && <Forms type={formInfo[0]}  entity={formInfo[1]} data={formInfo[2]} onClose={closeForm} /> }
                { ExcelEvent && <ExcelHandling e={ExcelEvent}  Entity={isDetail?"subArticle" : "Article"} onClose={closeExcel} Id={isDetail?currentArticle : marchéId} /> }
                <div className=" w-full flex justify-center items-center relative py-16">
                    <button onClick={() => Navigate(-1)} className="absolute left-1  group rounded-full  px-6 py-2 flex justify-center items-center shadow-none ">
                        <ArrowLeft  size={32}  className="text-indigo-500 group-hover:text-black" />
                    </button>
                    <div className="flex items-center justify-center gap-6">
                        <StoreIcon size={48} color="#818cf8"/>
                        <h1 className="text-4xl font-bold text-gray-800 font-Montserrat">Marché - {marché.reference}</h1>
                    </div>
                    
                </div>
                <div className="w-full flex itmes-center gap-2 px-4">
                    <div className="relative w-1/2 py-2 px-8 bg-gray-100 rounded-md shadow-md shadow-gray-200 flex flex-col justify-start gap-12">
                        <div className="w-full flex justify-between p-2">
                            <div className="flex flex-col justify-center gap-4">
                                <span className="font-Montserrat text-lg font-light"> {marché.type}</span>
                                <span className="text-lg font-semibold">Associé à  
                                    <span className="font-Montserrat text-lg font-light"> {marché.fournisseur.nom}</span>
                                </span>
                                <span className="text-lg font-semibold">Société  
                                    <span className="font-Montserrat text-lg font-light"> {marché.fournisseur.nom_societe}</span>
                                </span>
                                <span className="text-lg font-semibold">de Patente  
                                    <span className="font-Montserrat text-lg font-light"> N° {marché.fournisseur.patente}</span>
                                </span>
                                <span className="text-lg font-semibold">A l'objet de 
                                    <span className="font-Montserrat text-lg font-light"> {marché.objet}</span>
                                </span>
                            </div>
                            <span className="font-Montserrat text-lg font-light"> {marché.date_creation.split('T')[0]}</span>
                            
                        </div>
                        <div className="absolute bottom-1 right-1 flex items-center gap-4"> 
                            <div className="flex items-center gap-2">
                                <button onClick={()=>editMarché()} className="px-8 py-2 shadow-sm bg-indigo-400 text-white  rounded-md hover:shadow-md hover:shadow-indigo-300 transition-shadow flex justify-center items-center gap-2">
                                    <span className="rounded-sm bg-gray-100 flex justify-center items-center p-1"><Edit2 color="#a5b4fc"  size={12}/></span>
                                    Modifier
                                </button>
                                <button onClick={()=>setIsMarchéDelete(true)} className="px-8 py-2 shadow-sm bg-red-400 text-white  rounded-md hover:shadow-md hover:shadow-red-300 transition-shadow flex justify-center items-center gap-2">
                                    <span className="rounded-sm bg-gray-100 flex justify-center items-center p-1"><Trash2 color="#f87171"  size={12}/></span>
                                    Supprimer
                                </button>
                                
                            </div>
                        </div>
                        {
                            isMarchéDelete?
                            <div className="absolute bg-white left-0 right-0 top-0 bottom-0 flex flex-col justify-around items-center gap-2 p-2 z-10 shadow-lg rounded-md">
                                <h1 className="font-light bg-white text-lg text-gray-700 text-center max-w-[50%]">Toutes les données et relations liées à ce Marché seront également supprimées !<br/> Êtes-vous sûr de vouloir continuer ?</h1>
                                <div className="flex gap-2 ">
                                    <button onClick={()=>deleteMarché()} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Confirmer</button>
                                    <button onClick={()=>setIsMarchéDelete(false)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">Annuler</button>
                                </div>
                            </div>
                            :
                            null
                        }
                    </div>
                    <div className="w-1/2 py-2  px-8 bg-gray-100  rounded-md shadow-md shadow-gray-200 flex flex-col justify-center gap-12">
                        <div className="flex flex-col py-2 items-start gap-4">
                            <span className="text-lg font-semibold">Nombre Total d'articles: 
                                <span className="font-Montserrat text-lg font-light"> 42</span>
                            </span>
                            <span className="text-lg font-semibold">Valeur en Dhs: 
                                <span className="font-Montserrat text-lg font-light"> 50 000 DH</span>
                            </span>
                        </div>
                        <div className="rounded-sm p-4">
                            <Pie
                                id="0"
                                data={ {
                                    labels: [
                                    'Affecté',
                                    'Non Affecté'
                                    ],
                                    datasets: [{
                                    label: 'Total',
                                    data: [110, 50],
                                    backgroundColor: [
                                        '#7fd0c7',
                                        '#4b5563'
                                    ],
                                    hoverOffset: 4
                                    }]

                                }}
                                options={{
                                responsive: true,
                                maintainAspectRatio: false
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="w-full px-4 " id="content">
                    <div className="w-full rounded-md bg-gray-200 flex shadow-md">
                        <div onClick={()=>changeContent(false)} className={"w-1/2 cursor-pointer flex justify-center items-center  py-4 px-8  transition-colors duration-800 " + (!isDetail?" border-b-2 border-emerald-600  bg-emerald-200 ":" bg-gray-100")}>
                            <span className="text-xl font-Montserrat font-light ">Articles</span>
                        </div>
                        <div onClick={()=>changeContent(true)} className={"w-1/2 cursor-pointer flex justify-center items-center  py-4 px-8 transition-colors duration-800 " + (isDetail?" border-b-2 border-cyan-600  bg-cyan-200 ":" bg-gray-100")}>
                            <span className="text-xl font-Montserrat font-light ">Detail</span>
                        </div>
                    </div>
                    {   !isDetail?
                        <div className="w-full py-4 flex flex-col gap-4">
                            <div className="w-full flex items-center justify-between py-4 px-10">
                                <button 
                                    className={"py-4 px-14 bg-emerald-500  rounded-full relative text-gray-50"} 
                                >
                                    <div  onClick={()=> {openForm("add","Article")}} className={"h-full cursor-pointer flex justify-center items-center text-gray-50 px-8 absolute top-1/2 left-0 rounded-l-full bg-emerald-500  hover:shadow-md hover:shadow-emerald-200 transition-shadow -translate-x-1/2 -translate-y-1/2 "}>
                                            <PlusIcon  size={24} />
                                    </div>
                                    Ajouter
                                    <input  type="file" accept=".xlsx, .xls" className="hidden " id="excelInput" onChange={setExcelEvent} ref={ExcelInput}/>
                                    <label  htmlFor="excelInput" className={" h-full flex justify-center items-center px-8 absolute top-1/2 right-0 rounded-r-full bg-emerald-500 hover:shadow-emerald-200  translate-x-1/2 -translate-y-1/2 cursor-pointer hover:shadow-md transition-shadow" }>
                                       <ExcelIcon/>
                                    </label>
                                </button>
                                <button className={"px-8 py-4  shadow-none bg-emerald-100 border-emerald-600 " + (isAscending[0]?"border-b-2 rounded-b-none" : "border-t-2 rounded-t-none")}
                                    onClick={()=>reverseArticles()}
                                >
                                    {
                                        !isAscending[0] ? <ArrowDownNarrowWide size={30}  className="text-black "/> : <ArrowDownNarrowWide size={30}  className="rotate-180 text-black "/>
                                    }
                                </button>
                            </div>
                            <table className="w-full my-12">
                                <thead>
                                    <tr className="bg-emerald-500">
                                        <th className="px-4 py-2 text-left text-sm"></th>
                                        <th className="px-4 py-2 text-left text-sm">Numero</th>
                                        <th className="px-4 py-2 text-left text-sm">Type</th>
                                        <th className="px-4 py-2 text-left text-sm">Marque</th>
                                        <th className="px-4 py-2 text-left text-sm">Description</th>
                                        <th className="px-4 py-2 text-left text-sm">Quantite</th>
                                        <th className="px-4 py-2 text-left text-sm">Prix estimatif</th>
                                        <th className="px-4 py-2 text-left text-sm">Prix unitaire</th>
                                        <th className="px-4 py-2 text-left text-sm">Prix total</th>
                                        <th className="px-4 py-2 text-left text-sm"></th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        articles?.map((e, index) => (
                                            <tr key={index} ref={isAnimated && e._id == currentArticle ? rowRef : null} className={"relative group hover:bg-emerald-100 transition-colors  shadow-md rounded-md my-2 " + (isAnimated && e._id == currentArticle?" bg-emerald-200 border-b-2 border-emerald-500 duration-1000" : " odd:bg-white even:bg-gray-50")}>
                                                <td className="p-4 group-hover:z-10 group-hover:relative"><Clipboard size={24} color="#10b981"/></td>
                                                <td className="p-4 text-xs group-hover:z-10 group-hover:relative">{e.Numero}</td>
                                                <td className="p-4 text-xs group-hover:z-10 group-hover:relative">{e.type}</td>
                                                <td className="p-4 text-xs">{e.marque}</td>
                                                <td className="p-4 text-xs">{e.description}</td>
                                                <td className="p-4 text-xs">{e.quantite}</td>
                                                <td className="p-4 text-xs">{e.prix_estimatif} DH</td>
                                                <td className="p-4 text-xs">{e.prix_unitaire} DH</td>
                                                <td className="p-4 text-xs">{e.prix_totale} DH</td>
                                                <td className="p-4 flex items-center justify-center gap-2  group-hover:z-10 group-hover:relative">
                                                    <button onClick={()=> {openForm("detail","Article",e._id)}} className="px-2 py-1  group shadow-none"><Edit2 className="group-hover:text-emerald-500 transition-colors" /></button>
                                                    <button onClick={()=> {setIsDelete(index)}} className="px-2 py-1  group shadow-none"><Trash2 className="group-hover:text-red-500 transition-colors" /></button>
                                                </td>
                                                <td className="w-0 p-0">
                                                    <div className="absolute inset-0 z-0 bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button onClick={()=>changeContent(true,e._id)} className="px-6 py-2 shadow-none flex items-center justify-center gap-2 text-xs text-black hover:text-emerald-500 transition-colors">Consulter <ArrowRight/></button>
                                                    </div>
                                                </td>
                                                {
                                                    isDelete == index?
                                                    <td className="absolute bg-white bg-opacity-90 left-0 right-0 top-0 bottom-0 flex justify-around items-center gap-2 p-4 z-10 shadow-lg">
                                                        <h1 className="font-light bg-white text-xs  text-wrap text-gray-700">Toutes les données et relations liées à cet Article seront également supprimées !</h1>
                                                        <div className="flex gap-2 ">
                                                            <button onClick={()=>deleteArticle(e._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Confirmer</button>
                                                            <button onClick={()=>setIsDelete(null)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">Annuler</button>
                                                        </div>
                                                    </td>
                                                    :
                                                    null
                                                }
                                            </tr>
                                        ))
                                    }
                                    
                                    
                                </tbody>
                            </table>
                        </div>
                        :
                        <div className="w-full py-4 flex flex-col gap-4">
                            <div className="w-full rounded-md bg-emerald-200 shadow-md  flex justify-start gap-16 itmes-center">
                                <button onClick={()=>Back()} className="bg-emerald-300 flex justify-center items-center px-16 shadow-none"><MoveLeft className="text-white" size={40}/></button>
                                <div className="flex flex-col gap-1 justify-center items-start py-2">
                                    <span className="text-xl font-semibold font-Montserrat ">
                                        Article  
                                        <span className=" font-light  "> N°{articles.find(e=>e._id == currentArticle)?.Numero}</span>
                                    </span>
                                    <span className="text-xl font-semibold font-Montserrat">
                                        de type
                                        <span className=" font-light "> {articles.find(e=>e._id == currentArticle)?.type}</span> 
                                    </span>
                                </div>
                            </div>
                            <div className="w-full flex items-center justify-between py-4 px-10">
                                <button 
                                    className={"py-4 px-14 bg-cyan-500  rounded-full relative text-gray-50"} 
                                >
                                    <div  onClick={()=> {openForm("add","subArticle")}} className={"h-full cursor-pointer flex justify-center items-center text-gray-50 px-8 absolute top-1/2 left-0 rounded-l-full bg-cyan-500  hover:shadow-md hover:shadow-cyan-200 transition-shadow -translate-x-1/2 -translate-y-1/2 "}>
                                            <PlusIcon  size={24} />
                                    </div>
                                    Ajouter
                                    <input  type="file" accept=".xlsx, .xls" className="hidden " id="excelInput" onChange={setExcelEvent} ref={ExcelInput}/>
                                    <label  htmlFor="excelInput" className={" h-full flex justify-center items-center px-8 absolute top-1/2 right-0 rounded-r-full bg-cyan-500 hover:shadow-cyan-200  translate-x-1/2 -translate-y-1/2 cursor-pointer hover:shadow-md transition-shadow" }>
                                    <ExcelIcon/>
                                    </label>
                                </button>
                                <button className={"px-8 py-4  shadow-none bg-cyan-100 border-cyan-600 " + (isAscending[1]?"border-b-2 rounded-b-none" : "border-t-2 rounded-t-none")}
                                    onClick={()=>reverseSubArticles()}
                                >
                                    {
                                        !isAscending[1] ? <ArrowDownNarrowWide size={30}  className="text-black "/> : <ArrowDownNarrowWide size={30}  className="rotate-180 text-black "/>
                                    }
                                </button>
                            </div>
                            <form onSubmit={Filter} className="w-full flex items-center justify-end px-10 py-4">
                                <div className="relative w-1/3">
                                    <input type="text" name="query" id="query" 
                                    className={`text-black text-sm w-full rounded-full outline-dark border-2 border-cyan-300 shadow-md bg-white px-12 py-3 font-Montserrat`}
                                    placeholder={"Filtrer par le nombre de serie"}
                                    />
                                    <button type="submit" className={"px-6 absolute rounded-full top-0 right-0 h-full bg-gradient-to-tr from-cyan-300 to-cyan-600 text-gray-50  hover:opacity-75"}><SearchIcon /></button>
                                </div>
                            </form>
                            <table className="w-full my-12">
                                <thead>
                                    <tr className="bg-cyan-500">
                                        <th className="px-4 py-2 text-left text-sm"></th>
                                        <th className="px-4 py-2 text-left text-sm">Numero</th>
                                        <th className="px-4 py-2 text-left text-sm">Serial</th>
                                        <th className="px-4 py-2 text-left text-sm">CAB</th>
                                        <th className="px-4 py-2 text-left text-sm">Date</th>
                                        <th className="px-4 py-2 text-left text-sm">Affectée</th>
                                        <th className="px-4 py-2 text-left text-sm"></th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filteredSubArticles.map((e, index) => (
                                            <tr key={index} className="relative hover:bg-cyan-100 transition-colors odd:bg-white even:bg-gray-50 shadow-md rounded-md my-2">
                                                <td className="p-4"><BoxIcon size={24} color="#06b6d4"/></td>
                                                <td className="p-4 text-xs">{e.Numero}</td>
                                                <td className="p-4 text-xs">{e.Numero_Serie}</td>
                                                <td className="p-4 text-xs">{e.cab}</td>
                                                <td className="p-4 text-xs">{e.date_Livraison.split('T')[0]}</td>
                                                <td className="p-4 text-xs">{e.etat?"Oui":"Non"}</td>
                                                <td className="p-4 flex items-center justify-center gap-2 ">
                                                    <button onClick={()=>openForm("detail","subArticle",e._id)} className="px-2 py-1  group shadow-none"><Edit2 className="group-hover:text-cyan-500 transition-colors" /></button>
                                                    <button onClick={()=>setIsDelete(index)} className="px-2 py-1  group shadow-none"><Trash2 className="group-hover:text-red-500 transition-colors" /></button>
                                                </td>
                                                {
                                                    isDelete == index?
                                                    <td className="absolute bg-white bg-opacity-90 left-0 right-0 top-0 bottom-0 flex justify-around items-center gap-2 p-4 z-10 shadow-lg">
                                                        <h1 className="font-light bg-white text-xs  text-wrap text-gray-700">Êtes-vous sûr de vouloir le supprimer ? Cette action est irréversible.</h1>
                                                        <div className="flex gap-2 ">
                                                            <button onClick={()=>deleteSubArticle(e._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Confirmer</button>
                                                            <button onClick={()=>setIsDelete(null)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">Annuler</button>
                                                        </div>
                                                    </td>
                                                    :
                                                    null
                                                }
                                            </tr>
                                        ))
                                    }
                                    
                                    
                                </tbody>
                            </table> 
                        </div>
                           
                    }
                    
                </div>
                <Footer/>
            </div>
    );
}