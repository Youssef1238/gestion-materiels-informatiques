import { Minus, Plus } from "lucide-react";
import { useState } from "react";


export default function Instructions({Title,children}) {
    
    const [iscollapsed,setIscollapsed] = useState(true)


    return (
        <div className="w-full px-2 flex flex-col shadow-sm">
            <div
                onClick={() => setIscollapsed(c => !c)}
                className="w-full flex items-center gap-4 cursor-pointer py-4 select-none"
            >
                {iscollapsed ? (
                    <Plus color="#7fd0c7" />
                ) : (
                    <Minus color="#7fd0c7" />
                )}
                <span className="text-lg font-Montserrat font-semibold text-gray-600">
                    {Title}
                </span>
            </div>
            <div
                className={`overflow-hidden transition-all duration-700 ease-in-out ${
                    iscollapsed ? "max-h-0 opacity-0" : "max-h-96 opacity-100"
                }`}
            >
                
                    {children}
               
            </div>
        </div>
    );
}