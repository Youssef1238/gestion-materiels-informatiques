import CompteForm from "./forms/Compte";
import EntitéAdminForm from "./forms/EntitéAdmin";
import FournisseurForm from "./forms/Fournisseur";
import MarchéForm from "./forms/Marché";
import TypeForm from "./forms/Type";

export default function Forms({type , entity, onClose}) {
    if (!type || !entity) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

   return (
    <div onClick={handleBackdropClick} className="fixed inset-0 z-30 w-full min-h-screen flex py-12 justify-center bg-black bg-opacity-50">
        {
            (() => {
                switch(entity) {
                    case 'Compte':
                        return <CompteForm type={type} onClose={onClose}/>;
                    case 'Entité Admin.':
                        return <EntitéAdminForm type={type} onClose={onClose}/>;
                    case 'Fournisseur':
                        return <FournisseurForm type={type} onClose={onClose}/>;
                    case 'Marché':
                        return <MarchéForm type={type} onClose={onClose}/>;
                    case 'Type de matériel':
                        return <TypeForm type={type} onClose={onClose}/>;
                    default:
                        return <CompteForm type={type} onClose={onClose}/>;
                }
            })()
        }
    </div> 
   )
            
}

