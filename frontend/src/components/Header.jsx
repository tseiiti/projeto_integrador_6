import { useState, useEffect } from 'react';

const Header = () => {
  <>
    {/* Top Header navbar with Hamburger toggles for responsive design support */}
    <header className="h-16 shrink-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 flex items-center justify-between transition-colors duration-300">
      
      <div className="flex items-center space-x-3">
        {/* Hamburger helper toggle on mobile devices */}
        <button
            id="mobile-menu-trigger"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 rounded-lg text-gray-505 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-850 transition cursor-pointer flex items-center justify-center p-0.5"
            title="Menu lateral"
        >
          <span className="material-symbols-rounded select-none text-[20px]">menu</span>
        </button>

        {/* Breadcrumb metadata headers */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-550 font-sans hidden sm:inline">
            Gestor de Tarefas
          </span>
          <span className="text-gray-300 dark:text-zinc-800 hidden sm:inline">/</span>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-sans">
            {viewTitleMap[activeView]}
          </span>
        </div>
      </div>

      {/* Quick Header Right actions buttons bar */}
      <div className="flex items-center space-x-3">
        
        {/* Theme Toggle Button instantly accessible from anywhere inside the app frame */}
        <button
          id="header-theme-toggle-btn"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{ contentVisibility: 'auto' }}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-850/60 transition cursor-pointer hidden sm:flex"
          title="Alternar aparência"
        >
          {theme === 'light' ? (
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          ) : (
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg>
          )}
        </button>

        {/* Quick profile tag */}
        <div
          id="header-profile-badge"
          onClick={() => setActiveView('config')}
          className="flex items-center space-x-2 py-1.5 px-3 rounded-full border border-gray-150 dark:border-zinc-800 bg-gray-50/40 dark:bg-zinc-850/30 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:border-blue-400 transition cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-blue-105 dark:bg-zinc-700 text-[10px] font-bold text-blue-700 dark:text-blue-400 flex items-center justify-center">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-slate-250 truncate hidden md:inline max-w-[150px]">
            {currentUser.name}
          </span>
        </div>

      </div>

    </header>
  </>
}

export default Header;
