import  { Trash2, StoreIcon, Handshake, BoxIcon, User2, Building2, TagIcon, FormInput, ArrowRight } from "lucide-react"
import api from "@/utils/Api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function Table({ entity, data, setChanged , onDetail }) {
    switch (entity) {
        case "Marché":
            return <MarchéTable data={data}  setChanged={setChanged} onDetail={onDetail} />;
        case "Fournisseur":
            return <FournisseurTable data={data}  setChanged={setChanged} onDetail={onDetail}/>;
        case "Article":
            return <ArticleTable data={data}  setChanged={setChanged} onDetail={onDetail}/>;
        case "Compte":
            return <CompteTable data={data}  setChanged={setChanged} onDetail={onDetail}/>;
        case "Entité Admin.":
            return <EntiteAdminTable data={data}  setChanged={setChanged} onDetail={onDetail}/>;
        case "Type de matériel":
            return <TypeTable data={data}  setChanged={setChanged} onDetail={onDetail}/>;
        default:
            return <div className="text-center text-gray-500">No tables available for this entity.</div>;
    }
}





const MarchéTable = ({ data }) => {
    const Navigate = useNavigate()
    const onDetail = (id) => {
        Navigate('/Marché', { state: { marchéId: id } });
    }
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
                    
                </tr>
            </thead>
            <tbody>
                {
                    data.map((e, index) => (
                        <tr key={index} className="relative group hover:bg-indigo-100 transition-colors odd:bg-white even:bg-gray-50 shadow-md rounded-md my-2">
                            <td className="px-4 py-2 group-hover:z-10 group-hover:relative"><StoreIcon size={24} color="#818cf8"/></td>
                            <td className="px-4 py-2 text-xs group-hover:z-10 group-hover:relative">{e.reference}</td>
                            <td className="px-4 py-2 text-xs">{e.type}</td>
                            <td className="px-4 py-2 text-xs">{e.objet}</td>
                            <td className="px-4 py-2 text-xs">{e.fournisseur.nom}</td>
                            <td className="px-4 py-2 text-xs">{e.date_creation.split('T')[0]}</td>
                            <td className="w-1">
                                <div className="absolute inset-0 z-0 bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={()=>onDetail(e._id)} className="px-6 py-2 shadow-none flex items-center justify-center gap-2 text-xs text-black hover:text-indigo-300 transition-colors">Consulter <ArrowRight/></button>
                                </div>
                            </td>
                        </tr>
                    ))
                }
                {

                }
                
            </tbody>
        </table>
    )
}

const FournisseurTable = ({ data, setChanged, onDetail }) => {
    const Navigate = useNavigate()
    const [isDelete,setIsDelete] = useState(null)
    const sliceAdresse = (add) =>{
        return add.split(" ").slice(0,2).join(' ')
    }
    const deleteFournisseur = async (id)=>{
        try {
            await api.delete('http://localhost:5500/fournisseur',{
                    data : {id : id}
            })
            setChanged(c=>!c)
        } catch (error) {
            Navigate('/error')
        }
    }
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
                    data.map((e, index) => (
                        <tr key={index} className="relative hover:bg-amber-100 transition-colors odd:bg-white even:bg-gray-50 shadow-md rounded-md my-2">
                            <td className="px-4 py-2"><Handshake size={24} color="#f59e0b"/></td>
                            <td className="px-4 py-2 text-xs">{e.nom}</td>
                            <td className="px-4 py-2 text-xs">{e.qualite}</td>
                            <td className="px-4 py-2 text-xs">{e.nom_societe}</td>
                            <td className="px-4 py-2 text-xs">{e.patente}</td>
                            <td className="px-4 py-2 text-xs">{e.RC_lieu + " " + e.RC_num}</td>
                            <td className="px-4 py-2 text-xs">{e.CNSS}</td>
                            <td className="px-4 py-2 text-xs">{sliceAdresse(e.adresse)}</td>
                            <td className="px-4 py-2 text-xs">{e.RIB}</td>
                            <td className="px-4 py-2 flex gap-2">
                                <button onClick={()=>onDetail(e)} className="p-2 shadow-sm border border-amber-400  rounded-md hover:shadow-md transition-shadow"><FormInput color="#f59e0b" size={20}/></button>
                                <button onClick={()=>setIsDelete(index)} className="p-2 shadow-sm border border-red-300 rounded-md hover:shadow-md transition-shadow"><Trash2 color="#f87171" size={20}/></button>
                            </td>
                            {
                                isDelete == index?
                                <td className="absolute bg-white bg-opacity-90 left-0 right-0 top-0 bottom-0 flex justify-around items-center gap-2 p-4 z-10 shadow-lg">
                                    <h1 className="font-light bg-white text-xs  text-wrap text-gray-700">Toutes les données et relations liées à ce fournisseur seront également supprimées !</h1>
                                    <div className="flex gap-2 ">
                                        <button onClick={()=>deleteFournisseur(e._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Confirmer</button>
                                        <button onClick={()=>setIsDelete(null)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">Annuler</button>
                                    </div>
                                </td>
                                :
                                null
                            }
                        </tr>
                    ))
                }
                
                
            </tbody>
        </table>
    )
}

const ArticleTable = ({ data }) => {
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
                    
                </tr>
            </thead>
            <tbody>
                {
                    data.map((e, index) => (
                        <tr key={index} className="hover:bg-cyan-100 transition-colors odd:bg-white even:bg-gray-50 shadow-md rounded-md my-2">
                            <td className="px-4 py-2"><BoxIcon size={24} color="#06b6d4"/></td>
                            <td className="px-4 py-2 text-xs">{e.marcheReference}</td>
                            <td className="px-4 py-2 text-xs">{e.Numero}</td>
                            <td className="px-4 py-2 text-xs">{e.Numero_Serie}</td>
                            <td className="px-4 py-2 text-xs">{e.cab}</td>
                            <td className="px-4 py-2 text-xs">{e.date_Livraison.split('T')[0]}</td>
                            <td className="px-4 py-2 text-xs">{e.etat?"Oui":"Non"}</td>
                            
                        </tr>
                    ))
                }
                
                
            </tbody>
        </table>
    )
}

const CompteTable = ({ data, setChanged, onDetail }) => {
    const Navigate = useNavigate()
    const [isDelete,setIsDelete] = useState(null)
    const deleteUser = async (id)=>{
        try {
            await api.delete(`http://localhost:5500/user`,{
                data : {id : id}
                
            },)
            setChanged(c=>!c)
        } catch (error) {
            Navigate('/error')
        }
    }
    return (
        <table className="w-full my-12">
            
            <thead>
                <tr className="bg-rose-500">
                    <th className="px-4 py-2 text-left text-sm"></th>
                    <th className="px-4 py-2 text-left text-sm">Pseudo</th>
                    <th className="px-4 py-2 text-left text-sm">Role</th>
                    <th className="px-4 py-2 text-left text-sm"></th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((e, index) => (
                        <tr key={index} className="relative hover:bg-rose-100 transition-colors odd:bg-white even:bg-gray-50 shadow-md rounded-md my-2">
                            <td className="px-4 py-2 text-xs"><User2 size={24} color="#f43f5e"/></td>
                            <td className="px-4 py-2 text-xs">{e.pseudo}</td>
                            <td className="px-4 py-2 text-xs">{e.admin?"Admin":"Editeur"}</td>
                            <td className="px-4 py-2 text-xs flex gap-2">
                                <button onClick={()=>onDetail(e)} className="p-2 shadow-sm border border-rose-400  rounded-md hover:shadow-md transition-shadow"><FormInput color="#f43f5e" size={20}/></button>
                                <button onClick={()=>setIsDelete(index)} className="p-2 shadow-sm border border-red-300 rounded-md hover:shadow-md transition-shadow"><Trash2 color="#f87171" size={20}/></button>
                            </td>
                            {
                                isDelete == index?
                                <td className="absolute bg-white bg-opacity-90 left-0 right-0 top-0 bottom-0 flex justify-around items-center gap-2 p-4 z-10 shadow-lg">
                                    <h1 className="font-light bg-white text-xs  text-wrap text-gray-700">Êtes-vous sûr de vouloir supprimer ce compte ? Cette action est irréversible.</h1>
                                    <div className="flex gap-2 ">
                                        <button onClick={()=>deleteUser(e._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Confirmer</button>
                                        <button onClick={()=>setIsDelete(null)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">Annuler</button>
                                    </div>
                                </td>
                                :
                                null
                            }
                        </tr>
                    ))
                }
                
                
            </tbody>
        </table>
    )
}

const EntiteAdminTable = ({ data, setChanged, onDetail }) => {
    const Navigate = useNavigate()
    const [isDelete,setIsDelete] = useState(null)
    const deleteEntiteAdmin = async (id)=>{
        try {
            await api.delete('http://localhost:5500/entiteAdmin',{
                data : {id : id}
            })
            setChanged(c=>!c)
        } catch (error) {
            Navigate('/error')
        }
    }
    const onAffecte = (id)=>{
        Navigate('/EntitéAdmin', { state: { entitéAdminId: id } });
    }
    return (
        <table className="w-full my-12">
            <thead>
                <tr className="bg-green-500">
                    <th className="px-4 py-2 text-left text-sm"></th>
                    <th className="px-4 py-2 text-left text-sm">Libelle en Français</th>
                    <th className="px-4 py-2 text-left text-sm">Libelle en Arabe</th>
                    <th className="px-4 py-2 text-left text-sm"></th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((e, index) => (
                        <tr key={index} className="relative group hover:bg-green-100 transition-colors odd:bg-white even:bg-gray-50 shadow-md rounded-md my-2">
                            <td className="px-4 py-2 group-hover:z-10 group-hover:relative"><Building2 size={24} color="#22c55e"/></td>
                            <td className="px-4 py-2 text-xs group-hover:z-10 group-hover:relative">{e.libelle_fr}</td>
                            <td className="px-4 py-2 text-xs">{e.libelle_ar}</td>
                            <td className="px-4 py-2 flex gap-2">
                                <button onClick={()=>onDetail(e)} className="p-2 shadow-sm border border-green-400  rounded-md hover:shadow-md transition-shadow"><FormInput color="#22c55e" size={20}/></button>
                                <button onClick={()=>setIsDelete(index)} className="p-2 shadow-sm border border-red-300 rounded-md hover:shadow-md transition-shadow"><Trash2 color="#f87171" size={20}/></button>
                            </td>
                            <td className="w-1">
                                <div className="absolute inset-0 z-0 bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={()=>onAffecte(e._id)} className="px-6 py-2 shadow-none flex items-center justify-center gap-2 text-xs text-black hover:text-green-500 transition-colors">Consulter <ArrowRight/></button>
                                </div>
                            </td>
                            {
                                isDelete == index?
                                <td className="absolute bg-white bg-opacity-90 left-0 right-0 top-0 bottom-0 flex justify-around items-center gap-2 p-4 z-10 shadow-lg">
                                    <h1 className="font-light bg-white text-xs  text-wrap text-gray-700">Toutes les données et relations liées à cette entité seront également supprimées !</h1>
                                    <div className="flex gap-2 ">
                                        <button onClick={()=>deleteEntiteAdmin(e._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Confirmer</button>
                                        <button onClick={()=>setIsDelete(null)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">Annuler</button>
                                    </div>
                                </td>
                                :
                                null
                            }
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

const TypeTable = ({ data, setChanged, onDetail }) => {
    const Navigate = useNavigate()
    const [isDelete,setIsDelete] = useState(null)
    const deleteType = async (id)=>{
        try {
            await api.delete('http://localhost:5500/type',{
                    data : {id : id}   
            })
            setChanged(c=>!c)
        } catch (error) {
            Navigate('/error')
        }
    }
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
                    data.map((e, index) => (
                        <tr key={index} className="relative hover:bg-purple-100 transition-colors odd:bg-white even:bg-gray-50 shadow-md rounded-md my-2">
                            <td className="px-4 py-2"><TagIcon size={24} color="#a855f7"/></td>
                            <td className="px-4 py-2 text-xs">{e.order}</td>
                            <td className="px-4 py-2 text-xs">{e.libelle}</td>
                            <td className="px-4 py-2 flex gap-2">
                                <button onClick={()=>onDetail(e)} className="p-2 shadow-sm border border-purple-400  rounded-md hover:shadow-md transition-shadow"><FormInput color="#a855f7" size={20}/></button>
                                <button onClick={()=>setIsDelete(index)} className="p-2 shadow-sm border border-red-300 rounded-md hover:shadow-md transition-shadow"><Trash2 color="#f87171" size={20}/></button>
                            </td>
                            {
                                isDelete == index?
                                <td className="absolute bg-white bg-opacity-90 left-0 right-0 top-0 bottom-0 flex justify-around items-center gap-2 p-4 z-10 shadow-lg">
                                    <h1 className="font-light bg-white text-xs  text-wrap text-gray-700">Tous les articles associés à ce type seront également supprimés !</h1>
                                    <div className="flex gap-2 ">
                                        <button onClick={()=>deleteType(e._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Confirmer</button>
                                        <button onClick={()=>setIsDelete(null)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">Annuler</button>
                                    </div>
                                </td>
                                :
                                null
                            }
                        </tr>
                    ))
                }
                
                
            </tbody>
        </table>
    )
}