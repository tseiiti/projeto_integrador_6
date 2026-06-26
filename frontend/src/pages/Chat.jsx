import { useState, useEffect, useRef } from 'react';
import {MESSAGES} from '../services/data';
import MessageUser from '../components/MessageUser';
import MessageAssistant from '../components/MessageAssistant';
import { show_toast } from '../services/util';

const Chat = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('app_chat_history');
    if (saved) {
      return JSON.parse(saved);
    }
    return MESSAGES;
  });

  const endRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    show_toast('teste', 'weawefaopijo a;lkasjdfaoiwejoaiwlkj askdjfoaisfjaw;lefkj ;alksdjf;oai wej', 3.5);

    // if (formData.content.trim().length == 0) return;
    // send_query(props, formData);
    // setFormData({role: 'user', content: ''});
  };

  useEffect(() => {
    localStorage.setItem('app_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (<>
    <section className="flex-grow overflow-y-auto custom-scrollbar p-md max-w-[1376px] mx-auto w-full h-full">

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-0 sm:p-8 lg:px-16 space-y-8 min-h-[calc(100dvh/2-64px)]">
        {messages.map((message) => {
          if (message.role == 'user')
            return <MessageUser key={message.id} message={message} />;
          if (message.role == 'assistant')
            return <MessageAssistant key={message.id} message={message} />;
        })}

        <div ref={endRef} />
      </div>
    
      {/* Shell Area */}
      <div className="sm:px-12 lg:px-24 py-4 bg-gradient-to-b from-gray-200 via-gray-400 to-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-1 mb-0.5">
            <button className="ml-2 w-10 h-10 rounded-xl bg-blue-600 text-white cursor-pointer flex items-center justify-center shadow-lg shadow-blue-100 hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all"
              onClick={submit}>
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </>);
}

export default Chat;