import {
  PopoverContent,
} from "@/components/ui/popover"

export default function Filter({children , title , onApply , setIsOpen, setDefaultValues}) {
        return (
        <PopoverContent className="bg-gray-100 flex flex-col justify-start p-1"
        >
            <div className="px-2  text-center">
                <h2 className="text-sm font-Montserrat font-semibold">{title}</h2>
                <hr className=" bg-gray-50" />
            </div>
            <form id="filter-form" onSubmit={(e)=>{e.preventDefault(); onApply(new FormData(e.currentTarget)); setIsOpen(false)}} onReset={()=>setDefaultValues([])}   className="flex flex-col gap-2 p-2">
                {children}
                
                <div className="flex justify-between items-center gap-4 mt-4">
                    <button type="submit"  className="bg-blue-500 text-xs text-white rounded-md hover:bg-blue-600 transition-colors shadow-md">
                                    Apply 
                    </button>
                    <button type="reset" className="bg-gray-300 text-xs text-gray-700 rounded-md hover:bg-gray-400 transition-colors shadow-md">
                                    Reset
                    </button>
                </div>  
            </form>
           
               
        </PopoverContent>

    );
}