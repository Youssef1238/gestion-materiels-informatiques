
import { 
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue} from "@/components/ui/select";

export default function Sortfields({ entity , sortData , sortCol }) {
    return (
        <Select value={sortCol} onValueChange={(val)=>sortData(val)}>
                <SelectTrigger className="w-fit px-4 py-2 text-sm h-full border-0 shadow-sm">
                    <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                {
                    (()=>{
                        switch (entity) {
                            case "Marché":
                                return <MarcheSortfields />;
                            case "Fournisseur":
                                return <FournisseurSortfields />;
                            case "Type de matériel":
                                return <TypeSortfields />;
                            case "Compte":
                                return <AccountSortfields />;
                            case "Entité Admin.":
                                return <EntiteAdmSortfields />;
                            case "Article":
                                return <ArticleSortfields />;
                            default:
                                return null;
                        }
                    })()
                }
            </Select>
    )
  
}

const MarcheSortfields = ()=>{
    return (
                <SelectContent className="w-[240px] p-0 m-0" >
                    <SelectItem value="date_creation" className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-sm p-4">Date</SelectItem>
                </SelectContent>                   
    )
}
const FournisseurSortfields = ()=>{
    return (
            <SelectContent className="w-[240px] p-0 m-0" >
                <SelectItem value="nom" className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-sm p-4">Nom</SelectItem>
            </SelectContent>
    )
}
const TypeSortfields = ()=>{
    return (
            <SelectContent className="w-[240px] p-0 m-0" >
                <SelectItem value="order" className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-sm p-4">Ordre</SelectItem>
                <SelectItem value="libelle" className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-sm p-4">Nom</SelectItem>
            </SelectContent>
    )
}
const AccountSortfields = ()=>{
    return (
           <SelectContent className="w-[240px] p-0 m-0" >
                <SelectItem value="pseudo" className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-sm p-4">Pseudo</SelectItem>
            </SelectContent>
    )
}
const EntiteAdmSortfields = ()=>{
    return (
            <SelectContent className="w-[240px] p-0 m-0" >
                <SelectItem value="libelle_fr" className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-sm p-4">Nom</SelectItem>
            </SelectContent>
    )
}
const ArticleSortfields = ()=>{
    return (
            <SelectContent className="w-[240px] p-0 m-0" >
                <SelectItem value="Numero" className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-sm p-4">Numero</SelectItem>
                <SelectItem value="date_Livraison" className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-sm p-4">Date</SelectItem>
            </SelectContent>
    )
}



