import Affectation from "@/Components/Tabs/Affectation";
import AffecterModal from "@/Components/modals/AffecterModal";
import Footer from "@/Components/layout/Footer";
import Log from "@/Components/Tabs/Log";
import Recuperations from "@/Components/Tabs/Recuperation";
import api from "@/utils/Api";
import { ArrowLeft, Building2, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useLocation, useNavigate } from "react-router-dom";





export default function EntitéAdmin() {
    const Navigate = useNavigate();
    const Location = useLocation();
    const { entitéAdminId } = Location.state || {};
    const [EntitéAdmin,setEntitéAdmin] = useState(null)
    const [error, setError] = useState(false);
    const [Tab,setTab] = useState(0)
    const [Articles,setArticles] = useState(false)
    const [Year,setYear] = useState("")
    const [Stats,setStats] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ResetBag, setResetBag] = useState(false);

    const fetchStats = async ()=>{
        try {
            const res = await api.get(`entiteAdmin/stats/${entitéAdminId}`)
            console.log(res.data)
            setStats(res.data)
            setYear(res.data.monthStats? Object.keys(res.data.monthStats)[0] : "")
        } catch (err) {
            if (err.response) {
                console.error("custom error",err)
            } else {
                console.error("custom error",err)
                Navigate('/error')
            }
        } 
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const res = await api.get(`entiteAdmin/${entitéAdminId}`);
                setEntitéAdmin(res.data)
                document.title = `${res.data.libelle_fr}`;
                await fetchStats()
            } catch (err) {
                if (err.response) {
                    setError(true)
                    console.error("custom error",err)
                } else {
                    console.error("custom error",err)
                    Navigate('/error')
                }
            } finally {
                setIsLoading(false)
            }
        }   
        fetchData();
    }, [entitéAdminId]);

    const changeContent = (val)=>{
        setTab(val)
        setResetBag(false)
        const contentElement = window.document.getElementById('content');
        if (contentElement) {
            contentElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    const ConfirmAction = (bag)=>{
        setArticles(bag)
        setIsModalOpen(true)
    }
    const GenerateReport = async (date , decharge , items)=>{
        try {
            const response = await api.post(`generate`,{
                decharge : decharge,
                entiteAdmin : EntitéAdmin.libelle_fr,
                date : date,
                items : items
            }, {
                
                
                responseType: 'blob',  
            })
            

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Decharge_'+EntitéAdmin.libelle_fr+'_'+date+'.docx'); 
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            await fetchStats()
            setResetBag(true)
        } catch (err) {
            if (err.response) {
                console.error("custom error",err)
            } else {
                console.error(err)
                Navigate('/error')
            }
        }
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
                    
                    <h1 className="text-xl text-red-400 font-Montserrat">Probléme de Connexion ou l'entité Administrative n'existe pas</h1>
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

    return(
        <div className="w-full min-h-screen flex flex-col items-center gap-4">
            {isModalOpen && <AffecterModal EntitéAdminId={entitéAdminId} Type={Tab == 0?"Affectation":"Récuperation"} Libelle={EntitéAdmin.libelle_fr} 
            Articles={Articles} onClose={()=>setIsModalOpen(false)} GenerateReport={GenerateReport} />}
            <div className=" w-full flex justify-center items-center relative py-16 bg-white">
                <button onClick={() => Navigate(-1)} className="absolute left-1  group rounded-full  px-6 py-2 flex justify-center items-center shadow-none ">
                    <ArrowLeft  size={32}  className="text-green-500 group-hover:text-black" />
                </button>
                <div className="flex items-center justify-center gap-12">
                    <Building2 size={48} color="#22c55e"/>
                    <div className="flex flex-col items-center gap-4">
                        <h1 className="text-4xl font-bold text-gray-800 font-Montserrat">{EntitéAdmin.libelle_fr}</h1>
                        <span className="text-2xl font-extralight text-gray-500 font-Amiri">{EntitéAdmin.libelle_ar}</span>
                    </div>
                </div>
            </div>
            <div className="w-full flex itmes-center gap-2 px-4 bg-gray-100 border-t-2 border-gray-200 py-12">
                <div className="w-1/2 py-8 px-8 bg-white rounded-md shadow-md shadow-gray-200 flex flex-col justify-around  gap-10">
                    <div className="w-full flex flex-col px-2 justify-center gap-4 ">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-Montserrat font-normal text-gray-400">Affectation Courant</span>
                            <Circle size={8} fill="#4ade80" color="#4ade80"/>
                        </div>
                        <span className="text-6xl font-Montserrat font-semibold text-gray-600">{Stats.Current || 0}</span>
                    </div>
                    <div className="w-full flex flex-col justify-around px-6 bg-green-200 rounded-md  shadow-md shadow-green-300 h-full">
                        <div className="flex flex-col justify-center  gap-2 ">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-Montserrat font-normal text-gray-500">Valeur courant</span>
                                <Circle size={8} fill="#60a5fa" color="#60a5fa"/>
                            </div>
                            <span className="text-xl font-Montserrat font-semibold text-gray-600">{Stats.Value || 0} Dhs</span>
                        </div>
                        <div className="flex flex-col justify-center  gap-2 ">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-Montserrat font-normal text-gray-500">Total Affectations</span>
                                <Circle size={8} fill="#6b7280" color="#6b7280"/>
                            </div>
                            <span className="text-xl font-Montserrat font-semibold text-gray-600">{Stats.Total || 0}</span>
                        </div>
                        <div className="flex flex-col justify-center gap-2 ">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-Montserrat font-normal text-gray-500">Recuperation</span>
                                <Circle size={8} fill="#f87171" color="#f87171"/>
                            </div>
                            <span className="text-xl font-Montserrat font-semibold text-gray-600">{Stats.Total == 0? 0 : Math.round((Stats.Total - Stats.Current) / Stats.Total * 100)}%</span>
                        </div>
                    </div>
                </div>
                <div className="w-1/2 py-8 px-8 bg-white rounded-md shadow-md shadow-gray-200 flex flex-col  gap-10">
                    <div className="w-full flex justify-center items-center py-4 gap-2">
                        {Object.keys(Stats.monthStats).map((year, i) => (
                            <button
                                key={year}
                                className={`p-0 shadow-none ${Year === year ? "text-green-600" : "text-black"} hover:text-gray-400`}
                                onClick={() => setYear(year)}
                            >
                                <Circle size={12} fill={Year === year ? "#22c55e" : "#000"} color={Year === year ? "#22c55e" : "#000"} />
                                <span className="ml-1 text-xs">{year}</span>
                            </button>
                        ))}
                    </div>
                    <Line
                        data={{
                            labels: ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"],
                            datasets: [
                                {
                                    label: "Affectation",
                                    data: Stats.monthStats[Year]?.affectations || [],
                                    fill: false,
                                    borderColor: '#86efac',
                                    backgroundColor: '#bbf7d0',
                                    tension: 0.3,
                                },
                                {
                                    label: "Récupération",
                                    data: Stats.monthStats[Year]?.recuperations || [],
                                    fill: false,
                                    borderColor: '#fca5a5',
                                    backgroundColor: '#fee2e2',
                                    tension: 0.3,
                                }
                            ]
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: "bottom",
                                    labels: {
                                        font: { family: "Montserrat" }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    grid: { display: false }
                                },
                                y: {
                                    beginAtZero: true,
                                    grid: { color: "#f3f4f6" }
                                }
                            }
                        }}
                    />
                </div>
            </div>
            <div className="w-full px-4 bg-white" id="content">
                <div className="w-full rounded-md  flex shadow-md">
                    <div onClick={()=>changeContent(0)} className={"w-1/3 cursor-pointer flex justify-center items-center  py-4 px-8  transition-colors duration-800 " + (Tab == 0?" border-b-2 border-blue-600  bg-blue-200 ":" bg-gray-100")}>
                        <span className="text-xl font-Montserrat font-light ">Affecter</span>
                    </div>
                    <div onClick={()=>changeContent(1)} className={"w-1/3 cursor-pointer flex justify-center items-center  py-4 px-8 transition-colors duration-800 " + (Tab == 1?" border-b-2 border-teal-600  bg-teal-200 ":" bg-gray-100")}>
                        <span className="text-xl font-Montserrat font-light ">Récuperer</span>
                    </div>
                    <div onClick={()=>changeContent(2)} className={"w-1/3 cursor-pointer flex justify-center items-center  py-4 px-8  transition-colors duration-800 " + (Tab == 2?" border-b-2 border-amber-600  bg-amber-200 ":" bg-gray-100")}>
                        <span className="text-xl font-Montserrat font-light ">Log</span>
                    </div>

                </div>
                {
                    Tab == 0?
                    <Affectation EntitéAdminId={entitéAdminId} onDone={ConfirmAction} isModalOpen={isModalOpen} ResetResetBag={ResetBag}/>
                    :
                    Tab == 1?
                    <Recuperations EntitéAdminId={entitéAdminId} onDone={ConfirmAction} isModalOpen={isModalOpen} ResetResetBag={ResetBag}/>
                    :
                    <Log EntitéAdminId={entitéAdminId} Libelle={EntitéAdmin.libelle_fr} />
                }
            </div>
            
            <Footer/>
        </div>
    )
}