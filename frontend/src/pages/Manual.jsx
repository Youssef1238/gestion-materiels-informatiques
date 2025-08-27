import Instructions from "@/Components/Instructions";
import Layout from "@/Components/layout/layout";
import { Download } from "lucide-react";


export default function Manual() {
    document.title = "Guide d'utilisation"
    const templates = [
        { name: "Template de Marché", downloadLink: "../../public/templates/ArticleLivreTemplate.xlsx" },
        { name: "Template de Fournisseur", downloadLink: "../../public/templates/FournisseurTemplate.xlsx" },
        { name: "Template de Entité Administrative", downloadLink: "../../public/templates/EntiteTemplate.xlsx" },
        { name: "Template de Article Marché", downloadLink: "../../public/templates/ArticleMarcheTemplate.xlsx" },
        { name: "Template de Article Livré", downloadLink: "../../public/templates/ArticleLivreTemplate.xlsx" },
        { name: "Template de Type", downloadLink: "../../public/templates/TypeTemplate.xlsx" },
    ];


    return (
        <Layout>
            <div className="w-full min-h-screen flex flex-col items-center gap-16">
                <div className="w-full py-12 flex justify-center items-center">
                    <div className="flex flex-col items-center gap-4">
                        <h1 className="text-4xl font-Montserrat font-semibold text-gray-800">Guide d'utilisation</h1>
                        <span className="text-xl font-Montserrat font-light text-gray-500">
                            Découvrez comment utiliser l’application étape par étape.
                        </span>
                    </div>
                </div>
                <div className="w-full max-w-2xl flex flex-col items-center py-12 gap-8">
                    <Instructions Title="Gérer et éditer une entité administrative">
                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                            <li>Accédez à la page <a href="/Gerer" className="text-blue-600 underline">Gérer</a>.</li>
                            <li>Sélectionnez l’entité souhaitée dans la liste.</li>
                            <li>Utilisez la barre de recherche ou les filtres pour trouver rapidement une entité.</li>
                            <li>Pour ajouter ou modifier une entité, cliquez sur les boutons correspondants.</li>
                            <li>Remplissez le formulaire avec les informations requises puis cliquez sur <b>Enregistrer</b>.</li>
                        </ol>
                    </Instructions>
                    <Instructions Title="Gestion des articles">
                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                            <li>Accédez à la page du Marché via la page <b>Gérer</b> ou la barre de recherche de la navigation.</li>
                            <li>Modifiez les informations du Marché si nécessaire.</li>
                            <li>Consultez la liste des <b>Articles Marchés</b> associés et utilisez les options pour modifier ou supprimer un article.</li>
                            <li>Passez la souris sur un article pour afficher le bouton <b>Consulter</b> et accéder aux détails de l’article.</li>
                            <li>Dans l’onglet de détails, visualisez et gérez les <b>Articles Livrés</b> liés à l’Article Marché sélectionné.</li>
                            <li>Ajoutez, modifiez ou supprimez des Articles Livrés de la même manière.</li>
                        </ol>
                    </Instructions>
                    <Instructions Title="Affectation et récupération des articles">
                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                            <li>Accédez à la page de l’entité administrative via <b>Gérer</b> ou la barre de recherche.</li>
                            <li>Trois onglets sont disponibles : <b>Affecter</b>, <b>Récupérer</b> et <b>Historique</b>.</li>
                            <li>Dans l’onglet <b>Affecter</b>, recherchez les articles par numéro de série.</li>
                            <li>Ajoutez les articles disponibles à la sélection, puis cliquez sur <b>Terminer</b> une fois votre choix fait.</li>
                            <li>Vérifiez votre sélection dans la fenêtre de confirmation, choisissez la date et confirmez l’opération.</li>
                            <li>Un rapport d’affectation sera généré et téléchargé automatiquement.</li>
                            <li>Pour la récupération, sélectionnez les articles déjà affectés à l’entité, puis suivez le même processus.</li>
                            <li>Dans l’onglet <b>Historique</b>, consultez toutes les opérations d’affectation et de récupération, avec la possibilité de télécharger les rapports associés.</li>
                        </ol>
                    </Instructions>
                    <Instructions Title="Importation de données via fichiers Excel">
                        <div className="space-y-2 text-gray-700">
                            <p>
                                Pour faciliter l’ajout de données, plusieurs entités permettent l’importation via un fichier Excel. Veuillez respecter le format des modèles fournis pour garantir une importation réussie.
                            </p>
                            <ul className="list-disc list-inside">
                                <li>Cliquez sur le bouton d’importation et sélectionnez votre fichier Excel.</li>
                                <li>Le fichier sera analysé et les données ajoutées automatiquement.</li>
                                <li>Si les en-têtes du fichier ne correspondent pas au modèle, l’importation sera refusée.</li>
                            </ul>
                            <div className="mt-4">
                                <span className="font-semibold">Téléchargez les modèles pour chaque entité :</span>
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {templates.map((template, index) => (
                                        <a
                                            key={index}
                                            href={template.downloadLink}
                                            download
                                            className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-500 transition-colors"
                                            title={`Télécharger ${template.name}`}
                                        >
                                            <Download size={18} />
                                            <span className="text-sm">{template.name}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Instructions>
                </div>
            </div>
        </Layout>
    )
}