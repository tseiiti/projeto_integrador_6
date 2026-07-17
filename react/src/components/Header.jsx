import { useState, useEffect } from 'react';
import { MENU_ITEMS } from '../services/data';

const Header = ({active, theme, setTheme, mobile, setMobile}) => {
  return (
    <header className="h-12 shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 flex items-center justify-between">
    
      {/* Breadcrumb */}
      <div className="flex items-center space-x-3">
        <button onClick={() => setMobile(!mobile)}
          className="md:hidden mr-[24px] rounded-lg hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer focus:outline-none flex items-center justify-center p-0.5"
          title="Menu lateral">
          <span className="material-symbols-rounded select-none text-[20px]">menu</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold italic uppercase tracking-wider hidden sm:inline">
            Chat IA
          </span>
          <span className="text-xs font-bold hidden sm:inline">/</span>
          <span className="text-xs font-semibold text-indigo-500 dark:text-indigo-400">
            {MENU_ITEMS.find(e => e.id == active).label}
          </span>
        </div>
      </div>

      {/* Botões da direita */}
      <div className="flex items-center space-x-3">
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{ contentVisibility: 'auto' }}
          className="p-2 rounded-xl hover:text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-slate-100 dark:hover:bg-slate-600 cursor-pointer focus:outline-none hidden sm:flex"
          title="Alternar o tema">
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={theme === 'light' ? 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' : 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z'}></path></svg>
        </button>
      </div>
    </header>
  );
}

export default Header;
