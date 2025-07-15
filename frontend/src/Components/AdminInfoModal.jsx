import { useState } from "react";
import { CloseIcon } from "../assets/Icons";


export default function AdminInfoModal({ isOpen, onClose, adminData }) {
    if (!isOpen) return null;
    const [color, setColor] = useState("#000000");
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg  shadow-lg px-24 py-12 flex flex-col justify-center relative">
                <h2 className="text-2xl font-Montserrat text-primary font-semibold mb-4 text-center">Admin Information</h2>
                <p className="font-Montserrat text-lg "><strong className="font-Roboto text-xl ">Email:</strong> {adminData.email}</p>
                <p className="font-Montserrat text-lg "><strong className="font-Roboto text-xl ">Phone:</strong> {adminData.phone}</p>
                <div onClick={onClose} onMouseEnter={()=>setColor("#7fd0c7")} onMouseLeave={()=>setColor("#000000")} className="absolute shadow-md right-1 top-1 rounded-full cursor-pointer">
                    <CloseIcon width="30px" height={"30px"} color={color} />
                </div>
            </div>
        </div>
    );
}