
const ConfigModel = ({model, current, setCurrent}) => {
  if (!model) return null;

  const cur_aux = model.model == current ? 'indigo' : 'slate';
  const names = model.name.split(':');

  const capabilities = {
    vision: 'eye_tracking',
    completion: 'text_snippet',
    tools: 'construction',
    thinking: 'network_intel_node',
  }

  return (
    <div className={`relative flex flex-col bg-white border border-${cur_aux}-300 dark:border-${cur_aux}-500 rounded-xl overflow-hidden transition-all hover:border-indigo-600 hover:shadow-md group`}>
      <div className={`p-4 pb-2 border-b border-${cur_aux}-300 dark:border-${cur_aux}-500 bg-${cur_aux}-100 dark:bg-${cur_aux}-800`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className={`text-${cur_aux}-500 dark:text-${cur_aux}-300  group-hover:text-${cur_aux}-600 group-hover:dark:text-${cur_aux}-200 group-hover:font-medium text-[18px] capitalize`}>
            {names[0]}:<span className="uppercase">{names[1]}</span>
          </h3>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className={`text-${cur_aux}-400 group-hover:text-${cur_aux}-600 group-hover:dark:text-${cur_aux}-300 text-[13px] font-bold`}>
            {model.details.parameter_size}
          </div>
          <div className={`text-[10px] px-2 bg-white border border-${cur_aux}-200 dark:border-${cur_aux}-600 rounded-sm uppercase`}>
            {model.details.format} * {model.details.quantization_level}
          </div>
          <div className="bg-slate-200 px-1.5 py-0.5 rounded text-[10px] ml-auto text-slate-600 font-bold uppercase">
            {model.details.family}
          </div>
        </div>
      </div>
      <div className="p-4 space-y-4 flex-grow flex flex-col justify-between dark:bg-slate-700">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="material-symbols-outlined text-[14px] dark:text-slate-300">schedule</span>
            <span className="dark:text-slate-300">Modificado em {(new Date(model.modified_at)).toLocaleString()}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            { model.capabilities.map((c, i) => {
              return <span key={`span-capability-${i}`} className="material-symbols-outlined text-[16px] dark:text-slate-300" title={c.charAt(0).toUpperCase() + c.slice(1)}>{capabilities[c]}</span>;
            }) }
          </div>
        </div>
        <hr className="text-slate-300 dark:text-slate-500 mb-2" />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="material-symbols-outlined text-[14px] dark:text-slate-300">data_table</span>
            <span className="dark:text-slate-300">{(model.size / 1024 ** 2).toFixed(2)}MB</span>
          </div>
          <button className="p-1.5 rounded-full border border-slate-500 dark:border-slate-400 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-100 transition-all flex items-center justify-center cursor-pointer" title="Selecionar modelo" onClick={setCurrent}>
            <span className={`material-symbols-outlined text-${cur_aux}-500 text-[20px]`}>radio_button_unchecked</span>
          </button>
        </div>
      </div>

      <div className="hidden
        border-slate-300 border-slate-500 border-indigo-300 border-indigo-500
        bg-slate-100 bg-slate-700 bg-indigo-100 bg-indigo-700 
        text-slate-200 text-slate-300 text-slate-500 text-slate-800 
        text-indigo-200 text-indigo-300 text-indigo-500 text-indigo-800 group-hover:dark:text-slate-200 group-hover:dark:text-slate-300 group-hover:dark:text-indigo-200 group-hover:dark:text-indigo-300 group-hover:text-slate-200 group-hover:text-indigo-200 group-hover:text-slate-300 group-hover:text-indigo-300 group-hover:text-slate-600 group-hover:text-indigo-600" />
    </div>
  );
}

export default ConfigModel;