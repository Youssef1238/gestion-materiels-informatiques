import api from "@/utils/Api";
import { useNavigate } from "react-router-dom";



export default function AffecterModal({EntitéAdminId,onClose,Type,Libelle,Articles,GenerateReport}) {
    const Navigate = useNavigate()
    
    const Title = {
        "Affectation" : "Affectation des Articles à",
        "Récuperation" : "Récuperation des Articles de",
    }
    
    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };
    const affecter = async(id,date)=>{
        try {
            await api.post('http://localhost:5500/affectation',
                {
                    article_livre_id : id,
                    entiteAdmin_id : EntitéAdminId,
                    date_affectation : date
                }
            )
            
            await api.put('http://localhost:5500/articleLivre',
                {
                    id : id,
                    etat : true
                }
            )
            
        } catch (err) {
            Navigate('/error')
            console.log(err)
        }
    }
    const recuperer = async(id,date)=>{
        try {
            await api.put('http://localhost:5500/affectation/recuperer',
                {
                    id : id,
                    date_recuperation : date
                }
            )
            
            await api.put('http://localhost:5500/articleLivre',
                {
                    id : id,
                    etat : false
                }
            )
            
        } catch (err) {
            Navigate('/error')
            console.log(err)
        }
    }
    const Submit = async (e)=>{
        e.preventDefault()
        const date = Object.fromEntries(new FormData(e.target).entries())["date"];
        for (const article of Articles){          
            try {
                if(Type == "Affectation")
                    await affecter(article._id,date)
                else
                    await recuperer(article._id,date)
            } catch (error) {
                if(error.response){
                    console.error(error,)
                }else{
                    console.error(error)
                    Navigate('/error')
                }
                
            }
        }
        try {
            await api.post(`http://localhost:5500/entiteLog`,{
                entiteAdmin_id : EntitéAdminId,
                date : date,
                affectation : (Type == "Affectation"),
                articles : Articles.map(e=>e._id)
            })
            
        } catch (error) {
            if(error.response){
                console.error(error,)
            }else{
                console.error(error)
                Navigate('/error')
            }
        }finally{
            const items = Articles.map(e=>{
                return {
                    design : e.type + " (n°" + e.Numero + ") ",
                    marque : e.marque,
                    serie : e.Numero_Serie
                }
            }) 
            GenerateReport(date , (Type == "Affectation") , items)
            onClose()
        }
    }

    return (
        <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-30 w-full min-h-screen flex py-12 justify-center bg-black bg-opacity-50"
        >
            <div className="w-1/2 rounded-md h-fit max-h-full bg-white flex flex-col justify-center py-12 gap-8 overflow-y-auto">
                <span className="text-lg font-Montserrat font-light text-center">
                    {Title[Type]}{" "}
                    <span className="text-xl font-Montserrat font-semibold">{Libelle}</span>
                </span>
                <form className="flex flex-col gap-6 px-4" onSubmit={Submit}>
                    <div className="flex flex-col gap-4 max-h-64 overflow-y-auto border rounded-md p-4">
                        {Articles && Articles.length > 0 ? (
                            Articles.map((article, idx) => (
                                <div key={idx} className="border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                                    <div className="text-sm font-semibold">Marché: <span className="font-normal">{`Marché - ${article.paraInfo?.marche || ''} N° ${article.numAR || ''}`}</span></div>
                                    <div className="text-sm">Numéro: <span className="font-normal">{article.Numero}</span></div>
                                    <div className="text-sm">Type: <span className="font-normal">{article.type}</span></div>
                                    <div className="text-sm">Marque: <span className="font-normal">{article.marque}</span></div>
                                </div>
                            ))
                        ) : (
                            <span className="text-gray-500 text-sm">Aucun article à afficher.</span>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="date" className="text-sm font-medium">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            required
                            className="border rounded px-2 py-1"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Confirmer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}