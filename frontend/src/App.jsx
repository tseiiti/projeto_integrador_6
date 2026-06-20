import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Chat from './pages/Chat';
import Settings from './pages/Settings';


const App = () => {
  const [active, setActive] = useState('chat');
  const [sidebar, setSidebar] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const render = () => { 
    switch (active) {
      case 'chat':
        return <Chat />;
      case 'config':
        return (
          <Settings />
        );
      default:
        return <Chat />;
      }
  }

  return (<>
    <div id="main" className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Sidebar
        active={active}
        setActive={setActive}
        sidebar={sidebar}
        setSidebar={setSidebar}
        mobile={mobile}
        setMobile={setMobile} />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header
          active={active}
          theme={theme}
          setTheme={setTheme}
          mobile={mobile}
          setMobile={setMobile} />
        {render()}
      </div>
    </div>
  </>);
}

export default App;
