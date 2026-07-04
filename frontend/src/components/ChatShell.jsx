import { pasteText } from '../services/util';
import { sendQuery } from '../services/chat';

const ChatShell = ({messages, setMessages, setLoading}) => {

  const handleSend = () => {
    sendQuery('#textarea-prompt', messages, setMessages, setLoading);
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="px-4 sm:px-12 lg:px-24 py-4 mb-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-1 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-900 focus-within:border-blue-500 transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.1)] focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2 px-1.5 py-1">
            <span className="material-symbols-outlined text-gray-400 ml-1 cursor-pointer hover:scale-105 active:scale-95 transition-all" style={{fontSize: '32px'}} onClick={() => {pasteText('#textarea-prompt')}}>article</span>
            <textarea id="textarea-prompt" name="textarea-prompt"
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm px-1 py-3 resize-none h-11 max-h-48 custom-scrollbar placeholder:text-gray-400 font-medium"
              placeholder="Escreva sua questão para ser enviada ao Assistente" rows="1"
              onKeyDown={handleEnter}></textarea>

            <div className="flex items-center gap-1 mb-0.5">
              <button className="ml-2 w-10 h-10 rounded-xl bg-blue-600 text-white cursor-pointer flex items-center justify-center shadow-lg shadow-blue-100 dark:shadow-gray-700 hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all"
                onClick={handleSend}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatShell;