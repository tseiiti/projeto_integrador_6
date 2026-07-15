import { useState, useEffect } from 'react';
import { MENU_ITEMS } from '../services/data';

const Sidebar = ({active, setActive, desktop, setDesktop, mobile, setMobile}) => {
  const [open, setOpen] = useState(true);

  // cabeçalho do menu
  const header = (show) => {
    return (
      <div className="px-1.5 flex items-center space-x-1.5 border-b border-slate-200 dark:border-slate-700 min-h-[48px]">
        <button onClick={() => setDesktop(!desktop)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 cursor-pointer"
          title={desktop ? "Expandir menu" : "Recolher menu"}>
          <span className="material-symbols-rounded select-none text-[18px]">
            {desktop ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'}
          </span>
        </button>
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-300 dark:border-slate-600">
            <img src="favicon.png" className="h-6 w-6" alt="Logo" />
          </div>
          {show && (
            <span className="font-display font-bold text-slate-800 dark:text-slate-200 text-base tracking-tight whitespace-nowrap">Chat IA</span>
          )}
        </div>
      </div>
    );
  }

  // cada item do menu
  const content = (item, show) => {
    const isActive = active === item.id;

    return (
      <button key={item.id}
        onClick={() => {
          setActive(item.id);
          setMobile(false);
        }}
        style={{ contentVisibility: 'auto' }}
        className={`w-full group flex items-center space-x-2 px-2 py-1 rounded-xl relative cursor-pointer ${isActive
            ? 'text-indigo-500 dark:text-indigo-400 font-semibold bg-indigo-100 dark:bg-slate-800'
            : 'hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-300'}`}
        title={!show ? item.label : undefined}>

        <span className={`material-symbols-rounded select-none text-[22px] flex-shrink-0 ${isActive ? '' : 'transition-transform group-hover:scale-105 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
          {item.icon}
        </span>
        
        {show && (
          <div className="flex flex-col items-start text-left overflow-hidden">
            <span className="text-sm leading-tight">{item.label}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-600 whitespace-nowrap truncate w-full group-hover:text-slate-600 dark:group-hover:text-slate-300">
              {item.description}
            </span>
          </div>
        )}

        {isActive && (
          <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-500 dark:bg-indigo-400 rounded-r-md" />
        )}
      </button>
    );
  }
  
  // auxiliar itens do menu
  const sidebar = (isMobile = false) => {
    const show = isMobile || !desktop;

    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
        {/* Header */}
        {header(show)}
    
        {/* Items */}
        <nav className="flex-1 mt-1 p-1 space-y-1 overflow-y-auto">
          {MENU_ITEMS.map((item) => content(item, show))}
        </nav>
      </div>
    );
  }

  return (<>
    {/* Desktop */}
    <aside id="sidebar-desktop"
      className={`hidden md:block h-screen h-stretch shrink-0 z-20 transition-all duration-500 ${desktop ? 'w-[52px]' : 'w-64'}`}>
      {sidebar(false)}
    </aside>

    {mobile && (
      <div id="mobile-backdrop"
        onClick={() => setMobile(false)}
        className="md:hidden fixed inset-0 backdrop-blur-sm z-30 transition-opacity duration-700"
      />
    )}

    {/* Mobile */}
    <aside id="sidebar-mobile"
      className={`md:hidden fixed top-0 bottom-0 left-0 w-64 z-40 transition-transform duration-700 ${mobile ? 'translate-x-0' : '-translate-x-full'}`}>
      {sidebar(true)}
    </aside>
  </>);
}

export default Sidebar;
