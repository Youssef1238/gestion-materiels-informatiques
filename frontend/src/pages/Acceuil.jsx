import api from "../utils/Api";
import  { useEffect ,useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/Components/layout/layout";
import { ArrowRight } from "lucide-react";
import KpiCard from "@/Components/KpiCard";
import { Line, Pie } from "react-chartjs-2";
import OverviewCard from "@/Components/OverviewCard";




export default function Acceuil ()  {
    document.title = "Acceuil"
    const [isLoading,setIsLoading] = useState(true) 
    const Navigate = useNavigate()
    const [statsData,setStatsData] = useState([])
    const lineChart = useRef();
    useEffect(()=>{
        const fetch = async ()=>{
            try{
                setIsLoading(true)
                const res = await api.get(`stats`)
                setStatsData(res.data)
            }catch(err){
              console.error(err)
              Navigate('/error')
            }finally{
                setIsLoading(false)
            }
            
        }
        if(lineChart.current) lineChart.current.destroy()
        fetch()
        
    },[])

    if(isLoading){
        return <div className="w-full h-screen flex justify-center items-center">
      <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.364A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3.93-1.574z"></path>
      </svg>
    </div>;
    }
  return (
    <Layout>
      <div className="w-full min-h-fit py-8 px-2 flex gap-8 items-center" id="hero">
        <div className="w-full flex flex-col gap-8 grow px-4">
          <h1 className="text-4xl text-black font-bold font-Montserrat mt-12 ">Bienvenue sur la Plateforme de Gestion des matériels informatiques</h1>
          <p className="text-xl font-light font-Montserrat text-gray-600 max-w-[60%]">
            la platforme officielle pour gérer les matériels informatiques et leur circulation dans les entités 
            Administratives sous la Conseil Provincial d'Errachidia. 
          </p>
          <div className="flex gap-4 items-center mt-12">
            <button onClick={()=>Navigate('/Gerer')} className="flex items-center gap-4 text-gray-600 hover:shadow-md hover:shadow-gray-300 border-2 border-primary">Commencer la gestion <ArrowRight/></button>
          </div>
        </div>
        <img src="/images/IntroLogin.png" alt="" className=" w-1/3"/>
      </div>
      <div id="stats" className="w-full min-h-fit bg-gray-50 py-24 px-8 grid grid-cols-2 gap-2">
        <KpiCard title={"Marché"} total={statsData.marches.total} day={statsData.marches.today} month={statsData.marches.month} year={statsData.marches.year}/>
        <KpiCard title={"Article"} total={statsData.articles.total} day={statsData.articles.today} month={statsData.articles.month} year={statsData.articles.year}/>
        <KpiCard title={"Finance"} total={statsData.valeur.total} day={statsData.valeur.today} month={statsData.valeur.month} year={statsData.valeur.year}/>
        <KpiCard title={"Activité"} total={statsData.actions.total} day={statsData.actions.today} month={statsData.actions.month} year={statsData.actions.year}/>
      </div>
      <div id="charts" className="w-full min-h-fit py-24 px-8 grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-sm p-4">
            <Pie
                  id="0"
                  data={ {
                    labels: [
                      'Affecté',
                      'Non Affecté'
                    ],
                    datasets: [{
                      label: 'Total',
                      data: [statsData.articles_affecte, statsData.articles_non_affecte],
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
          <div className="bg-gray-50 rounded-sm p-4">
            <Line
                data={{
                    labels: ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"],
                    datasets: [
                        {
                            label: "Affectation",
                            data: statsData.Monthstats?.affectations || [],
                            fill: false,
                            borderColor: '#86efac',
                            backgroundColor: '#bbf7d0',
                            tension: 0.3,
                        },
                        {
                            label: "Récupération",
                            data: statsData.Monthstats?.recuperations || [],
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
      <div id="overview" className="w-full min-h-fit bg-gray-50 py-24 px-8 grid grid-cols-2 gap-2">
                <OverviewCard title={"Chercher"}/>
                <OverviewCard title={"Gérer"}/>
                <OverviewCard title={"Affecter"}/>
                <OverviewCard title={"Récuperer"}/>
      </div>
    </Layout>
  );
};


