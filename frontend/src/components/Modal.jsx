const Modal = ({ isOpen, onClose1, onClose2, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose1}
        className="fixed inset-0 bg-black/10 backdrop-blur transition-opacity -z-10" />
      
      {/* Modal Content Box */}
      <div className="flex flex-col w-full lg:max-w-7xl max-h-[90vh] transform rounded-lg bg-white p-5 pt-3 text-left shadow-xl transition-all">
        
        {/* Header */}
        <div className="relative flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {title}
          </h3>
          <button onClick={onClose1} className="text-gray-400 hover:text-gray-500 text-[26px] font-bold absolute top-[-11px] right-[-5px]">
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 mt-2 text-sm text-gray-500">
          {children}
        </div>

        {/* Footer */}
        {onClose2 && <div className="mt-4 flex justify-end space-x-3">
          {onClose2 && <button type="button"
            className="rounded-md border border-gray-300 bg-white px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={onClose2}>
            Fechar
          </button>}
          {/* {onAction && onClose2 && <button type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            onClick={() => {
              onAction();
              onClose2();
            }}>
            Save
          </button>} */}
        </div>}
      </div>
    </div>
  );
}

export default Modal;