import { useState, useEffect, useRef } from 'react';
import { KEYS, set, get, qs, showToast, pasteText } from '../services/util';
import ChatUser from '../components/ChatUser';
import ChatAssistant from '../components/ChatAssistant';
import ChatThinking from '../components/ChatThinking';
import ChatShell from '../components/ChatShell';
import ChatDetail from '../components/ChatDetail';

const Chat = () => {
  const [messages, setMessages] = useState(() => {
    return get(KEYS.MESSAGES, [KEYS.DEFAULT_MESSAGE]);
  });
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const endRef = useRef(null);
  
  const setLike = (message, value) => {
    if (value == message?.like) value = 0;
    
    setMessages(prev => {
      const items = [...prev];
      const i = items.findIndex(e => e.id == message.id);
      if (i >= 0) {
        items[i] = {
          ...items[i],
          like: value
        }
      }
      return items;
    });
  }

  useEffect(() => {
    set(KEYS.MESSAGES, messages);
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (<>
    <section className="flex-grow overflow-y-auto custom-scrollbar p-md max-w-[1376px] mx-auto w-full h-full">

      {/* Messagens */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 lg:px-16 space-y-2 min-h-[calc(100dvh/2-64px)]">
        {messages.map((message) => {
          if (message.role == 'user')
            return <ChatUser key={message.id} message={message} />;
          if (message.role == 'assistant')
            return <ChatAssistant key={message.id} message={message} setMessages={setMessages} setDetail={setDetail} setLike={setLike} />;
        })}
        {loading && <ChatThinking model='gemma3:1b' />}
        <div ref={endRef} />
      </div>
    
      {/* Entrada */}
      {<ChatShell messages={messages} setMessages={setMessages} setLoading={setLoading} />}

      {/* Detalhes */}
      <ChatDetail detail={detail} setDetail={setDetail} />
    </section>

  </>);
}

export default Chat;