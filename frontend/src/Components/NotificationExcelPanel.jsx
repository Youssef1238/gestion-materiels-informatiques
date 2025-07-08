import { useEffect } from 'react';
import { CloseIcon } from '../assets/Icons';
const NotificationExcelPanel = ({ addedRows, declinedRows, duration = 10000 , visiblity, setVisible}) => {


  useEffect(() => {
    setVisible(visiblity)
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer); // Cleanup on unmount or if duration changes
  }, [visiblity]);


  return (
    <div className={"left-0 w-full bg-blue-500 text-white shadow-lg transition-transform transform"}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold text-lg">Resultat</span>
            <div className="mt-1">
              <span className="bg-blue-600 px-3 py-1 rounded-md font-medium mr-2">
                Ajoutée: {addedRows}
              </span>
              <span className="bg-red-600 px-3 py-1 rounded-md font-medium">
                Refusée: {declinedRows}
              </span>
            </div>
          </div>
          <button
            onClick={() => setVisible(false)}
            className='border-0'
          >
            <CloseIcon/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationExcelPanel;

