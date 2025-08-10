import { ArrowRightLeftIcon, Wallet, StoreIcon, BoxIcon } from "lucide-react";

export default function KpiCard({title,total , day , month , year}){
    const icons = {
        "Marché" : <StoreIcon/>,
        "Finance" : <Wallet />,
        "Activity" : <ArrowRightLeftIcon/>,
        "Article" : <BoxIcon />
    }
    return(
        <div className="rounded-md p-4 flex flex-col justify-start gap-8 bg-primary">
            <div className="flex flex-col justify-start gap-1">
                {icons[title]}
                <h1 className="text-xl text-primary">{title}</h1>
                <p className="text-lg text-gray-600">{total}</p>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex flex-col justify-start">
                    <h1 className="text-lg text-primary">Ce jour</h1>
                    <p className="text-sm text-gray-600">{day}</p>
                </div>
                <div className="flex flex-col justify-start">
                    <h1 className="text-lg text-primary">Ce Mois</h1>
                    <p className="text-sm text-gray-600">{month}</p>
                </div>
                <div className="flex flex-col justify-start">
                    <h1 className="text-lg text-primary">Cette Année</h1>
                    <p className="text-sm text-gray-600">{year}</p>
                </div>
            </div>
        </div>
    )
}