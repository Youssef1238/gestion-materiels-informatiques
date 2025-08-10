import  { Trash2, StoreIcon, Handshake, BoxIcon, User2, Building2, TagIcon, FormInput } from "lucide-react"



export default function Table({ entity, data, onDelete , onDetail }) {
    switch (entity) {
        case "Marché":
            return <MarchéTable data={data}  onDelete={onDelete} onDetail={onDetail} />;
        case "Fournisseur":
            return <FournisseurTable data={data}  onDelete={onDelete} onDetail={onDetail}/>;
        case "Article":
            return <ArticleTable data={data}  onDelete={onDelete} onDetail={onDetail}/>;
        case "Compte":
            return <CompteTable data={data}  onDelete={onDelete} onDetail={onDetail}/>;
        case "Entité Admin.":
            return <EntiteAdminTable data={data}  onDelete={onDelete} onDetail={onDetail}/>;
        case "Type de matériel":
            return <TypeTable data={data}  onDelete={onDelete} onDetail={onDetail}/>;
        default:
            return <div className="text-center text-gray-500">No tables available for this entity.</div>;
    }
}





const MarchéTable = ({ data, onDelete, onDetail }) => {
    return (
        <table className="w-full my-12">
            <thead>
                <tr className="bg-indigo-400">
                    <th className="px-4 py-2 text-left text-sm"></th>
                    <th className="px-4 py-2 text-left text-sm">Reference</th>
                    <th className="px-4 py-2 text-left text-sm">Type</th>
                    <th className="px-4 py-2 text-left text-sm">Objet</th>
                    <th className="px-4 py-2 text-left text-sm">Fournisseur</th>
                    <th className="px-4 py-2 text-left text-sm">Date</th>
                    <th className="px-4 py-2 text-left text-sm"></th>
                </tr>
            </thead>
            <tbody>
                {
                    Array(12).fill(0).map((_, index) => (
                        <tr key={index} className="hover:bg-indigo-100 transition-colors odd:bg-white even:bg-gray-50 shadow-md rounded-md my-2">
                            <td className="px-4 py-2"><StoreIcon size={24} color="#818cf8"/></td>
                            <td className="px-4 py-2 text-xs">12/2025</td>
                            <td className="px-4 py-2 text-xs">Something</td>
                            <td className="px-4 py-2 text-xs">Fourniture</td>
                            <td className="px-4 py-2 text-xs">Ahmed Foughali</td>
                            <td className="px-4 py-2 text-xs">1/12/2025</td>
                            <td className="px-4 py-2 text-xs flex gap-2">
                                <button onClick={onDetail} className="p-2 shadow-sm border border-indigo-300  rounded-md hover:shadow-md transition-shadow"><FormInput color="#818cf8" size={20}/></button>
                                <button onClick={onDelete} className="p-2 shadow-sm border border-red-300 rounded-md hover:shadow-md transition-shadow"><Trash2 color="#f87171" size={20}/></button>
                            </td>
                        </tr>
                    ))
                }
                
                
            </tbody>
        </table>
    )
}

const FournisseurTable = ({ data, onDelete, onDetail }) => {
    return (
        <table className="w-full my-12">
            
            <thead>
                <tr className="bg-amber-500">
                    <th className="px-4 py-2 text-left text-sm"></th>
                    <th className="px-4 py-2 text-left text-sm">Nom</th>
                    <th className="px-4 py-2 text-left text-sm">Qualite</th>
                    <th className="px-4 py-2 text-left text-sm">Societe</th>
                    <th className="px-4 py-2 text-left text-sm">Patente</th>
                    <th className="px-4 py-2 text-left text-sm">RC</th>
                    <th className="px-4 py-2 text-left text-sm">CNSS</th>
                    <th className="px-4 py-2 text-left text-sm">Adresse</th>
                    <th className="px-4 py-2 text-left text-sm">RIB</th>
                    <th className="px-4 py-2 text-left text-sm"></th>
                </tr>
            </thead>
            <tbody>
                {
                    Array(12).fill(0).map((_, index) => (
                        <tr key={index} className="hover:bg-amber-100 transition-colors odd:bg-white even:bg-gray-50 shadow-md rounded-md my-2">
                            <td className="px-4 py-2"><Handshake size={24} color="#f59e0b"/></td>
                            <td className="px-4 py-2 text-xs">Fouad Ghalam</td>
                            <td className="px-4 py-2 text-xs">Gerant</td>
                            <td className="px-4 py-2 text-xs">PPC</td>
                            <td className="px-4 py-2 text-xs">N° 478258</td>
                            <td className="px-4 py-2 text-xs">GH546</td>
                            <td className="px-4 py-2 text-xs">ghf5465</td>
                            <td className="px-4 py-2 text-xs">Arfoud</td>
                            <td className="px-4 py-2 text-xs">0211222554000000145528</td>
                            <td className="px-4 py-2 flex gap-2">
                                <button onClick={onDetail} className="p-2 shadow-sm border border-amber-400  rounded-md hover:shadow-md transition-shadow"><FormInput color="#f59e0b" size={20}/></button>
                                <button onClick={onDelete} className="p-2 shadow-sm border border-red-300 rounded-md hover:shadow-md transition-shadow"><Trash2 color="#f87171" size={20}/></button>
                            </td>
                        </tr>
                    ))
                }
                
                
            </tbody>
        </table>
    )
}

const ArticleTable = ({ data, onDelete, onDetail }) => {
    return (
        <table className="w-full my-12">
            
            <thead>
                <tr className="bg-cyan-500">
                    <th className="px-4 py-2 text-left text-sm"></th>
                    <th className="px-4 py-2 text-left text-sm">Marché</th>
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
                    Array(12).fill(0).map((_, index) => (
                        <tr key={index} className="hover:bg-cyan-100 transition-colors odd:bg-white even:bg-gray-50 shadow-md rounded-md my-2">
                            <td className="px-4 py-2"><BoxIcon size={24} color="#06b6d4"/></td>
                            <td className="px-4 py-2 text-xs">14/122</td>
                            <td className="px-4 py-2 text-xs">1</td>
                            <td className="px-4 py-2 text-xs">SDCD35455DSV</td>
                            <td className="px-4 py-2 text-xs">RHNRWXE</td>
                            <td className="px-4 py-2 text-xs">11/02/2024</td>
                            <td className="px-4 py-2 text-xs">Oui</td>
                            <td className="px-4 py-2 text-xs flex gap-2">
                                <button onClick={onDetail} className="p-2 shadow-sm border border-cyan-400  rounded-md hover:shadow-md transition-shadow"><FormInput color="#06b6d4" size={20}/></button>
                                <button onClick={onDelete} className="p-2 shadow-sm border border-red-300 rounded-md hover:shadow-md transition-shadow"><Trash2 color="#f87171" size={20}/></button>
                            </td>
                        </tr>
                    ))
                }
                
                
            </tbody>
        </table>
    )
}

const CompteTable = ({ data, onDelete, onDetail }) => {
    return (
        <table className="w-full my-12">
            
            <thead>
                <tr className="bg-rose-500">
                    <th className="px-4 py-2 text-left text-sm"></th>
                    <th className="px-4 py-2 text-left text-sm">Pseudo</th>
                    <th className="px-4 py-2 text-left text-sm">Password</th>
                    <th className="px-4 py-2 text-left text-sm">Role</th>
                    <th className="px-4 py-2 text-left text-sm"></th>
                </tr>
            </thead>
            <tbody>
                {
                    Array(12).fill(0).map((_, index) => (
                        <tr key={index} className="hover:bg-rose-100 transition-colors odd:bg-white even:bg-gray-50 shadow-md rounded-md my-2">
                            <td className="px-4 py-2 text-xs"><User2 size={24} color="#f43f5e"/></td>
                            <td className="px-4 py-2 text-xs">smail14</td>
                            <td className="px-4 py-2 text-xs">12345</td>
                            <td className="px-4 py-2 text-xs">Admin</td>
                            <td className="px-4 py-2 text-xs flex gap-2">
                                <button onClick={onDetail} className="p-2 shadow-sm border border-rose-400  rounded-md hover:shadow-md transition-shadow"><FormInput color="#f43f5e" size={20}/></button>
                                <button onClick={onDelete} className="p-2 shadow-sm border border-red-300 rounded-md hover:shadow-md transition-shadow"><Trash2 color="#f87171" size={20}/></button>
                            </td>
                        </tr>
                    ))
                }
                
                
            </tbody>
        </table>
    )
}

const EntiteAdminTable = ({ data, onDelete, onDetail }) => {
    return (
        <table className="w-full my-12">
            
            <thead>
                <tr className="bg-green-500">
                    <th className="px-4 py-2 text-left text-sm"></th>
                    <th className="px-4 py-2 text-left text-sm">Libelle en Arabe</th>
                    <th className="px-4 py-2 text-left text-sm">Libelle en Français</th>
                    <th className="px-4 py-2 text-left text-sm"></th>
                </tr>
            </thead>
            <tbody>
                {
                    Array(12).fill(0).map((_, index) => (
                        <tr key={index} className="hover:bg-green-100 transition-colors odd:bg-white even:bg-gray-50 shadow-md rounded-md my-2">
                            <td className="px-4 py-2"><Building2 size={24} color="#22c55e"/></td>
                            <td className="px-4 py-2 text-xs">مصلحة الشؤون الطلابية</td>
                            <td className="px-4 py-2 text-xs">Scolarité </td>
                            <td className="px-4 py-2 flex gap-2">
                                <button onClick={onDetail} className="p-2 shadow-sm border border-green-400  rounded-md hover:shadow-md transition-shadow"><FormInput color="#22c55e" size={20}/></button>
                                <button onClick={onDelete} className="p-2 shadow-sm border border-red-300 rounded-md hover:shadow-md transition-shadow"><Trash2 color="#f87171" size={20}/></button>
                            </td>
                        </tr>
                    ))
                }
                
                
            </tbody>
        </table>
    )
}

const TypeTable = ({ data, onDelete, onDetail }) => {
    return (
        <table className="w-full my-12">
            
            <thead>
                <tr className="bg-purple-500">
                    <th className="px-4 py-2 text-left text-sm"></th>
                    <th className="px-4 py-2 text-left text-sm">Ordre</th>
                    <th className="px-4 py-2 text-left text-sm">Libelle</th>
                    <th className="px-4 py-2 text-left text-sm"></th>
                </tr>
            </thead>
            <tbody>
                {
                    Array(12).fill(0).map((_, index) => (
                        <tr key={index} className="hover:bg-purple-100 transition-colors odd:bg-white even:bg-gray-50 shadow-md rounded-md my-2">
                            <td className="px-4 py-2"><TagIcon size={24} color="#a855f7"/></td>
                            <td className="px-4 py-2 text-xs">1</td>
                            <td className="px-4 py-2 text-xs">Ordinateur</td>
                            <td className="px-4 py-2 flex gap-2">
                                <button onClick={onDetail} className="p-2 shadow-sm border border-purple-400  rounded-md hover:shadow-md transition-shadow"><FormInput color="#a855f7" size={20}/></button>
                                <button onClick={onDelete} className="p-2 shadow-sm border border-red-300 rounded-md hover:shadow-md transition-shadow"><Trash2 color="#f87171" size={20}/></button>
                            </td>
                        </tr>
                    ))
                }
                
                
            </tbody>
        </table>
    )
}