import { useState, useEffect } from 'react';
import { KEYS, get, set } from '../services/config';

const Config = () => {
  const [models, setModels] = useState([]);
  const [quantity, setQuantity] = useState(8);
  const [thinking, setThinking] = useState(false);
  const [influence, setInfluence] = useState(2);
  const [memory, setMemory] = useState(4);
  const [score, setScore] = useState(75);
  const [temperature, setTemperature] = useState(0.5);
  const [curModel, setCurModel] = useState('gemma3:1b');

  useEffect(() => {
    const fet = async () => {
      const resp = await fetch(KEYS.API_TAGS_URL);
      const data = await resp.json();
      setModels(data.models
        .filter(m => !m.capabilities.includes('embedding'))
        .sort((a, b) => a.name.localeCompare(b.name)));
    };
    fet();
  }, []);

  useEffect(() => {
    setCurModel(get(KEYS.C_MODEL, models.filter(m => m.model.includes('gemma3:1b'))[0]?.model || models[0]?.model) || 'gemma3:1b');
    console.log('a', curModel)
  }, [curModel]);

  const capabilities = {
    vision: 'eye_tracking',
    completion: 'text_snippet',
    tools: 'construction',
    thinking: 'network_intel_node',
  }

  // auxiliar itens do menu
  const getModelItem = (model) => {
    if (!model) return;
    let cur_aux = model.model == curModel ? 'blue' : 'gray';
    let names = model.name.split(':');

    return (<>
      <div className={`relative flex flex-col bg-white border border-${cur_aux}-500 rounded-xl overflow-hidden transition-all hover:border-blue-600 hover:shadow-md cursor-pointer group`}>
        <div className={`p-4 pb-2 border-b border-${cur_aux}-300 bg-${cur_aux}-100`}>
          <div className="flex items-start justify-between mb-2">
            <h3 className={`text-${cur_aux}-800 group-hover:font-medium text-[18px] capitalize`}>{names[0]}:<span className="uppercase">{names[1]}</span></h3>
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
            <button className="p-1.5 rounded-full border border-gray-500 text-gray-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-100 transition-all flex items-center justify-center" title="Selecionar modelo">
              <span className={`material-symbols-outlined text-${cur_aux}-500 text-[20px]`}>radio_button_unchecked</span>
            </button>
          </div>
        </div>
      </div>
    </>);
  }

  return (
    <section className="flex-grow overflow-y-auto p-4 max-w-[1376px] mx-auto w-full h-full">
      <div className="bg-white border border-gray-300 rounded-xl py-4 px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500"
              style={{fontVariationSettings: "'FILL' 1"}}>model_training</span>
            <h2 className="text-xl font-medium tracking-tight">Modelos</h2>
          </div>
          <span className="text-sm font-medium text-gray-600">
            {models.length + (models.length > 1 ? ' modelos disponíveis' : ' modelo disponível')}
          </span>
        </div>

        <nav className="flex items-center gap-2 overflow-x-auto hide-scrollbar mask-gradient relative">
          <div className="flex items-center gap-6 whitespace-nowrap mb-4">
            
            { models.map((m, i) => {
              return getModelItem(m);
            }) }

          </div>
        </nav>
      </div>
    </section>
  );
}

export default Config;