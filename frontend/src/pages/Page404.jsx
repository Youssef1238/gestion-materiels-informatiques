import {FileX2} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Page404() {
    const Navigate = useNavigate()
    document.title = "404"
return(
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 gap-8">
        <FileX2 size={128} color='#7fd0c7' />
        <h1 className="text-9xl font-extrabold text-scondary mb-4 font-Montserrat">404</h1>
        <p className="text-scondary text-center max-w-md mb-6 font-Montserrat text-xl">
            La page demandée n’existe pas ou a été déplacée.
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