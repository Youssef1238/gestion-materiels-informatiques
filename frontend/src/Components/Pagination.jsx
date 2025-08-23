import { ChevronLeft, ChevronRight } from "lucide-react";



export default function Pagination ({page , pages , setPage}){
    if(pages <= 1) return null; 


    return (
        <div className="w-full py-5 flex justify-center items-center">
            <div className="flex w-[400px] items-center justify-center px-12 relative">
                <button onClick={()=>setPage(p=>p-1)} className="absolute left-0 shadow-none disabled:text-gray-400  hover:shadow-sm active:shadow-md rounded-full p-2 " disabled={page == 1}><ChevronLeft/></button>
                
                {pages <= 5 ? 
                <div className="flex items-center gap-2">
                    {
                        page ? Array.from({length: pages}).map((_, i) => (
                            <button key={i} onClick={()=>setPage(i+1)} className={(i+1 === page ? "bg-primary " : "") + "p-0 w-6 h-10 rounded-md border border-primary hover:bg-light"}>{i+1}</button>
                        ))
                        : null
                    }
                </div>
                :
                <div className="flex items-center gap-2">
                    <button  onClick={()=>setPage(1)} className={(1 === page ? "bg-primary " : "") + "p-0 w-6 h-10 rounded-md border border-primary hover:bg-light"}>{1}</button>
                    {
                        page -1 > 1 ? <p>..</p> : null
                    }
                    {
                        page -1 > 1 ? 
                        <button  onClick={()=>setPage(page -1)} className={(page -1 === page ? "bg-primary " : "") + "p-0 w-6 h-10 rounded-md border border-primary hover:bg-light"}>{page -1}</button>
                        : null
                    }
                    {
                        page < pages && page > 1 ? 
                        <button  onClick={()=>setPage(page)} className={(page === page ? "bg-primary " : "") + "p-0 w-6 h-10 rounded-md border border-primary hover:bg-light"}>{page}</button>
                        : null
                    }
                    {
                        pages - page > 1 ?
                        <button  onClick={()=>setPage(page +1)} className={(page +1 === page ? "bg-primary " : "") + "p-0 w-6 h-10 rounded-md border border-primary hover:bg-light"}>{page +1}</button>
                        : null
                    }
                    {
                        pages - page > 1 ? <p>..</p> : null
                    }
                    
                    <button  onClick={()=>setPage(pages)} className={(pages === page ? "bg-primary " : "") + "p-0 w-6 h-10 rounded-md border border-primary hover:bg-light"}>{pages}</button>
                </div>}
                <button onClick={()=>setPage(p=>p+1)} className="absolute right-0 shadow-none disabled:text-gray-400 hover:shadow-sm active:shadow-md rounded-full p-2" disabled={page == pages}><ChevronRight/></button>
            </div>
            
        </div>
    )

}