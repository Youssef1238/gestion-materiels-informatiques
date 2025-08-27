
import { ArrowRightLeftIcon, Wallet, StoreIcon, BoxIcon } from "lucide-react";

export default function KpiCard({title,total , day , month , year}){
    const icons = {
        "Marché": <StoreIcon className="w-8 h-8 text-indigo-700 bg-white rounded-full p-1 shadow" />,
        "Finance": <Wallet className="w-8 h-8 text-blue-700 bg-white rounded-full p-1 shadow" />,
        "Activité": <ArrowRightLeftIcon className="w-8 h-8 text-amber-600 bg-white rounded-full p-1 shadow" />,
        "Article": <BoxIcon className="w-8 h-8 text-cyan-700 bg-white rounded-full p-1 shadow" />
    };
    const classes = {
        "Marché": "bg-gradient-to-br from-indigo-100 to-indigo-300",
        "Finance": "bg-gradient-to-br from-blue-100 to-blue-300",
        "Activité": "bg-gradient-to-br from-amber-100 to-amber-300",
        "Article": "bg-gradient-to-br from-cyan-100 to-cyan-300"
    };
    return (
        <div className={`rounded-xl p-6 flex flex-col gap-8 shadow-md ${classes[title]}`}>
            <div className="flex flex-col gap-2">
                {icons[title]}
                <h1 className="text-lg font-semibold text-gray-800 font-Montserrat">{title}</h1>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-lg font-light text-gray-700 font-Montserrat">Ce jour</span>
                    <span className="text-xl font-semibold text-gray-800">{day}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-light text-gray-700 font-Montserrat">Ce Mois</span>
                    <span className="text-xl font-semibold text-gray-800">{month}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-light text-gray-700 font-Montserrat">Cette Année</span>
                    <span className="text-xl font-semibold text-gray-800">{year}</span>
                </div>
            </div>
        </div>
    )
}