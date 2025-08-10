import {Mail, Phone, MonitorCog , ArrowBigUpDash} from 'lucide-react'

export default function Footer(){
    const goUP = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    return (
        <div className="w-full flex flex-col">
            <div className="w-full flex bg-primary items-center py-8">
                <div className="grow flex flex-col items-center justify-center gap-2  py-4 px-2 border-r-2 border-r-gray-500">
                    <div className="flex flex-col items-start w-fit">
                        <MonitorCog  size={48} color='#0A2463'/>
                        <p className="text-lg font-meduim font-Montserrat text-[#0A2463] max-w-[80%]">
                            Plateforme de gestion du matériel informatique du  <b>Conseil Provincial d&apos;Errachidia</b>.
                        </p>
                        <p className="text-sm font-bold font-Montserrat text-black mt-2">
                            © 2025 Conseil de Province
                        </p>
                        <button
                            
                            className="border border-[#0A2463] text-[#0A2463] hover:opacity-60  px-10 text-lg mt-4 rounded-none"
                            >
                            <span className='flex gap-2 items-center ' onClick={()=>goUP()}><ArrowBigUpDash size={48} color='#0A2463'/> Back to Top</span>
                        </button>
                        
                    </div>
                </div>
                <div className="flex flex-col gap-8 h-full items-center  py-4 px-2 grow">
                    <h1 className="text-2xl text-[#0A2463] text-center font-semibold font-Montserrat">
                        Admin Contact
                    </h1>
                    <div className="flex flex-col items-start w-fit">
                        <div className="flex items-center gap-2 ">
                            <Mail size={24} />
                            <p className="text-lg font-Roboto  text-black font-medium ">admin123@gmail.com</p>
                        </div>
                        <div className="flex items-center gap-2 ">
                            <Phone size={24} />
                            <p className="text-lg font-Roboto  text-black font-medium">0577589836</p>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div className="w-full flex justify-center py-2 bg-[#0A2463]">
                <p className="text-lg font-bold text-gray-50 text-Roboto">v1.0.0</p>
            </div>
        </div>
    )
}