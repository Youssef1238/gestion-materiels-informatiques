import { Edit3, Lock, Plus, RotateCcw, Unlock, UploadIcon, X } from "lucide-react";

export default function FormLayout({Title,onClose,onSubmit,onReset,Type,children,Locked,setLocked}) {



    return (
        <form onSubmit={onSubmit} onReset={onReset} className="bg-white w-1/2  h-fit rounded-md shadow-md flex flex-col items-center gap-2">
            <div className="w-full py-4 px-2 flex justify-between items-center bg-gray-800 rounded-t-md">
                <div className="flex items-center gap-2 ">
                    {Type == "add"?<Plus color="#fff" size={32}/>:<Edit3 color="#fff" size={32}/>}
                    <h2 className="text-2xl font-bold font-Montserrat text-white">{Title}</h2>
                </div>
                <div className="flex items-center gap-2 ">
                    {Type != "add"?
                    <button type="button" className="text-white hover:scale-105" onClick={()=>setLocked(l=>!l)}>
                        {Locked? <Lock/> : <Unlock/>}
                    </button>
                    :null}
                    <button
                    type="button"
                    onClick={onClose}
                    className="text-white hover:scale-110 transition-transform"
                    aria-label="Fermer"
                    >
                        <X />
                    </button>
                </div>
                
                

            </div>
            {children}
            {
                Type == "add"?
                <div className="w-full py-8 gap-8 flex justify-start items-center px-8 mt-8">
                    <div className="flex justify-center items-center w-full">
                            <button type="submit" className="w-full bg-primary text-white flex justify-center gap-4 hover:scale-105 transition-all active:bg-black" >
                                <UploadIcon/> Ajouter
                            </button>
                    </div>
                    <div className="flex justify-center items-center w-full">
                            <button type="reset" className="w-full border border-primary text-primary flex justify-center gap-4 hover:scale-105 transition-all active:bg-primary" >
                                <RotateCcw/> Réinitialiser
                            </button>
                    </div>
                </div>
                :
                <div className="w-full py-8 gap-8 flex justify-start items-center px-8 mt-8">
                    <div className="flex justify-center items-center w-full">
                            <button type="submit" disabled={Locked} className="w-full bg-primary  disabled:scale-0 text-white flex justify-center gap-4 hover:scale-105  transition-all active:bg-black" >
                                <UploadIcon/> Modifier
                            </button>
                    </div>
                    <div className="flex justify-center items-center w-full">
                            <button type="reset" disabled={Locked} className="w-full border border-primary text-primary flex justify-center gap-4 hover:scale-105 transition-all active:bg-primary disabled:scale-0" >
                                <RotateCcw/> Réinitialiser
                            </button>
                    </div>
                </div>
            }
        </form>
    )
}