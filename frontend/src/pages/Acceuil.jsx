import api from "../utils/Api";
import  { useEffect, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/Components/layout/layout";
import { ArrowDown } from "lucide-react";
import KpiCard from "@/Components/KpiCard";
import { Line, Pie } from "react-chartjs-2";
import OverviewCard from "@/Components/OverviewCard";




export default function Acceuil ()  {
    document.title = "Acceuil"
    const [loading,setLoading] = useState(true) 
    const Navigate = useNavigate()
    const [statsData,setStatsData] = useState([])
    const lineChart = useRef();
    useEffect(()=>{
        const fetch = async ()=>{
            try{
                setLoading(true)
                
                const res = await api.get(`http://localhost:5500/stats`)
                
                setStatsData(
                    [
                        {
                          title: "Section 1 : STATS DES MARCHES",
                          stats: [
                            { name: "NB de marches", value: res.data.MARCHE.NB_M },
                            { name: "NB de fournisseurs", value: res.data.MARCHE.NB_F },
                            { name: "Moyen M/F", value: res.data.MARCHE.Moyen_MF },
                            { name: "Moyen A/M", value: res.data.MARCHE.Moyen_AM },
                          ],
                        },
                        {
                          title: "Section 2 : STATS DES ENTITES ADMINISTRATIVES",
                          stats: [
                            { name: "NB des entites Administratives", value: res.data.ENTITEADMIN.NB },
                            { name: "Ayant des articles", value: res.data.ENTITEADMIN.Aff },
                            { name: "Avec aucun article", value: res.data.ENTITEADMIN.Non_Aff },
                            { name: "Moyen A/EA", value: res.data.ENTITEADMIN.Moyen_AE },
                          ],
                        },
                        {
                          title: "Section 3 : STATS DES ARTICLES",
                          stats: [
                            { name: "NB Total des articles", value: res.data.ARTICLE.NB_TOT },
                            { name: "Affectée", value: res.data.ARTICLE.Aff },
                            { name: "Non Affectée", value: res.data.ARTICLE.Non_Aff },
                          ],
                        },
                        {
                          title: "Section 4: STATS DES AFFECTATIONS",
                          stats: [
                            { name: "ToT des affectations", value: res.data.AFFECTATION.ToT },
                            { name: "ToT d'Aff ce jour", value: res.data.AFFECTATION.Aff_J },
                            { name: "ToT d'Aff ce mois", value: res.data.AFFECTATION.Aff_M },
                            { name: "ToT d'Aff cette annee", value: res.data.AFFECTATION.Aff_An },
                          ],
                        },
                        {
                          title: "Section 5 : STATS DES PRIX",
                          stats: [
                            {
                              name: "",
                              value: [
                                { name: "ToT des prix", value: res.data.PRIX.ToT + " DH" },
                                { name: "pourcentage d'estimation correcte", value: res.data.PRIX.PEC + " %" },
                                { name: "le materiel le plus cher", value: res.data.PRIX.MPC },
                              ],
                            },
                            {
                              name: "Moyen des prix par type",
                              value: res.data.TYPE_PRIX.map(e=>{
                                return  { name: e.libelle, value: (e.MP==null? 0 : e.MP) + " DH"}
                              }) 

                               ,
                            },
                          ],
                        },
                      ]
                )
            }catch(error){
              console.error(error);
                if (error.response) {
                    Navigate('/error',{state : {message : error.response.data ,code : error.response.status}})
                } else if (error.request) {
                    Navigate('/error',{state : {message :'No response received: ' + error.request}})
                } else {
                    Navigate('/error',{state : {message :'Error setting up the request: ' + error.message}})
                }
            }finally{
                setLoading(false)
            }
            
        }
        if(lineChart.current) lineChart.current.destroy()
        fetch()
        
    },[])

    if(loading){
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
            <button className="flex items-center text-gray-600 border-2 border-primary">Commencer la gestion <ArrowDown/></button>
          </div>
        </div>
        <img src="/images/IntroLogin.png" alt="" className=" w-1/3"/>
      </div>
      <div id="stats" className="w-full min-h-fit bg-gray-50 py-24 px-8 grid grid-cols-2 gap-2">
        <KpiCard title={"Marché"} total={514} day={2} month={20} year={114}/>
        <KpiCard title={"Article"} total={514} day={2} month={20} year={114}/>
        <KpiCard title={"Finance"} total={514} day={2} month={20} year={114}/>
        <KpiCard title={"Activity"} total={514} day={2} month={20} year={114}/>
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
          <div className="bg-gray-50 rounded-sm p-4">
            <Line
                  id="1"
                  ref={lineChart}
                  data={ {
                    labels: ["July", "August", "September", "October", "November", "December", "January"],
                    datasets: [{
                      label: "Total d'affectation",
                      data: [65, 59, 80, 81, 56, 55, 40],
                      fill: false,
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.1
                    }]
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


