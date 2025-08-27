import { useNavigate } from "react-router-dom"
import { ServerOff } from "lucide-react";



export default function ServerError() {
    const Navigate = useNavigate()
    document.title = "Server Error"
    return(
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 gap-8">
            <ServerOff size={128} color='#7fd0c7'/>
            <h1 className="text-9xl font-extrabold text-scondary mb-4 font-Montserrat">500</h1>
            <p className="text-scondary text-center max-w-md mb-6 font-Montserrat text-xl">
            Quelque chose s’est mal passé
            Veuillez réessayer plus tard ou retourner à l’accueil.
            </p>
            <div className='flex gap-4 items-center '>
                <button
                onClick={() => Navigate('/')}
                className="bg-dark hover:bg-secondary text-white focus:ring-2 focus:ring-secondary focus:ring-offset-2 px-8 py-4 text-2xl"
                >
                Acceuil
                </button>
                <button
                onClick={() => Navigate('/Gerer')}
                className="hover:bg-primary hover:text-white text-2xl text-secondary px-8 py-4 border border-dark focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                >
                Gérer
                </button>
            </div>
        </div>
    
    )
    
    
    
}