import { copyText, markdown } from '../../services/util';

const ChatAssistant = ({message, setDetail, setLike}) => {

  const getContext = (ctxs) => {
    const ctx = ctxs[0];
    const ltx = ctxs.at(-1);
    return ctx ? ` | contextos: ${ctxs.length}, max: ${Math.round(180 - ctx.score * 100)}, min: ${Math.round(180 - ltx.score * 100)}` : '';
  }

  return (
    <div className="flex flex-col items-start group mb-6" id={message?.id}>
      <div className="max-w-[95%] sm:max-w-[85%] sm:flex sm:items-start gap-2 space-y-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-400 flex items-center justify-center flex-shrink-0 mt-1 shadow-md shadow-gray-300 dark:shadow-gray-600">
          <span className="material-symbols-outlined text-white text-sm"
            style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
        </div>
        <div className="bg-white rounded-xl rounded-tl-none p-4 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-200 dark:bg-zinc-900 dark:border-zinc-800">
          <div className="prose prose-sm max-w-none text-justify">
            <div className="text-zinc-800 dark:text-zinc-300 content [&>*]:pb-2 [&>ul]:list-disc [&_ul]:pl-5 [&>ul]:[&_ul]:list-['⮞'] [&_ol]:list-decimal [&_ol]:pl-5 assistant-content" dangerouslySetInnerHTML={{ __html: markdown(message.content) }}/>
          </div>
          <div className="flex items-center gap-3 text-gray-400 transition-colors">
            <button className="cursor-pointer px-1 pt-1.5 hover:bg-gray-200 rounded-md hover:text-gray-800" onClick={() => setLike(message, 1)}>
              <span className="material-symbols-outlined" style={{fontVariationSettings: (message?.like == 1 ? "'FILL' 1" : '')}}>thumb_up</span>
            </button>
            <button className="cursor-pointer px-1 pt-1.5 hover:bg-gray-200 rounded-md hover:text-gray-800" onClick={() => setLike(message, -1)}>
              <span className="material-symbols-outlined" style={{fontVariationSettings: (message?.like == -1 ? "'FILL' 1" : '')}}>thumb_down</span>
            </button>
            <button className="cursor-pointer px-1 pt-1.5 hover:bg-gray-200 rounded-md hover:text-gray-800"
              onClick={() => copyText(message?.content)}>
              <span className="material-symbols-outlined">content_copy</span>
            </button>
            <p className="text-[10px] text-zinc-500 mb-1">{(new Date(message?.times?.created_at)).toLocaleString()}</p>
            <button className="cursor-pointer text-[10px] text-zinc-500 mb-1" onClick={() => setDetail(message)}>detalhes</button>
          </div>
        </div>
      </div>
      <div className="ml-2 sm:ml-12 text-[10px] text-zinc-600 mt-2 block opacity-0 group-hover:opacity-100 transition-opacity font-bold">
        <span className="tokens">up: {message.up_tokens} | down: {message.dw_tokens}</span>
        {getContext(message.contexts)}
      </div>
    </div>
  );
}

export default ChatAssistant;