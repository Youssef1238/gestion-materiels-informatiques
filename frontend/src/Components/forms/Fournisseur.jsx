import api from "@/utils/Api";
import { CircleAlert } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLayout from "../layout/FormLayout";

export default function FournisseurForm({ type, onClose, data }) {

            switch(type) {
                case 'add':   
                    return <AddFournisseurForm onClose={onClose}/>;
                case 'detail':
                    return <DetailFournisseurForm onClose={onClose} Fournisseur={data}/>;
                default:
                    return null;
                
            }

}

function ValidateInput(nom,qualite,societe,capital,patente,RCLieu,RCNum,CNSS,adresse,RIB,setError){
        const regex1 = /^[a-zA-Z ]+$/;
        const regex2 = /^[0-9]+$/;
        const regex3 = /^[a-zA-Z0-9° ]+$/;

        const errorNom = nom?regex1.test(nom)?nom.trim() == ""?"Nom est Obligatoire":"":"juste a-z A-Z sont accepté pour Nom":"Nom est Obligatoire"
        const errorQualite = qualite?regex1.test(qualite)?qualite.trim() == ""?"Qualité est Obligatoire":"":"juste a-z A-Z sont accepté pour Qualité":"Qualité est Obligatoire"
        const errorSociete = societe?regex1.test(societe)?societe.trim() == ""?"Société est Obligatoire":"":"juste a-z A-Z sont accepté pour Société":"Société est Obligatoire"
        const errorCapital = capital && regex2.test(capital)?capital <= 0?"Format Incorrecte de Capital":"":"Capital (Nombre) est Obligatoire"
        const errorPatente = patente && regex2.test(patente)?patente <= 0?"Format Incorrecte de Patente":"":"Patente (Nombre) est Obligatoire"
        const errorRCLieu = RCLieu ?regex3.test(RCLieu)?RCLieu.trim() == ""?"RCLieu est Obligatoire":"":"Format Incorrecte de RCLieu":"RCLieu est Obligatoire"
        const errorRCNum = RCNum && regex2.test(RCNum)?RCNum <= 0?"Format Incorrecte de RCNum":"":"Capital (Nombre) est RCNum"
        const errorCNSS = CNSS && regex2.test(CNSS)?CNSS <= 0?"Format Incorrecte de CNSS":"":"CNSS (Nombre) est Obligatoire"
        const errorAdresse = adresse?regex3.test(adresse)?adresse.trim() == ""?"Adresse est Obligatoire":"":"Format Incorrecte de Adresse":"Adresse est Obligatoire"
        const errorRIB = RIB && regex2.test(RIB)?RIB <= 0?"Format Incorrecte de RIB":"":"RIB (Nombre) est Obligatoire"
        const error = errorNom + errorQualite + errorSociete + errorCapital + errorPatente + errorRCLieu + errorRCNum + errorCNSS + errorAdresse + errorRIB
        setError([errorNom,errorQualite,errorSociete,errorPatente,errorRCLieu,errorRCNum,errorCapital,errorRIB,errorCNSS,errorAdresse])
        return error
        
}


const AddFournisseurForm = ({onClose}) => {
    // Nom , Qualite , Societe , Patente  , RCLieu , RCNum , Capital , RIB , CNSS , Adress 
    const [Error,setError] = useState(["","","","","","","","","",""])
    const Navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        console.log(data)

        const error = ValidateInput(data["Nom"],data["Qualité"],data["Société"],data["Capital"],data["Patente"],
            data["RCLieu"] , data["RCNum"] , data["CNSS"] , data["Adress"] , data["RIB"] , setError
        )

        if(error == ""){
            try {
                await api.post('fournisseur',{
                    nom : data["Nom"].trim(),
                    qualite : data["Qualité"].trim(),
                    nom_societe : data["Société"].trim(),
                    capital : data["Capital"].trim(),
                    patente : data["Patente"].trim(),
                    RC_lieu : data["RCLieu"].trim(),
                    RC_num : data["RCNum"].trim(),
                    CNSS : data["CNSS"].trim(),
                    adresse : data["Adress"].trim(),
                    RIB : data["RIB"].trim(),
                })
                onClose();
            } catch(err){
                
                Navigate('/error')
                
            }
        }
    }
            return (
                    <FormLayout onClose={onClose} onSubmit={handleSubmit} onReset={()=>setError([])}
                    Title={"Ajouter un Fournisseur"}  Type={"add"} >
                    
                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3  w-full">
                                    <label htmlFor="Nom" className="text-sm font-medium font-Roboto">Nom</label>
                                    <input type="text" id="Nom" placeholder="Nom" name="Nom"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[0]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[0] ? <CircleAlert size={16}/>: null }{Error[0] ?? " " }</p>
                            </div> 
                            
                            
                        </div>
                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3 flex-start w-1/3">
                                        <label htmlFor="Qualité" className="text-sm font-medium font-Roboto">Qualité</label>
                                        <input type="text" id="Qualité" placeholder="Qualité" name="Qualité"  className={"input-base w-full px-4 py-2 text-xs " + (Error[1]?"border-red-500":"")}/>
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[1] ? <CircleAlert size={16}/>: null }{Error[1] ?? " " }</p>
                            </div>
                            <div className="flex flex-col gap-3  w-1/3">
                                    <label htmlFor="Société" className="text-sm font-medium font-Roboto">Société</label>
                                    <input type="text" id="Société" placeholder="Société" name="Société"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[2]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[2] ? <CircleAlert size={16}/>: null }{Error[2] ?? " " }</p>
                            </div> 
                            <div className="flex flex-col gap-3 flex-start w-1/3">
                                        <label htmlFor="Patente" className="text-sm font-medium font-Roboto">Patente</label>
                                        <input type="text" id="Patente" placeholder="Patente" name="Patente"  className={"input-base w-full px-4 py-2 text-xs " + (Error[3]?"border-red-500":"")}/>
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[3] ? <CircleAlert size={16}/>: null }{Error[3] ?? " " }</p>
                            </div>
                            
                        </div>
                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3  w-1/3">
                                    <label htmlFor="RCLieu" className="text-sm font-medium font-Roboto">RC Lieu</label>
                                    <input type="text" id="RCLieu" placeholder="RC Lieu" name="RCLieu"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[4]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[4] ? <CircleAlert size={16}/>: null }{Error[4] ?? " " }</p>
                            </div> 
                            <div className="flex flex-col gap-3   w-1/3">
                                    <label htmlFor="RCNum" className="text-sm font-medium font-Roboto">RC Numero</label>
                                    <input type="text" id="RCNum" placeholder="RC Numero" name="RCNum"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[5]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[5] ? <CircleAlert size={16}/>: null }{Error[5] ?? " " }</p>
                            </div> 
                            <div className="flex flex-col gap-3   w-1/3">
                                    <label htmlFor="Capital" className="text-sm font-medium font-Roboto">Capital</label>
                                    <input type="text" id="Capital" placeholder="Capital" name="Capital"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[6]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[6] ? <CircleAlert size={16}/>: null }{Error[6] ?? " " }</p>
                            </div> 
                        </div>

                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3   w-1/3">
                                    <label htmlFor="RIB" className="text-sm font-medium font-Roboto">RIB</label>
                                    <input type="text" id="RIB" placeholder="RIB" name="RIB"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[7]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[7] ? <CircleAlert size={16}/>: null }{Error[7] ?? " " }</p>
                            </div>
                            <div className="flex flex-col gap-3   w-1/3">
                                    <label htmlFor="CNSS" className="text-sm font-medium font-Roboto">CNSS</label>
                                    <input type="text" id="CNSS" placeholder="CNSS" name="CNSS"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[8]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[8] ? <CircleAlert size={16}/>: null }{Error[8] ?? " " }</p>
                            </div> 
                            <div className="flex flex-col gap-3   w-1/3">
                                    <label htmlFor="Adress" className="text-sm font-medium font-Roboto">Adresse</label>
                                    <input type="text" id="Adress" placeholder="Adresse" name="Adress"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[9]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[9] ? <CircleAlert size={16}/>: null }{Error[9] ?? " " }</p>
                            </div>
                            
                        </div>
                        
                    </FormLayout>
               
            );
}
const DetailFournisseurForm = ({onClose , Fournisseur}) => {
    // Nom , Qualite , Societe , Patente  , RCLieu , RCNum , Capital , RIB , CNSS , Adress 
    const [Error,setError] = useState(["","","","","","","","","",""])
    const [Locked,setLocked] = useState(false)
    const Navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        console.log(data)

        const error = ValidateInput(data["Nom"],data["Qualité"],data["Société"],data["Capital"],data["Patente"],
            data["RCLieu"] , data["RCNum"] , data["CNSS"] , data["Adress"] , data["RIB"] , setError
        )

        if(error == ""){
            try {
                await api.put('fournisseur',{
                    id : Fournisseur._id,
                    nom : data["Nom"].trim(),
                    qualite : data["Qualité"].trim(),
                    nom_societe : data["Société"].trim(),
                    capital : data["Capital"].trim(),
                    patente : data["Patente"].trim(),
                    RC_lieu : data["RCLieu"].trim(),
                    RC_num : data["RCNum"].trim(),
                    CNSS : data["CNSS"].trim(),
                    adresse : data["Adress"].trim(),
                    RIB : data["RIB"].trim(),
                })
                onClose();
            } catch(err){
                
                Navigate('/error')
                
            }
        }
    }
            return (
                    <FormLayout onClose={onClose} onSubmit={handleSubmit} onReset={()=>setError([])}
                    Title={"Modifier le Fournisseur"} Locked={Locked} Type={"detail"} setLocked={setLocked}>
                    

                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3  w-full">
                                    <label htmlFor="Nom" className="text-sm font-medium font-Roboto">Nom</label>
                                    <input type="text" defaultValue={Fournisseur.nom} id="Nom" placeholder="Nom" name="Nom" disabled={Locked}  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[0]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[0] ? <CircleAlert size={16}/>: null }{Error[0] ?? " " }</p>
                            </div> 
                            
                            
                        </div>
                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3 flex-start w-1/3">
                                        <label htmlFor="Qualité" className="text-sm font-medium font-Roboto">Qualité</label>
                                        <input type="text" defaultValue={Fournisseur.qualite} id="Qualité" placeholder="Qualité" name="Qualité" disabled={Locked}  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[1]?"border-red-500":"")}/>
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[1] ? <CircleAlert size={16}/>: null }{Error[1] ?? " " }</p>
                            </div>
                            <div className="flex flex-col gap-3  w-1/3">
                                    <label htmlFor="Société" className="text-sm font-medium font-Roboto">Société</label>
                                    <input type="text" defaultValue={Fournisseur.nom_societe} id="Société" placeholder="Société" name="Société" disabled={Locked}  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[2]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[2] ? <CircleAlert size={16}/>: null }{Error[2] ?? " " }</p>
                            </div> 
                            <div className="flex flex-col gap-3 flex-start w-1/3">
                                        <label htmlFor="Patente" className="text-sm font-medium font-Roboto">Patente</label>
                                        <input type="text" defaultValue={Fournisseur.patente} id="Patente" placeholder="Patente" name="Patente" disabled={Locked}  className={"input-base w-full px-4 py-2 text-xs  disabled:border-gray-300 " + (Error[3]?"border-red-500":"")}/>
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[3] ? <CircleAlert size={16}/>: null }{Error[3] ?? " " }</p>
                            </div>
                            
                        </div>
                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3  w-1/3">
                                    <label htmlFor="RCLieu" className="text-sm font-medium font-Roboto">RC Lieu</label>
                                    <input type="text" defaultValue={Fournisseur.RC_lieu} id="RCLieu" placeholder="RC Lieu" name="RCLieu" disabled={Locked}  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[4]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[4] ? <CircleAlert size={16}/>: null }{Error[4] ?? " " }</p>
                            </div> 
                            <div className="flex flex-col gap-3   w-1/3">
                                    <label htmlFor="RCNum" className="text-sm font-medium font-Roboto">RC Numero</label>
                                    <input type="text" defaultValue={Fournisseur.RC_num} id="RCNum" placeholder="RC Numero" name="RCNum" disabled={Locked}  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[5]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[5] ? <CircleAlert size={16}/>: null }{Error[5] ?? " " }</p>
                            </div> 
                            <div className="flex flex-col gap-3   w-1/3">
                                    <label htmlFor="Capital" className="text-sm font-medium font-Roboto">Capital</label>
                                    <input type="text" defaultValue={Fournisseur.capital} id="Capital" placeholder="Capital" name="Capital" disabled={Locked}  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[6]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[6] ? <CircleAlert size={16}/>: null }{Error[6] ?? " " }</p>
                            </div> 
                        </div>

                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3   w-1/3">
                                    <label htmlFor="RIB" className="text-sm font-medium font-Roboto">RIB</label>
                                    <input type="text" defaultValue={Fournisseur.RIB} id="RIB" placeholder="RIB" name="RIB" disabled={Locked} className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[7]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[7] ? <CircleAlert size={16}/>: null }{Error[7] ?? " " }</p>
                            </div>
                            <div className="flex flex-col gap-3   w-1/3">
                                    <label htmlFor="CNSS" className="text-sm font-medium font-Roboto">CNSS</label>
                                    <input type="text" defaultValue={Fournisseur.CNSS} id="CNSS" placeholder="CNSS" name="CNSS" disabled={Locked} className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[8]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[8] ? <CircleAlert size={16}/>: null }{Error[8] ?? " " }</p>
                            </div> 
                            <div className="flex flex-col gap-3   w-1/3">
                                    <label htmlFor="Adress" className="text-sm font-medium font-Roboto">Adresse</label>
                                    <input type="text" defaultValue={Fournisseur.adresse} id="Adresse" placeholder="Adress" name="Adress" disabled={Locked} className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[9]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[9] ? <CircleAlert size={16}/>: null }{Error[9] ?? " " }</p>
                            </div>
                            
                        </div>
                        
                    </FormLayout>
               
            );
}