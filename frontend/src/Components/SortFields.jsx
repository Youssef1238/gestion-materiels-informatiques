
import { SelectContent, SelectItem } from "@/components/ui/select";

export default function Sortfields({ entity }) {
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
}

const MarcheSortfields = ()=>{
    return (
            <SelectContent className="w-[240px] p-0 m-0" >
                <SelectItem value="date" className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-sm p-4">Date</SelectItem>
            </SelectContent>
    )
}
const FournisseurSortfields = ()=>{
    return (
            <SelectContent className="w-[240px] p-0 m-0" >
                <SelectItem value="date" className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-sm p-4">Nom</SelectItem>
            </SelectContent>
    )
}
const TypeSortfields = ()=>{
    return (
            <SelectContent className="w-[240px] p-0 m-0" >
                <SelectItem value="ordre" className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-sm p-4">Ordre</SelectItem>
                <SelectItem value="nom" className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-sm p-4">Nom</SelectItem>
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
                <SelectItem value="date" className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-sm p-4">Nom</SelectItem>
            </SelectContent>
    )
}
const ArticleSortfields = ()=>{
    return (
            <SelectContent className="w-[240px] p-0 m-0" >
                <SelectItem value="numero" className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-sm p-4">Numero</SelectItem>
                <SelectItem value="date" className="bg-gray-100 hover:bg-primary cursor-pointer hover:text-white text-sm p-4">Date</SelectItem>
            </SelectContent>
    )
}



