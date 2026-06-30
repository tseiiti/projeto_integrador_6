import { useState, useEffect, useRef } from 'react';
import { KEYS } from '../services/data';
import { set, get, qs, showToast, pasteText } from '../services/util';
import { sendQuery } from '../services/chat';
import MessageUser from '../components/MessageUser';
import MessageAssistant from '../components/MessageAssistant';
import MessageLast from '../components/MessageAssistant';

const Chat = () => {
  const [messages, setMessages] = useState(() => {
    return get(KEYS.MESSAGES, [KEYS.DEFAULT_MESSAGE]);
  });

  const endRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    sendQuery('#textarea-prompt', messages, setMessages, setLoading);
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  useEffect(() => {
    set(KEYS.MESSAGES, messages);
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (<>
    <section className="flex-grow overflow-y-auto custom-scrollbar p-md max-w-[1376px] mx-auto w-full h-full">

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-0 sm:p-8 lg:px-16 space-y-2 min-h-[calc(100dvh/2-64px)]">
        {messages.map((message) => {
          if (message.role == 'user')
            return <MessageUser key={message.id} message={message} />;
          if (message.role == 'assistant')
            return <MessageAssistant key={message.id} message={message} />;
        })}

        <div ref={endRef} />
      </div>
    
      {/* Shell Area */}
      <div className="sm:px-12 lg:px-24 py-4 mb-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-1 border border-gray-300 focus-within:border-blue-500 transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.1)] focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-2 px-1.5 py-1">
              <span className="material-symbols-outlined text-gray-400 ml-1 cursor-pointer hover:scale-105 active:scale-95 transition-all" style={{fontSize: '32px'}} onClick={() => {pasteText('#textarea-prompt')}}>article</span>
              <textarea id="textarea-prompt" name="textarea-prompt"
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm px-1 py-3 resize-none h-11 max-h-48 custom-scrollbar placeholder:text-gray-400 font-medium"
                placeholder="Escreva sua questão para ser enviada ao Assistente" rows="1"
                onKeyDown={handleEnter}></textarea>

              <div className="flex items-center gap-1 mb-0.5">
                <button className="ml-2 w-10 h-10 rounded-xl bg-blue-600 text-white cursor-pointer flex items-center justify-center shadow-lg shadow-blue-100 hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all"
                  onClick={handleSend}>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>);
}

export default Chat;