import { useState, useEffect } from 'react';
import { MENU_ITEMS } from '../services/data';

const Header = ({active, theme, setTheme, mobile, setMobile}) => {
  return (<>
    <header className="h-12 shrink-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700/60 px-4 flex items-center justify-between transition-colors duration-300">
    
      {/* Breadcrumb */}
      <div className="flex items-center space-x-3">
        <button onClick={() => setMobile(!mobile)}
          className="md:hidden mr-[24px] rounded-lg text-gray-505 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-850 transition cursor-pointer flex items-center justify-center p-0.5"
          title="Menu lateral" >
          <span className="material-symbols-rounded select-none text-[20px]">menu</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-550 font-sans hidden sm:inline">
            Chat IA
          </span>
          <span className="text-gray-300 dark:text-zinc-400 hidden sm:inline">/</span>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-sans">
            {MENU_ITEMS.find(e => e.id == active).label}
          </span>
        </div>
      </div>

      {/* Botões da direita */}
      <div className="flex items-center space-x-3">
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{ contentVisibility: 'auto' }}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-zinc-600 transition cursor-pointer hidden sm:flex"
          title="Alternar o tema">
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={theme === 'light' ? 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' : 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z'}></path></svg>
        </button>
      </div>
    </header>
  </>);
}

export default Header;
