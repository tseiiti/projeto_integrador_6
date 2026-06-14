import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Settings from './components/Settings';
import './App.css';

const App = () => {
  const [activeView, setActiveView] = useState('chat');

  return (
    <>
      <Sidebar />
    </>
  );
}

export default App;
