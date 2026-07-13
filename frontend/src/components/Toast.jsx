import { useState } from 'react';

const Toast = () => {
  return (
    <div id="toast" className="absolute top-24 px-5 pt-2 pb-3 left-1/2 -translate-x-1/2 rounded-lg bg-green-100 text-green-800 shadow-lg border border-green-300 transition-all duration-500 -translate-y-20 opacity-0">
      <h1 className="text-center font-semibold">Título:</h1>
      <hr className="my-2 border-green-800/50" />
      <p className="text-sm">Mensagem...</p>
    </div>
  );
}

const BottomToast = () => {
  return (
      <div className="fixed bottom-8 right-8 transform translate-y-20 opacity-0 transition-all duration-300 bg-gray-100 text-gray-600 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4" id="bottom-toast">
        <span className="material-symbols-outlined text-green-400">check_circle</span>
        <div>
          <p className="text-md font-bold bottom-toast-title">Sucesso!</p>
          <p className="text-sm opacity-80 bottom-toast-text">Suas configurações foram atualizadas.</p>
        </div>
      </div>
  );
}

export { Toast, BottomToast };
