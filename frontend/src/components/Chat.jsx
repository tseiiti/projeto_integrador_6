import { useState, useEffect } from 'react';

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

  const [formData, setFormData] = useState({role: 'user', content: ''});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.content.trim().length == 0) return;
    // send_query(props, formData);
    setFormData({role: 'user', content: ''});
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.target.form.requestSubmit();
    }
  };

  return (
    <div className="bg-white rounded-2xl p-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-outline-variant focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-500">
      <form id="form_chat_api" onSubmit={handleSubmit}>
        <div className="flex items-end gap-2 px-2 py-1">
          <span className="material-symbols-outlined ml-2 mb-3 text-outline text-on-surface">article</span>
          <textarea
            value={formData.content}
            name="textarea_prompt"
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm py-3 px-2 resize-none max-h-48 custom-scrollbar placeholder:text-outline text-on-surface font-medium"
            placeholder="Escreva a questão a ser enviada para o assistente de IA" rows="1"
            onKeyDown={handleEnter}
            onChange={(e) => setFormData({...formData, content: e.target.value})}></textarea>
          <div className="flex items-center gap-1 mb-1">
            <button type="submit"
              title="Enviar ao assistente"
              className="ml-2 w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary-dim hover:scale-105 active:scale-95 transition-all">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </form>
    </div>);
}

export default Chat;