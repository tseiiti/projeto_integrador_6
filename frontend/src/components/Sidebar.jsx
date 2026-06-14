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

const sidebarContent = (
  <ul className="space-y-2 font-medium">
    {menuItems.map((item) => {
      return (
        <li key={item.id}>
          <a href="#" className="flex items-center px-2 py-1 text-main/60 rounded-rounded hover:text-main" title={item.description}>
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="ms-3">{item.label}</span>
          </a>
        </li>
      );
    })}
  </ul>
);
  
const Sidebar = () => {
  const [open, setOpen] = useState(true);

  const toggleOpen = () => {
    setOpen(!open);
  }
  
  useEffect(() => {
    toggleOpen();
  }, []);

  return (
    <>
      <aside id="drawer-navigation" className={`fixed top-0 left-0 z-40 w-64 h-screen p-4 transition-transform -translate-${open ? 'x-full' : 'one'} bg-background border-e border-border`} aria-labelledby="drawer-navigation-label">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-64 text-muted cursor-pointer" title={`${open ? 'Abrir' : 'Fechar'} o menu`} onClick={toggleOpen}>{open ? 'left_panel_open' : 'left_panel_close'}</span>
        </div>

        <div className="border-b border-border pb-4 flex items-center">
          <a href="https://flowbite.com/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <img src="favicon.png" className="h-6 w-6" alt="Logo" />
            <span className="self-center text-lg font-semibold whitespace-nowrap text-heading">Chat IA</span>
          </a>
        </div>

        <div className="py-5 overflow-y-auto">
          {sidebarContent}
        </div>
      </aside>
    </>
  )
}

export default Sidebar;