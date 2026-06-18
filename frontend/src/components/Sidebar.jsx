import { useState, useEffect } from 'react';

const items = [{
  id: 'chat',
  label: 'Chat',
  icon: 'chat',
  description: 'Perguntar ao Chatbot'
}, {
  id: 'cadastros',
  label: 'Cadastros',
  icon: 'assignment',
  description: 'Gestão de tarefas e categorias'
}, {
  id: 'relatorios',
  label: 'Relatórios',
  icon: 'table_chart',
  description: 'Exportação e filtros avançados'
}, {
  id: 'config',
  label: 'Configurações',
  icon: 'settings',
  description: 'Perfil e preferências'
}];

const Sidebar = ({active, setActive, sidebar, setSidebar, mobile, setMobile}) => {
  const [open, setOpen] = useState(true);

  const headerContent = (show) => {
    return (
      <div className="px-4 flex items-center justify-between border-b border-gray-100 min-h-[64px]">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-white dark:bg-blue-500 flex items-center justify-center shadow-sm border border-gray-300">
            <img src="favicon.png" className="h-6 w-6" alt="Logo" />
          </div>
          {show && (
            <span className="font-display font-bold text-gray-900 whitespace-nowrap">Chat IA</span>
          )}
        </div>
        
        <button onClick={() => setSidebar(!sidebar)}
          className="hidden md:flex p-1.5 rounded-lg text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          title={sidebar ? "Expandir menu" : "Recolher menu"}>
          <span className="material-symbols-rounded select-none text-[18px]">
            {sidebar ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'}
          </span>
        </button>
      </div>
    );
  }

  const itemContent = (item, show) => {
    const isActive = active === item.id;

    return (
      <button key={item.id}
        onClick={() => {
          setActive(item.id);
          setMobile(false);
        }}
        style={{ contentVisibility: 'auto' }}
        className={`w-full group flex items-center space-x-3 px-3 py-2 rounded-xl transition-all relative cursor-pointer ${
          isActive
            ? 'text-blue-700 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-zinc-800'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-white'
        }`}
        title={!show ? item.label : undefined}>

        {isActive && (
          <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-600 dark:bg-blue-400 rounded-r-md"></div>
        )}
        
        <span className={`material-symbols-rounded select-none text-[22px] flex-shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-550'}`}>
          {item.icon}
        </span>
        
        {show && (
          <div className="flex flex-col items-start text-left overflow-hidden">
            <span className="text-sm leading-tight">{item.label}</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal leading-normal whitespace-nowrap truncate w-full group-hover:text-gray-600 dark:group-hover:text-gray-300">
              {item.description}
            </span>
          </div>
        )}
      </button>
    );
  }
  
  const sidebarContent = (isMobile = false) => {
    const show = isMobile || !sidebar;

    return (
      <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 transition-colors duration-300">
        {/* Header */}
        {headerContent(show)}
    
        {/* Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map((item) => itemContent(item, show))}
        </nav>
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <aside id="sidebar-desktop"
        className={`hidden md:block h-screen h-stretch shrink-0 transition-all duration-300 z-20 ${sidebar ? 'w-[68px]' : 'w-64'}`}>
        {sidebarContent(false)}
      </aside>

      {/* Botão Mobile */}
      {mobile && (
        <div id="mobile-backdrop"
          onClick={() => setMobile(false)}
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity"
        />
      )}

      {/* Mobile */}
      <aside id="sidebar-mobile"
        className={`md:hidden fixed top-0 bottom-0 left-0 w-64 z-40 transition-transform duration-300 transform ${mobile ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent(true)}
      </aside>
    </>
  )
}

export default Sidebar;
