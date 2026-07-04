import { useState, useEffect, useRef } from 'react';
import { KEYS, set, get, qs, showToast, pasteText } from '../services/util';
import ChatUser from '../components/ChatUser';
import ChatAssistant from '../components/ChatAssistant';
import ChatThinking from '../components/ChatThinking';
import ChatShell from '../components/ChatShell';

const Chat = () => {
  const [messages, setMessages] = useState(() => {
    return get(KEYS.MESSAGES, [KEYS.DEFAULT_MESSAGE]);
  });

  const endRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    set(KEYS.MESSAGES, messages);
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (<>
    <section className="flex-grow overflow-y-auto custom-scrollbar p-md max-w-[1376px] mx-auto w-full h-full">

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 lg:px-16 space-y-2 min-h-[calc(100dvh/2-64px)]">
        {messages.map((message) => {
          if (message.role == 'user')
            return <ChatUser key={message.id} message={message} />;
          if (message.role == 'assistant')
            return <ChatAssistant key={message.id} message={message} />;
        })}
        {loading && <ChatThinking model='gemma3:1b' />}
        <div ref={endRef} />
      </div>
    
      {/* Shell Area */}
      {<ChatShell messages = {messages} setMessages = {setMessages} setLoading = {setLoading} />}
    </section>
  </>);
}

export default Chat;