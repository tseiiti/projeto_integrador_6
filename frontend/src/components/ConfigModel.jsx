
const ConfigModel = ({model, curModel, setCurModel}) => {
  if (!model) return null;
  const cur_aux = model.model == curModel ? 'blue' : 'gray';
  const names = model.name.split(':');

  const capabilities = {
    vision: 'eye_tracking',
    completion: 'text_snippet',
    tools: 'construction',
    thinking: 'network_intel_node',
  }

  return (
    <div className={`relative flex flex-col bg-white border border-${cur_aux}-300 rounded-xl overflow-hidden transition-all hover:border-blue-600 hover:shadow-md cursor-pointer group`}>
      <div className={`p-4 pb-2 border-b border-${cur_aux}-300 bg-${cur_aux}-100`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className={`text-${cur_aux}-500 group-hover:text-${cur_aux}-600 group-hover:font-medium text-[18px] capitalize`}>{names[0]}:<span className="uppercase">{names[1]}</span></h3>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-[13px] font-bold text-${cur_aux}-800 group-hover:text-gray-500`}>{model.details.parameter_size}</span>
          <span className="text-[10px] text-gray-500 px-2 bg-white py-px border border-gray-200 rounded-sm uppercase">{model.details.format} * {model.details.quantization_level}</span>
          <span className="bg-gray-200 px-1.5 py-0.5 rounded text-[10px] ml-auto text-gray-600 font-bold uppercase">{model.details.family}</span>
        </div>
      </div>
      <div className="p-4 space-y-4 flex-grow flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="material-symbols-outlined text-[14px] text-gray-600">schedule</span>
            <span className="text-gray-500">Modificado em {(new Date(model.modified_at)).toLocaleString()}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            { model.capabilities.map((c, i) => {
              return <span key={`span-capability-${i}`} className="material-symbols-outlined text-[16px] text-gray-600" title={c.charAt(0).toUpperCase() + c.slice(1)}>{capabilities[c]}</span>;
            }) }
          </div>
        </div>
        <hr className="text-gray-300 mb-2" />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="material-symbols-outlined text-[14px] text-gray-600">data_table</span>
            <span className="text-gray-500">{(model.size / 1024 ** 2).toFixed(2)}MB</span>
          </div>
          <button className="p-1.5 rounded-full border border-gray-500 text-gray-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-100 transition-all flex items-center justify-center" title="Selecionar modelo" onClick={() => setCurModel(model.model)}>
            <span className={`material-symbols-outlined text-${cur_aux}-500 text-[20px]`}>radio_button_unchecked</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfigModel;