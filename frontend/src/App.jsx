import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Chat from './components/Chat';
import Settings from './components/Settings';


const App = () => {
  const [active, setActive] = useState('chat');
  const [sidebar, setSidebar] = useState(false);
  const [mobile, setMobile] = useState(false);

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

  return (
    <div id="main" className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-zinc-955 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Sidebar
        active={active}
        setActive={setActive}
        sidebar={sidebar}
        setSidebar={setSidebar}
        mobile={mobile}
        setMobile={setMobile} />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {render()}
      </div>
    </div>
  );
}

export default App;
