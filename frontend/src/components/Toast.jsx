import { useState } from 'react';

const Toast = () => {
  return (
    <div id="toast" className="absolute top-24 px-5 pt-2 pb-3 left-1/2 -translate-x-1/2 rounded-lg bg-green-100 text-green-800 shadow-lg border border-green-300 transition-all duration-300 opacity-0">
      <h1 className="text-center font-semibold">Título:</h1>
      <hr className="my-2 border-green-800/50" />
      <p className="text-sm">Mensagem...</p>
    </div>
  );
}

export default Toast;
