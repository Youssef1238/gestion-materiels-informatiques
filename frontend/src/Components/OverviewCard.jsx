import { Search, Columns3Cog, ArrowUp, ArrowRight, ChevronsUp, ChevronsDown } from "lucide-react";




export default function OverviewCard({title}) 
{

    const data = {
        "Chercher" : {
            "p" : "Vous pouvez cherchez un marché ou une entité administrative depuis la barre de navigation",
            "icon" : <Search/>,
            "cta" : "Cherchez",
            "ctaIcon" : <Search/>
        },
        "Gérer" : {
            "p" : "Vous pouvez trouver et Gérer les différents entités (Marché,Fournisseur,..) avec des options de filtrage trés simple.",
            "icon" : <Columns3Cog />,
            "cta" : "Gérer",
            "ctaIcon" : <ArrowRight/>
        },
        "Affecter" : {
            "p" : "Depuis une page de details d'une entité administrative , vous pouvez chercher et affecter des articles avec leurs serial number , et à al fin vous pouvez finalisez et obtenir le rapport.",
            "icon" : <ChevronsUp />,
            "cta" : "Affecter",
            "ctaIcon" : <ArrowUp/>
        },
        "Récuperer" : {
            "p" : "Depuis une page de details d'une entité administrative , vous pouvez choisir depuis la liste des articles ceux que vous voulez récuperez et un rapport sera génere automatiquement à la fin.",
            "icon" : <ChevronsDown />,
            "cta" : "Récuperer",
            "ctaIcon" : <ArrowUp/>
        },
    }
    return (
        <div className="p-4 rounded-sm bg-[#0A2463] flex flex-col gap-4">
            <div className="flex flex-col gap-1 text-white">
                {data[title].icon}
                <h1 className="text-2xl font-bold text-white font-Montserrat">{title}</h1>
            </div>
            <p className="text-lg font-light text-gray-200 text-justify max-w-[80%] font-Montserrat">
                {data[title].p}
            </p>
            <button className="text-white border-2 border-white flex items-center justify-center gap-2">{data[title].cta} {data[title].ctaIcon}</button>
        </div>

    )
}