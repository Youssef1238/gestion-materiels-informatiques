import {Mail, Phone, MonitorCog , ArrowBigUpDash} from 'lucide-react'

export default function Footer(){
    const goUP = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    return (
        <footer className="w-full flex flex-col bg-neutral-900 text-neutral-100 font-sans">
            <div className="w-full flex flex-col md:flex-row items-stretch py-10 px-4 md:px-16 gap-8 border-b border-neutral-800">
                {/* Logo & Description */}
                <div className="flex-1 flex flex-col justify-center gap-4 md:border-r md:border-neutral-800 pr-0 md:pr-8">
                    <div className="flex items-center gap-3 mb-2">
                        <MonitorCog size={40} color="#fff" />
                        <span className="text-2xl font-bold tracking-wide">Gestion Matériel</span>
                    </div>
                    <p className="text-base text-neutral-300 max-w-lg">
                        Plateforme de gestion du matériel informatique du <b className="text-neutral-100">Conseil Provincial d&apos;Errachidia</b>.
                    </p>
                    <p className="text-xs text-neutral-500 mt-2">
                        © 2025 Conseil de Province. Tous droits réservés.
                    </p>
                    <button
                        className="mt-6 w-fit flex items-center gap-2 px-5 py-2 border border-neutral-700 rounded-md bg-neutral-800 hover:bg-neutral-700 transition"
                        onClick={goUP}
                        aria-label="Remonter en haut"
                    >
                        <ArrowBigUpDash size={24} color="#fff" />
                        <span className="text-base font-medium">Retour en haut</span>
                    </button>
                </div>
                {/* Contact */}
                <div className="flex-1 flex flex-col justify-center gap-6 mt-8 md:mt-0 md:border-r md:border-neutral-800 pr-0 md:pr-8">
                    <h2 className="text-xl font-semibold text-neutral-100 mb-2">Contact Administrateur</h2>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <Mail size={20} color="#A3A3A3" />
                            <span className="text-base text-neutral-300">admin123@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone size={20} color="#A3A3A3" />
                            <span className="text-base text-neutral-300">0577589836</span>
                        </div>
                    </div>
                </div>
                {/* Quick Links */}
                <div className="flex-1 flex flex-col justify-center gap-4 mt-8 md:mt-0">
                    <h2 className="text-xl font-semibold text-neutral-100 mb-2">Quick Links</h2>
                    <nav className="flex flex-col gap-3">
                        {[
                            { href: "/", label: "Accueil" },
                            { href: "/gerer", label: "Gérer" },
                            { href: "/manuelle", label: "Manuelle" }
                        ].map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="group relative inline-block text-base font-medium text-neutral-200 transition-colors duration-200
                                    hover:text-primary  no-underline"
                            >
                                <span className="pb-0.5 border-b-2 border-transparent  transition-all duration-200">
                                    {item.label}
                                </span>
                                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full "></span>
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    )
}