import { useLocation } from "react-router-dom"



export default function Page404() {
    document.title = "Server Error"
    const location = useLocation()
    const Status = location.state.code | 500
    const Message = location.state.message | "Error"
    return(
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
            <h1 className="text-9xl font-extrabold text-blue-600 mb-4">{Status | 500}</h1>
            <p className="text-2xl text-blue-700 font-semibold mb-4">
                Server Error
            </p>
            <p className="text-gray-600 text-center max-w-md mb-6">
                {Message == 0?"Uknown Error" : Message}
            </p>
            <a
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Go Back to Home
            </a>
        </div>
    
    )
    
    
    
    }