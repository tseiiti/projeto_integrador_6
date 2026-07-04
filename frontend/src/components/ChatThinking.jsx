const ChatThinking = ({model}) => {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-400 flex items-center justify-center flex-shrink-0 mt-1 opacity-50">
        <span className="material-symbols-outlined text-white text-sm"
          style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
      </div>
      <div className="bg-blue-100 text-gray-500 rounded-full px-4 py-2 flex items-center gap-2.5 animate-pulse shadow-sm border border-blue-200">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full opacity-60"></div>
          <div className="w-1.5 h-1.5 bg-gray-500
           rounded-full opacity-30"></div>
        </div>
        <p className="text-xs font-bold">
          <label className="uppercase">{model}</label> em pensamento...
        </p>
      </div>
    </div>
  )
};

export default ChatThinking;