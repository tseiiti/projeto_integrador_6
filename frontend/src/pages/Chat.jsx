import { useState, useEffect, useRef } from 'react';
import {MESSAGES} from '../services/data';
import MessageUser from '../components/MessageUser';
import MessageAssistant from '../components/MessageAssistant';

const Chat = () => {
  // const [inputValue, setInputValue] = useState('');
  // const [loading, setLoading] = useState(false);
  
  // const handleSend = async (textToSend) => {
  //   setInputValue('');
  //   setLoading(true);

  //   alert(textToSend);
  // }

  // const handleKeyDown = (event) => {
  //   if (event.key === 'Enter') {
  //     e.preventDefault();
  //     handleSend(inputValue);
  //   }
  // };

  // const [formData, setFormData] = useState({role: 'user', content: ''});

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (formData.content.trim().length == 0) return;
  //   // send_query(props, formData);
  //   setFormData({role: 'user', content: ''});
  // };

  // const handleEnter = (e) => {
  //   if (e.key === 'Enter' && !e.shiftKey) {
  //     e.preventDefault();
  //     e.target.form.requestSubmit();
  //   }
  // };

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('app_chat_history');
    if (saved) {
      return JSON.parse(saved);
    }
    return MESSAGES;
  });

  const endRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('app_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (<>
    <section className="flex-grow overflow-y-auto custom-scrollbar p-md max-w-[1376px] mx-auto w-full h-full">
      {/* Message Stream Area */}
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
          d
        </div>
      </div>
    </section>
  </>);
}

export default Chat;