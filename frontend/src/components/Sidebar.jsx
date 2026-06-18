import { useState, useEffect } from 'react';

const menuItems = [{
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

  const itemContent = (
    <ul className="space-y-2 font-medium">
      {menuItems.map((item) => {
        return (
          <li key={item.id}>
            <button className="flex items-center px-2 py-1 text-main/60 rounded-rounded hover:text-main" title={item.description} onClick={() => {setActive(item.id)}}>
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="ms-3">{item.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
  
  const sidebarContent = (isMobile = false) => {
    return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 transition-colors duration-300">

      {/* Header */}
      <div className="px-4 flex items-center justify-between border-b border-gray-100 min-h-[64px]">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-white dark:bg-blue-500 flex items-center justify-center shadow-sm border border-gray-300">
            <img src="favicon.png" className="h-6 w-6" alt="Logo" />
          </div>
          {!sidebar && (
            <span className="font-display font-bold text-gray-900 whitespace-nowrap">
              Chat IA
            </span>
          )}
        </div>

        {/* Collapse Button for desktop view */}
        <button
          onClick={() => setSidebar(!sidebar)}
          className="hidden md:flex p-1.5 rounded-lg text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          title={sidebar ? "Expandir menu" : "Recolher menu"}
        >
          {sidebar ? (
            <span className="material-symbols-rounded select-none text-[18px]">keyboard_double_arrow_right</span>
          ) : (
            <span className="material-symbols-rounded select-none text-[18px]">keyboard_double_arrow_left</span>
          )}
        </button>
      </div>

    </div>);
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
