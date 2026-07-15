import { useState, useEffect } from 'react';
import { Toast, BottomToast } from './components/Toast';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Chat from './pages/Chat';
import Report from './pages/Report';
import Config from './pages/Config';

const App = () => {
  const [active, setActive] = useState('chat');   // controla tela atual
  const [desktop, setDesktop] = useState(true);   // se menu desktop está aberto
  const [mobile, setMobile] = useState(false);    // se menu mobile está aberto
  
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

  // reinderiza tela atual
  const render = () => {
    switch (active) {
      case 'chat':
        return <Chat />;
      case 'report':
        return <Report />;
        
      case 'config':
        return (
          <Config desktop={desktop} setActive={setActive} theme={theme} setTheme={setTheme} />
        );
      default:
        return <Chat />;
    }
  }

  return (
    <div id="main" className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Sidebar
        active={active}
        setActive={setActive}
        desktop={desktop}
        setDesktop={setDesktop}
        mobile={mobile}
        setMobile={setMobile} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          active={active}
          theme={theme}
          setTheme={setTheme}
          mobile={mobile}
          setMobile={setMobile} />

        {render()}
        <Toast />
        <BottomToast />
      </div>
    </div>
  );
}

export default App;
