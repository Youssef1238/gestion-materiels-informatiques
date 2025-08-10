import { CircleAlert, Lock, RotateCcw, Unlock, UploadIcon } from "lucide-react";
import { useState } from "react";

export default function FournisseurForm({ type, onClose }) {

            switch(type) {
                case 'add':   
                    return <AddFournisseurForm onClose={onClose}/>;
                case 'detail':
                    return <DetailFournisseurForm onClose={onClose}/>;
                default:
                    return null;
                
            }

}

function ValidateInput(nom,qualite,societe,capital,patente,RCLieu,RCNum,CNSS,adresse,RIB,setError){
        const regex1 = /^[a-zA-Z ]+$/;
        const regex2 = /^[0-9]+$/;
        const regex3 = /^[a-zA-Z0-9° ]+$/;

        const errorNom = nom?regex1.test(nom)?nom.trim() == ""?"Required":"":"only a-z A-Z are allowed":"Required"
        const errorQualite = qualite?regex1.test(qualite)?qualite.trim() == ""?"Required":"":"only a-z A-Z are allowed":"Required"
        const errorSociete = societe?regex1.test(societe)?societe.trim() == ""?"Required":"":"only a-z A-Z are allowed":"Required"
        const errorCapital = capital && regex2.test(capital)?capital <= 0?"not Allowed":"":"a Number is Required"
        const errorPatente = patente && regex2.test(patente)?patente <= 0?"not Allowed":"":"a Number is Required"
        const errorRCLieu = RCLieu ?regex3.test(RCLieu)?RCLieu.trim() == ""?"Required":"":"unallowed caractere spotted":"Required"
        const errorRCNum = RCNum && regex2.test(RCNum)?RCNum <= 0?"not Allowed":"":"a Number is Required"
        const errorCNSS = CNSS && regex2.test(CNSS)?CNSS <= 0?"not Allowed":"":"a Number is Required"
        const errorAdress = adresse?regex3.test(adresse)?adresse.trim() == ""?"Required":"":"unallowed caractere spotted":"Required"
        const errorRIB = RIB && regex2.test(RIB)?RIB <= 0?"not Allowed":"":"a Number is Required"
        const error = errorNom + errorQualite + errorSociete + errorCapital + errorPatente + errorRCLieu + errorRCNum + errorCNSS + errorAdress + errorRIB
        setError([errorNom,errorQualite,errorSociete,errorPatente,errorRCLieu,errorRCNum,errorCapital,errorRIB,errorCNSS,errorAdress])
        return error
        
}


const AddFournisseurForm = ({onClose}) => {
    // Nom , Qualite , Societe , Patente  , RCLieu , RCNum , Capital , RIB , CNSS , Adress 
    const [Error,setError] = useState(["","","","","","","","","",""])
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        console.log(data)

        const error = ValidateInput(data["Nom"],data["Qualité"],data["Société"],data["Capital"],data["Patente"],
            data["RCLieu"] , data["RCNum"] , data["CNSS"] , data["Adress"] , data["RIB"] , setError
        )

        if(error == ""){
            onClose();
        }
    }
            return (
                
                    <form onSubmit={handleSubmit} className="bg-white w-1/2  h-fit rounded-md shadow-md flex flex-col items-center gap-2">
                        <div className="w-full py-4 flex justify-center items-center bg-gray-800 rounded-t-md">
                            <h2 className="text-2xl font-bold font-Montserrat text-white">Ajouter un Fournisseur</h2>
                        </div>

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
                                        <label htmlFor="Capital" className="text-sm font-medium font-Roboto">Patente</label>
                                        <input type="text" id="Capital" placeholder="Capital" name="Capital"  className={"input-base w-full px-4 py-2 text-xs " + (Error[3]?"border-red-500":"")}/>
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
                                    <label htmlFor="Adress" className="text-sm font-medium font-Roboto">Adress</label>
                                    <input type="text" id="Adress" placeholder="Adress" name="Adress"  className={"input-base w-full px-4 py-2 text-xs  " + (Error[9]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[9] ? <CircleAlert size={16}/>: null }{Error[9] ?? " " }</p>
                            </div>
                            
                        </div>
                        
                        <div className="w-full py-8 gap-8 flex justify-start items-center px-8 mt-8">
                            <div className="flex justify-center items-center w-full">
                                    <button type="submit" className="w-full bg-primary text-white flex justify-center hover:scale-105 transition-all active:bg-black" ><UploadIcon/></button>
                            </div>
                            <div className="flex justify-center items-center w-full">
                                    <button type="reset" className="w-full border border-primary text-primary flex justify-center hover:scale-105 transition-all active:bg-primary" ><RotateCcw/></button>
                            </div>
                        </div>

                    </form>
               
            );
}
const DetailFournisseurForm = ({onClose , id}) => {
    // Nom , Qualite , Societe , Patente  , RCLieu , RCNum , Capital , RIB , CNSS , Adress 
    const [Error,setError] = useState(["","","","","","","","","",""])
    const [Locked,setLocked] = useState(false)
    const Fournisseur = {
        Nom: "Ahmed halouma",
        Qualité: "Gérant",
        Société: "PPTA",
        Patente: "N° 12558874",
        RCLieu: "Casablanca",
        RCNum: 9857014,
        Capital: 221000,
        RIB: "051110000258999000114411002541100222112",
        CNSS: "JBKVS654SDF68SDV6",
        Adress: "Tmara" 
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        console.log(data)

        const error = ValidateInput(data["Nom"],data["Qualité"],data["Société"],data["Capital"],data["Patente"],
            data["RCLieu"] , data["RCNum"] , data["CNSS"] , data["Adress"] , data["RIB"] , setError
        )

        if(error == ""){
            onClose();
        }
    }
            return (
                
                    <form onSubmit={handleSubmit} className="bg-white w-1/2  h-fit rounded-md shadow-md flex flex-col items-center gap-2">
                        <div className="w-full px-8 py-4 flex justify-between items-center bg-gray-800 rounded-t-md">
                            <h2 className="text-2xl font-bold font-Montserrat text-white">Modifier le Fournisseur</h2>
                            <button type="button" className="text-white hover:scale-105" onClick={()=>setLocked(l=>!l)}>{Locked? <Lock/> : <Unlock/>}</button>
                        </div>

                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3  w-full">
                                    <label htmlFor="Nom" className="text-sm font-medium font-Roboto">Nom</label>
                                    <input type="text" defaultValue={Fournisseur.Nom} id="Nom" placeholder="Nom" name="Nom" disabled={Locked}  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[0]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[0] ? <CircleAlert size={16}/>: null }{Error[0] ?? " " }</p>
                            </div> 
                            
                            
                        </div>
                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3 flex-start w-1/3">
                                        <label htmlFor="Qualité" className="text-sm font-medium font-Roboto">Qualité</label>
                                        <input type="text" defaultValue={Fournisseur.Qualité} id="Qualité" placeholder="Qualité" name="Qualité" disabled={Locked}  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[1]?"border-red-500":"")}/>
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[1] ? <CircleAlert size={16}/>: null }{Error[1] ?? " " }</p>
                            </div>
                            <div className="flex flex-col gap-3  w-1/3">
                                    <label htmlFor="Société" className="text-sm font-medium font-Roboto">Société</label>
                                    <input type="text" defaultValue={Fournisseur.Société} id="Société" placeholder="Société" name="Société" disabled={Locked}  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[2]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[2] ? <CircleAlert size={16}/>: null }{Error[2] ?? " " }</p>
                            </div> 
                            <div className="flex flex-col gap-3 flex-start w-1/3">
                                        <label htmlFor="Capital" className="text-sm font-medium font-Roboto">Patente</label>
                                        <input type="text" defaultValue={Fournisseur.Patente} id="Capital" placeholder="Capital" name="Capital" disabled={Locked}  className={"input-base w-full px-4 py-2 text-xs  disabled:border-gray-300 " + (Error[3]?"border-red-500":"")}/>
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[3] ? <CircleAlert size={16}/>: null }{Error[3] ?? " " }</p>
                            </div>
                            
                        </div>
                        <div className="w-full px-8 flex gap-2 justify-start items-center">
                            <div className="flex flex-col gap-3  w-1/3">
                                    <label htmlFor="RCLieu" className="text-sm font-medium font-Roboto">RC Lieu</label>
                                    <input type="text" defaultValue={Fournisseur.RCLieu} id="RCLieu" placeholder="RC Lieu" name="RCLieu" disabled={Locked}  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[4]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[4] ? <CircleAlert size={16}/>: null }{Error[4] ?? " " }</p>
                            </div> 
                            <div className="flex flex-col gap-3   w-1/3">
                                    <label htmlFor="RCNum" className="text-sm font-medium font-Roboto">RC Numero</label>
                                    <input type="text" defaultValue={Fournisseur.RCNum} id="RCNum" placeholder="RC Numero" name="RCNum" disabled={Locked}  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[5]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[5] ? <CircleAlert size={16}/>: null }{Error[5] ?? " " }</p>
                            </div> 
                            <div className="flex flex-col gap-3   w-1/3">
                                    <label htmlFor="Capital" className="text-sm font-medium font-Roboto">Capital</label>
                                    <input type="text" defaultValue={Fournisseur.Capital} id="Capital" placeholder="Capital" name="Capital" disabled={Locked}  className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[6]?"border-red-500":"")}/>
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
                                    <label htmlFor="Adress" className="text-sm font-medium font-Roboto">Adress</label>
                                    <input type="text" defaultValue={Fournisseur.Adress} id="Adress" placeholder="Adress" name="Adress" disabled={Locked} className={"input-base w-full px-4 py-2 text-xs disabled:border-gray-300 " + (Error[9]?"border-red-500":"")}/>
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 h-6">{Error[9] ? <CircleAlert size={16}/>: null }{Error[9] ?? " " }</p>
                            </div>
                            
                        </div>
                        
                        <div className="w-full py-8 gap-8 flex justify-start items-center px-8 mt-8">
                            <div className="flex justify-center items-center w-full">
                                    <button type="submit" disabled={Locked} className="w-full bg-primary  disabled:scale-0 text-white flex justify-center hover:scale-105  transition-all active:bg-black" ><UploadIcon/></button>
                            </div>
                            <div className="flex justify-center items-center w-full">
                                    <button type="reset" disabled={Locked} className="w-full border border-primary text-primary flex justify-center hover:scale-105 transition-all active:bg-primary disabled:scale-0" ><RotateCcw/></button>
                            </div>
                        </div>

                    </form>
               
            );
}