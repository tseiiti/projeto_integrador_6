/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useRef, useEffect } from 'react';
// import { Settings, ArrowLeft } from 'lucide-react';

export default function Header({
  view,
  setView,
  categories = ['Todos'],
  selectedCategoryIndex = 0,
  setSelectedCategoryIndex,
  currentModel = '',
  onBack,
}) {
  const selectRef = useRef(null);

  // Resize select based on its content length
  useEffect(() => {
    if (selectRef.current) {
      const select = selectRef.current;
      const text = select.options[select.selectedIndex]?.text || '';
      
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.whiteSpace = 'nowrap';
      tempDiv.style.fontSize = window.getComputedStyle(select).fontSize;
      tempDiv.style.fontFamily = window.getComputedStyle(select).fontFamily;
      tempDiv.innerText = text;

      document.body.appendChild(tempDiv);
      // Extra safety margin of 32px
      select.style.width = `${tempDiv.offsetWidth + 32}px`;
      document.body.removeChild(tempDiv);
    }
  }, [selectedCategoryIndex, categories]);

  const viewLabel = useMemo(() => {
    switch (view) {
      case 'config':
        return 'Configurações';
      case 'detail':
        return 'Detalhes';
      case 'manage':
        return 'Gerenciar';
      default:
        return currentModel ? currentModel : 'Carregando...';
    }
  }, [view, currentModel]);

  return (
    <header className="fixed top-0 right-0 left-0 h-16 z-40 bg-white/80 dark:bg-white/80 backdrop-blur-md border-b border-outline-variant flex items-center">
      <div className="flex justify-between items-center px-4 sm:px-8 lg:px-16 w-full max-w-[1376px] mx-auto relative">
        <div className="flex items-center gap-8 flex-1 min-w-0">
          <button
            onClick={() => setView('chat')}
            className="text-lg font-black tracking-tighter text-primary shrink-0 transition-transform active:scale-95 cursor-pointer text-left"
          >
            Chat IA
          </button>
          
          <nav className="flex items-center gap-2 overflow-x-auto hide-scrollbar mask-gradient pt-1 h-12 custom-scrollbar">
            <span className="flex items-center gap-6 whitespace-nowrap font-['Inter'] text-sm font-semibold px-2 uppercase tracking-wide">
              <span className="text-on-surface-variant text-xs sm:text-sm truncate">
                {viewLabel}
              </span>
            </span>
          </nav>
        </div>

        {/* Floating actions depend on the view */}
        <div className="flex items-center gap-3">
          {view === 'chat' ? (
            <button
              onClick={() => setView('config')}
              title="Configurações e Histórico"
              className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-outline shadow-sm border border-slate-100 hover:border-primary/30 hover:text-primary transition-all cursor-pointer active:scale-95"
            >
              {/* <Settings className="w-5 h-5" /> */}
              <span>r</span>
            </button>
          ) : (
            <button
              onClick={onBack || (() => setView('chat'))}
              className="bg-transparent hover:bg-blue-500 text-sm text-blue-700 font-semibold hover:text-white py-1.5 px-4 border border-blue-500 hover:border-transparent rounded-lg transition-all cursor-pointer flex items-center gap-1 active:scale-95"
            >
              {/* <ArrowLeft className="w-4 h-4" /> */}
              <span>q</span>
               Voltar
            </button>
          )}
        </div>

        {/* Absolute floating Category Selector below title (on the Main Chat View only) */}
        {view === 'chat' && setSelectedCategoryIndex && (
          <div className="absolute top-14 left-4 sm:left-8 lg:left-16 z-30 animate-fade-in">
            <div className="flex items-center justify-start mt-2 mb-1" title="Permite filtrar por uma categoria para geração do contexto">
              <span className="text-[11px] font-medium text-gray-400 pr-1">Categoria:</span>
              <select
                ref={selectRef}
                value={selectedCategoryIndex}
                onChange={(e) => setSelectedCategoryIndex(Number(e.target.value))}
                className="bg-transparent border-none focus:outline-none focus:ring-0 transition duration-300 ease placeholder:text-slate-400 cursor-pointer text-slate-700 text-xs font-semibold p-0 pr-6 outline-none"
                name="select_categories"
              >
                {categories.map((cat, idx) => (
                  <option key={idx} className="bg-white text-slate-800" value={idx}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
