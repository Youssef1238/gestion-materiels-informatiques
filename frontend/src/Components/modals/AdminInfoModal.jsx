import { useState } from "react";
import { X } from "lucide-react";


export default function AdminInfoModal({ isOpen, onClose, adminData }) {
    const [color, setColor] = useState("#000000");
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg px-14 py-16 flex flex-col justify-center relative min-w-[320px]">
                <h2 className="text-2xl font-Montserrat text-primary font-semibold mb-4 text-center">
                    Informations de l'administrateur
                </h2>
                <p className="font-Montserrat text-lg mb-2">
                    <strong className="font-Roboto text-xl">Email :</strong> {adminData.email}
                </p>
                <p className="font-Montserrat text-lg mb-4">
                    <strong className="font-Roboto text-xl">Téléphone :</strong> {adminData.phone}
                </p>
                <button
                    aria-label="Fermer"
                    onClick={onClose}
                    onMouseEnter={() => setColor("#7fd0c7")}
                    onMouseLeave={() => setColor("#000000")}
                    className="absolute shadow-md right-2 top-2 rounded-full cursor-pointer p-1 bg-white hover:bg-gray-100 transition"
                    type="button"
                >
                    <X width="28px" height="28px" color={color} />
                </button>
            </div>
        </div>
    );
}