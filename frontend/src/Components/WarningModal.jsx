

export  const WarningModal = ({ onConfirm, onCancel ,message}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.29 3.86L1.82 16.94A2 2 0 003.46 20h17.08a2 2 0 001.64-3.06L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01"
            />
          </svg>
          <h2 className="text-lg font-semibold text-red-800">
            Warning: Confirm Your Action
          </h2>
        </div>
        <p className="mt-4 text-sm text-gray-700">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={onCancel}
          >
            Annuler
          </button>
          <button
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};