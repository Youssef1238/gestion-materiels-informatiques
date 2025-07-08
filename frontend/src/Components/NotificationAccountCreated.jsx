import { useEffect, useState } from 'react';
// eslint-disable-next-line react/prop-types
const NotificationAccountCreated = ({ password, success, duration = 5000 , visiblity, setVisible}) => {

  const [isFading, setIsFading] = useState(false);
  useEffect(() => {
    setVisible(visiblity)
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setIsFading(false);
        setVisible(false);
      }, 1000);
      
    }, duration);

    return () => clearTimeout(timer); 
  }, [visiblity]);


  const handleClose = () => {
    navigator.clipboard.writeText(password)
    setIsFading(true);
    setTimeout(() => {
      setIsFading(false);
      setVisible(false);
    }, 1000);
  };
return (
    <div className={ (isFading ? " opacity-0 " : "" ) + "w-full flex flex-col mb-4 p-5 rounded-lg" + (success ? " bg-green-600" : " bg-red-600") + "  shadow-lg transition-opacity duration-1000 ease-in-out"  }>
      <div className="flex gap-2 mb-4 py-2 justify-start items-center">
        {success ? (
          <svg className="w-6 h-6" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" />
            <path stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
          </svg>
        )}
        <h2 className="text-white text-2xl font-bold">{success? "Compte crée":"Création échoué"}</h2>
      </div>
      <div className="flex justify-start items-center gap-2 mb-2 py-2 px-4 bg-gray-100 rounded-lg shadow-md w-fit">
        <span className="text-black text-lg">{password}</span>
        <button
          type="button"
          onClick={handleClose}
          className="ml-2 p-1 rounded hover:bg-gray-100 transition-colors"
          title="Copier le mot de passe"
        >
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </button>
      </div>
    </div>
);
};

export default NotificationAccountCreated;

