import api from "../utils/Api";
import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";


export default function Acceuil ()  {
    document.title = "Acceuil"
    const [loading,setLoading] = useState(true)
    const Navigate = useNavigate()
    const [statsData,setStatsData] = useState([])
    
    
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
    <div>
    <NavBar/>
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-8">
        Acceuil
      </h1>
      <div className="space-y-8">
        {statsData.map((section, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
              {section.title}
            </h2>
            {Array.isArray(section.stats[0].value) ? (
              // For nested stats (Section 5)
              section.stats.map((stat, i) => (
                <div key={i} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700">
                    {stat.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {stat.value.map((subStat, j) => (
                      <div
                        key={j}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <p className="text-gray-600">{subStat.name}</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {subStat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // For regular stats
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {section.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <p className="text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    <Footer/>
    </div>
  );
};


