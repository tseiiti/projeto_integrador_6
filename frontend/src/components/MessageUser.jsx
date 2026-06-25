import {copy} from '../services/util';

const MessageUser = ({message}) => {
  return (
    <div className="flex flex-col items-end group">
      <div className="max-w-[80%] flex items-start gap-4 flex-row-reverse">
        <div className="w-8 h-8 rounded-full bg-sky-300 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-blue-700 text-sm"
            style={{fontVariationSettings: "'FILL' 1"}}>person</span>
        </div>
        <div className="relative">
          <div className="border-l-4 border-blue-600 pl-4 py-1 text-justify">
            <div className="text-zinc-800 text-sm font-medium">{message.content}</div>
          </div>
          <span className="text-[10px] text-zinc-500 mt-2 block opacity-0 group-hover:opacity-100 transition-opacity font-bold">
            {message.times.created_at}
          </span>
        </div>
        <button className="cursor-pointer p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-800 opacity-0 group-hover:opacity-100"
          onClick={() => copy(message?.content)}>
          <span className="material-symbols-outlined text-[24px]">content_copy</span>
        </button>
      </div>
    </div>
  )
};

export default MessageUser;