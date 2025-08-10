
import Filter from "./layout/filter";
import { Switch } from "@radix-ui/react-switch";
import { useState } from "react";

export default function Filters({ entity , setIsOpen }) {
    return (<Filter title={entity} onApply={(data)=>{console.log(data.get("article-affecté"))}}  setIsOpen={setIsOpen}>
        {
            (() => {
                switch (entity) {
                case "Marché":
                    return <MarcheFilter />;
                case "Fournisseur":
                    return <FournisseurFilter />;
                case "Compte":
                    return <AccountFilter />;
                case "Article":
                    return <ArticleFilter />;
                default:
                    return null;
                }
            })()
        }
    </Filter>
    )
  
}

const MarcheFilter = ()=>{
    return (
            <div className="w-full flex flex-col">
                <div className=" w-full py-2 px-4 flex flex-col gap-2 items-start bg-gray-100">
                    <label htmlFor="marché-date" className="text-xs text-gray-700">Date</label>
                    <input type="date" name="marché-date" id="marché-date" className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="py-2 px-4 flex flex-col gap-2 items-start bg-gray-100">
                    <label htmlFor="marché-type" className="text-xs text-gray-700">Type</label>
                    <select id="marché-type" name="marché-type" className="w-full px-3 py-2 text-xs  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="public">Public</option>
                        <option value="private">Privé</option>
                        <option value="international">International</option>
                    </select>
                </div>
                <div className="py-2 px-4 flex flex-col gap-2 items-start bg-gray-100">
                    <label htmlFor="marché-fournisseur" className="text-xs text-gray-700">Fournisseur</label>
                    <select id="marché-fournisseur" name="marché-fournisseur" className="w-full text-xs  px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="public">Ahmad Foughal</option>
                        <option value="private">Brahim sarih</option>
                        <option value="international">L7afouzli9</option>
                    </select>
                </div>
            </div>
                

    )
}
const FournisseurFilter = ()=>{
    return (
            <div className="flex flex-col">
                <div className=" px-4 flex flex-col gap-2 items-start bg-gray-100">
                    <label htmlFor="fournisseur-qualité" className="text-xs text-gray-700">Qualité</label>
                    <select id="fournisseur-qualité" name="fournisseur-qualité" className="w-full px-3 text-xs py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="public">Gérant</option>
                        <option value="private">RH</option>
                        
                    </select>
                </div>
            </div>
    )
}

const AccountFilter = ()=>{
    return (
            <div className="flex flex-col">
                <div className="px-4 flex flex-col gap-2 items-start bg-gray-100">
                    <label htmlFor="fournisseur-qualité" className="text-xs text-gray-700">Role</label>
                    <select id="fournisseur-qualité" name="fournisseur-qualité" className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="public">Admin</option>
                        <option value="private">Editeur</option>
                    </select>
                </div>
            </div>
    )
}


const ArticleFilter = ()=>{
    const [isAffecté, setIsAffecté] = useState(false);
    return (
            <div className="flex flex-col gap-2">
                <div className="px-4 flex flex-col gap-2 items-start bg-gray-100">
                    <label htmlFor="article-date" className="text-xs text-gray-700">Date</label>
                    <input type="date" name="article-date" id="article-date" className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="px-4 flex flex-col gap-2 items-start bg-gray-100">
                    <label htmlFor="article-numero" className="text-xs text-gray-700">Numero</label>
                    <input type="number" min={1} name="article-numero" id="article-numero" className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="px-4 flex flex-col gap-2 items-start bg-gray-100">
                    <label htmlFor="article-affecté" className="text-sm text-gray-700">Affecté</label>
                    <Switch checked={isAffecté} onCheckedChange={setIsAffecté} id="article-affecté"  className={"w-5 h-3 "+ (!isAffecté?"bg-gray-300" : "bg-gray-600")+ " rounded-full relative  transition-colors duration-200"}>
                        <span className={"absolute " + (!isAffecté?"left-1" : "right-1")+"  top-1 w-2 h-2 bg-white rounded-full transition-transform duration-200 transform" }/>
                    </Switch>
                    <input type="hidden" name="article-affecté" value={isAffecté} />
                </div>

                
                
            </div>
    )
}



