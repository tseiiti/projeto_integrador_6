import { useState, useEffect, useRef } from 'react';
import { KEYS, set, get, qs, showToast, pasteText } from '../services/util';
import MessageUser from '../components/MessageUser';
import MessageAssistant from '../components/MessageAssistant';
import MessageThinking from '../components/MessageThinking';
import MessageShell from '../components/MessageShell';

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
            return <MessageUser key={message.id} message={message} />;
          if (message.role == 'assistant')
            return <MessageAssistant key={message.id} message={message} />;
        })}
        {loading && <MessageThinking model='gemma3:1b' />}
        <div ref={endRef} />
      </div>
    
      {/* Shell Area */}
      {<MessageShell messages = {messages} setMessages = {setMessages} setLoading = {setLoading} />}
    </section>
  </>);
}

export default Chat;