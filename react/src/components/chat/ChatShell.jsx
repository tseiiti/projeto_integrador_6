import { useState, useEffect } from 'react';
import { KEYS, set, pasteText } from '../../services/util';
import { sendQuery } from '../../services/chat';

const ChatShell = ({config, setConfig, messages, setMessages, setLoading}) => {
  useEffect(() => {
    set(KEYS.CONFIG, config);
  }, [config]);

  const handleSend = () => {
    sendQuery('#textarea-prompt', messages, setMessages, setLoading);
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const setCategory = (category) => {
    setConfig({...config, category: category});
  }

  const getMenBtn = (category, i) => {
    return (<button key={`category-${i}`} className={`inline-flex items-center w-full text-sm px-3 py-1 rounded-lg  focus:outline-none ${config.category == category ? 'text-slate-800 dark:text-slate-300' : 'cursor-pointer text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-600 dark:hover:text-slate-300'}`} onClick={() => setCategory(category)}>
      {category}
    </button>);
  }

  const getMenu = () => {
    return (
      <div className="relative inline-block text-left group" title="Selecione uma Categoria">
        <div className="absolute bottom-6 right-0 origin-top-right hidden group-hover:block">
          <div className="mb-4 rounded-lg bg-white dark:bg-slate-900 shadow-lg p-2 border border-slate-300 dark:border-slate-700">
            {getMenBtn('Todos', 0)}
            {config.categories.map((category, i) => 
              getMenBtn(category, i + 1)
            )}
          </div>
        </div>
        <button className="inline-flex justify-center text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-md group-hover:font-bold transform cursor-pointer focus:outline-none" title="As respostas do assistente serão baseadas pela Categoria selecionada">
          {config.category} 
          <span className="material-symbols-outlined">keyboard_arrow_down</span>
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-12 lg:px-24 py-4 mb-4">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl p-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus-within:border-blue-500 shadow-[0_8px_30px_rgba(0,0,0,0.1)] focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2 px-1.5 py-1">
            <span className="material-symbols-outlined text-slate-400 ml-1 cursor-pointer focus:outline-none hover:scale-110 active:scale-95 transition-all" style={{fontSize: '32px'}} title="Colar" onClick={() => {pasteText('#textarea-prompt')}}>article</span>
            <textarea id="textarea-prompt" name="textarea-prompt"
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm px-1 py-3 resize-none h-11 max-h-48 custom-scrollbar placeholder:text-slate-400 font-medium text-slate-700 dark:text-slate-300"
              placeholder="Escreva sua questão e pressione Enter para enviar ao Assistente" rows="1"
              onKeyDown={handleEnter}></textarea>

            {getMenu()}

            <div className="flex items-center">
              <button className="w-10 h-10 rounded-xl bg-blue-600 text-white dark:text-slate-100 cursor-pointer focus:outline-none flex items-center justify-center shadow-lg shadow-blue-100 dark:shadow-slate-700 hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all" title="Enviar"
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