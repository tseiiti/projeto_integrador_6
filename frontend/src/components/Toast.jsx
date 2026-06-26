import { useState } from 'react';

const Toast = () => {
  return (
    <div id="toast" className="absolute top-24 px-3 pb-1 left-1/2 -translate-x-1/2 rounded-lg bg-green-100 text-green-800 shadow-lg border border-green-300 transition-all duration-300 opacity-0">
      <h1 className="text-center font-semibold"></h1>
      <hr />
      <p></p>
    </div>
  );
}

export default Toast;
