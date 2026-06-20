

const MessageAssistant = ({message}) => {
  const like = (message, value) => {
    if (value == message?.like) value = 0;
    // stgMsg.upd(message.id, {...message, like: value});
    fetchMessages();
  }
  
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Texto copiado!');
    } catch (err) {
      console.error(err);
    }
  };

  // let ctxs = msg.contexts;
  // let ctx = ctxs[0];
  // let ltx = ctxs.at(-1);
  // let context = ctx ? ` | contextos: ${ctxs.length}, max: ${Math.round(180 - ctx.score * 100)}, min: ${Math.round(180 - ltx.score * 100)}` : '';
  
  return (
    <div className="flex flex-col items-start group" id={message?.id}>
      <div className="max-w-[95%] sm:max-w-[85%] sm:flex sm:items-start gap-2 space-y-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-400 flex items-center justify-center flex-shrink-0 mt-1 shadow-md shadow-primary/10">
          <span className="material-symbols-outlined text-white text-sm"
            style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
        </div>
        <div className="bg-white rounded-xl rounded-tl-none p-4 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-200">
          <div className="prose prose-sm max-w-none text-justify">
            <div className="text-on-surface content [&>*]:pb-2 [&>ul]:list-disc [&_ul]:pl-5 [&>ul]:[&_ul]:list-['⮞'] [&_ol]:list-decimal [&_ol]:pl-5">{message.content}</div>
          </div>
          <div className="flex items-center gap-3">
            <button className="cursor-pointer px-1 pt-1.5 hover:bg-gray-200 rounded-md transition-colors text-gray-400 hover:text-gray-800">
              <span className="material-symbols-outlined like" style={{fontVariationSettings: (message?.like == 1 ? "'FILL' 1" : '')}}>thumb_up</span>
            </button>
            <button className="cursor-pointer px-1 pt-1.5 hover:bg-gray-200 rounded-md transition-colors text-gray-400 hover:text-gray-800">
              <span className="material-symbols-outlined like" style={{fontVariationSettings: (message?.like == -1 ? "'FILL' 1" : '')}}>thumb_down</span>
            </button>
            <button className="cursor-pointer px-1 pt-1.5 hover:bg-gray-200 rounded-md transition-colors text-gray-400 hover:text-gray-800"
              onClick={() => copy(message?.content)}>
              <span className="material-symbols-outlined">content_copy</span>
            </button>
            <p className="text-[10px] text-on-surface-variant/80 mb-1">{message?.times?.created_at}</p>
            <a className="text-[10px] text-on-surface-variant/80 mb-1" href="/detail.html?id={message?.id}">detalhes</a>
          </div>
        </div>
      </div>
      <div className="ml-2 sm:ml-12 text-[10px] text-on-surface-variant mt-2 block opacity-0 group-hover:opacity-100 transition-opacity font-bold">
        <span className="tokens">tokens enviados: {message?.up_tokens} | tokens recebidos: {message?.dw_tokens}</span>
      </div>
    </div>
  )
};

export default MessageAssistant;