
import { Switch } from "@radix-ui/react-switch";
import { useEffect, useState } from "react";
import Filter from "./layout/Filter";

export default function Filters({ entity , setIsOpen , FilterData , data}) {
    
    const [DefaultValues, setDefaultValues] = useState([])
    const FilterFomrs = {
        "Marché":<MarcheFilter data={data} DefaultValues={DefaultValues}/>,
        "Fournisseur":<FournisseurFilter DefaultValues={DefaultValues}/>,
        "Compte":<AccountFilter DefaultValues={DefaultValues} />,
        "Article":<ArticleFilter DefaultValues={DefaultValues} />,
    }
  

    const filterMarche = (formData)=>{
        const date = formData.get('marché-date');
        const type = formData.get('marché-type');
        const fournisseur = formData.get('marché-fournisseur') ;
        setDefaultValues([date,type,fournisseur])
        const Fdata = Array.from(data).filter(a=>
        (!date || a.date_creation.split('T')[0] == date) && (!type || type==a.type) && (!fournisseur || fournisseur==a.fournisseur)
        )
        FilterData(Fdata)
    }
    const filterArtcile = (formData)=>{
        const date = formData.get('article-date');
        const numero = formData.get('article-numero');
        const affecte = formData.get('article-affecté') == 'true';
        setDefaultValues([date,numero,affecte])
        const Fdata = Array.from(data).filter(a=>
        (!date || a.date_Livraison.split('T')[0] == date) && (!numero || numero==a.Numero) && (!affecte || affecte==a.etat)
        )
        FilterData(Fdata)
    }
    const filterFournisseur = (formData)=>{
        const qualite = formData.get('fournisseur-qualité');
        setDefaultValues([qualite])
        const Fdata = Array.from(data).filter(a=>!qualite || a.qualite == qualite)
        FilterData(Fdata)
    }
    const filterCompte = (formData)=>{
        const role = formData.get('user-role');
        setDefaultValues([role])
        const Fdata = Array.from(data).filter(a=>!role || (role == (a.admin?"admin":"editeur")))
        FilterData(Fdata)
    }



    const filterfunc = {
        "Marché": filterMarche,
        "Fournisseur": filterFournisseur,
        "Compte": filterCompte,
        "Article": filterArtcile
    }

    return (<Filter title={entity} onApply={(formData)=>filterfunc[entity](formData)}  setIsOpen={setIsOpen} setDefaultValues={setDefaultValues} >
        {
            FilterFomrs[entity]
        }
    </Filter>
    )
  
}

const MarcheFilter = ({data , DefaultValues})=>{
    const fournisseurs = [...new Set(data.map(a=>a.fournisseur))]
    const [date, setDate] = useState(DefaultValues?.[0] || "");
    const [type, setType] = useState(DefaultValues?.[1] || "");
    const [fournisseur, setFournisseur] = useState(DefaultValues?.[2] || "");

    useEffect(() => {
        setDate(DefaultValues?.[0] || "");
        setType(DefaultValues?.[1] || "");
        setFournisseur(DefaultValues?.[2] || "");
    }, [DefaultValues]);

    return (
            <div className="w-full flex flex-col">
                <div className=" w-full py-2 px-4 flex flex-col gap-2 items-start bg-gray-100">
                    <label htmlFor="marché-date" className="text-xs text-gray-700">Date</label>
                    <input type="date" name="marché-date" value={date} onChange={e => setDate(e.target.value)} id="marché-date" className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="py-2 px-4 flex flex-col gap-2 items-start bg-gray-100">
                    <label htmlFor="marché-type" className="text-xs text-gray-700">Type</label>
                    <select id="marché-type" name="marché-type" value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 text-xs  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All</option>
                        <option value="Public">Public</option>
                        <option value="Prive">Privé</option>
                    </select>
                </div>
                <div className="py-2 px-4 flex flex-col gap-2 items-start bg-gray-100">
                    <label htmlFor="marché-fournisseur" className="text-xs text-gray-700">Fournisseur</label>
                    <select id="marché-fournisseur" name="marché-fournisseur" value={fournisseur} onChange={e => setFournisseur(e.target.value)} className="w-full text-xs  px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="" >All</option>
                        {
                            Array.from(fournisseurs).map((e,i)=>{
                                return <option value={e} key={i}>{e}</option>
                            })
                        }
                    </select>
                </div>
            </div>
                

    )
}
const FournisseurFilter = ({DefaultValues})=>{
    const [qualite, setQualite] = useState(DefaultValues?.[0] || "");

    useEffect(() => {
        setQualite(DefaultValues?.[0] || "");
    }, [DefaultValues]);
    return (
            <div className="flex flex-col">
                <div className=" px-4 flex flex-col gap-2 items-start bg-gray-100">
                    <label htmlFor="fournisseur-qualité" className="text-xs text-gray-700">Qualité</label>
                    <select id="fournisseur-qualité" name="fournisseur-qualité" value={qualite} onChange={e => setQualite(e.target.value)} className="w-full px-3 text-xs py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All</option>
                        <option value="Gerant">Gérant</option>
                        <option value="RH">RH</option>
                        
                    </select>
                </div>
            </div>
    )
}

const AccountFilter = ({DefaultValues})=>{
    const [role, setRole] = useState(DefaultValues?.[0] || "");

    useEffect(() => {
        setRole(DefaultValues?.[0] || "");
    }, [DefaultValues]);
    return (
            <div className="flex flex-col">
                <div className="px-4 flex flex-col gap-2 items-start bg-gray-100">
                    <label htmlFor="user-role" className="text-xs text-gray-700">Role</label>
                    <select id="user-role" value={role} onChange={e => setRole(e.target.value)}  name="user-role" className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All</option>
                        <option value="admin">Admin</option>
                        <option value="editeur">Editeur</option>
                    </select>
                </div>
            </div>
    )
}


const ArticleFilter = ({ DefaultValues }) => {
    const [date, setDate] = useState(DefaultValues?.[0] || "");
    const [numero, setNumero] = useState(DefaultValues?.[1] || "");
    const [isAffecté, setIsAffecté] = useState(DefaultValues?.[2] || false);

    useEffect(() => {
        setDate(DefaultValues?.[0] || "");
        setNumero(DefaultValues?.[1] || "");
        setIsAffecté(DefaultValues?.[2] || false);
    }, [DefaultValues]);

    return (
        <div className="flex flex-col gap-2">
            <div className="px-4 flex flex-col gap-2 items-start bg-gray-100">
                <label htmlFor="article-date" className="text-xs text-gray-700">Date</label>
                <input type="date" name="article-date" id="article-date" value={date} onChange={e => setDate(e.target.value)} className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="px-4 flex flex-col gap-2 items-start bg-gray-100">
                <label htmlFor="article-numero" className="text-xs text-gray-700">Numero</label>
                <input type="number" name="article-numero" id="article-numero" value={numero} onChange={e => setNumero(e.target.value)} min={1} className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="px-4 flex flex-col gap-2 items-start bg-gray-100">
                <label htmlFor="article-affecté" className="text-sm text-gray-700">Affecté</label>
                <Switch checked={isAffecté} onCheckedChange={setIsAffecté} id="article-affecté" className={"w-5 h-3 " + (!isAffecté ? "bg-gray-300" : "bg-gray-600") + " rounded-full relative  transition-colors duration-200"}>
                    <span className={"absolute " + (!isAffecté ? "left-1" : "right-1") + "  top-1 w-2 h-2 bg-white rounded-full transition-transform duration-200 transform"} />
                </Switch>
                <input type="hidden" name="article-affecté" value={isAffecté} />
            </div>
        </div>
    );
};



