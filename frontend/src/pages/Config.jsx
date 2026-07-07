import { useState, useEffect } from 'react';
import { KEYS, get, set } from '../services/config';
import Card from '../components/Card';
import ConfigModel from '../components/ConfigModel';

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
  }, [curModel]);

  const cleanChat = () => {}
  const saveChat = () => {}
  const newChat = () => {}

  const getModelCards = () => {
    return (
      <Card title='Modelos' icon='model_training'
        rightTitle={models.length + (models.length > 1 ? ' modelos disponíveis' : ' modelo disponível')}>

        <nav className="flex items-center gap-2 overflow-x-auto hide-scrollbar mask-gradient relative">
          <div className="flex items-center gap-6 whitespace-nowrap mb-4">
            { models.map((model, i) => 
              <ConfigModel 
                key={`config-model-${i}`}
                model={model}
                curModel={curModel}
                setCurModel={setCurModel} />) }
          </div>
        </nav>
      </Card>
    );
  }

  const getContext = () => {
    return (
      <Card title='Contexto' icon='contextual_token'>

        <div className="space-y-4 flex-grow">
          <div className="flex items-center justify-between p-4 bg-gray-100 rounded-xl border border-gray-300">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-200 rounded-lg text-gray-600">
                <span className="material-symbols-outlined">17mp</span>
              </div>
              <div>
                <p className="text-sm font-medium">Quantidade de Máxima</p>
                <p className="text-[12px] text-gray-500">Quantidade máxima de buscas de contexto que corresponda a pergunta.</p>
              </div>
            </div>
            <input type="number" id="quantity" min="1" max="10" value={quantity} onChange={(e) => setQuantity(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-100 rounded-xl border border-gray-300">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-200 rounded-lg text-gray-600">
                <span className="material-symbols-outlined">grain</span>
              </div>
              <div>
                <p className="text-sm font-medium">Quantidade de Relações</p>
                <p className="text-[12px] text-gray-500">Quantidade de perguntas anteriores que influenciam no contexto atual.</p>
              </div>
            </div>
            <input type="number" id="influence" min="0" max="10" value={influence} onChange={(e) => setInfluence(e.target.value)} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>

          <div className="bg-gray-100 p-4 rounded-xl border border-gray-300">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Score Mínimo</label>
              <span className="px-2 py-1 rounded text-sm" id="score-value">75</span>
            </div>
            <input className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" id="score-range" max="100" min="1" step="1" type="range" defaultValue={score} />
            <div className="flex justify-between text-[11px] text-gray-700">
              <span className="">Mínimo (1)</span>
              <span className="">Máximo (100)</span>
            </div>
            <p className="text-[12px] text-gray-500 mt-4">
              Define o nível mínimo de relevância para que um fragmento de contexto seja utilizado na resposta.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const getThinking = () => {
    return (
      <div className="bg-white border border-gray-300 rounded-xl p-8 h-full">
        <div className="flex items-center gap-2 mb-8">
          <span className="material-symbols-outlined text-blue-500"
            style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
          <h2 className="text-xl font-medium">Raciocínio</h2>
        </div>

        <div className="space-y-4 flex-grow">
          <div className="flex items-center justify-between p-4 bg-gray-100 rounded-xl border border-gray-300">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-200 rounded-lg text-gray-600">
                <span className="material-symbols-outlined">threat_intelligence</span>
              </div>
              <div>
                <p className="text-sm font-medium">Modo Thinking</p>
                <p className="text-[12px] text-gray-500">Habilita o processo de raciocínio detalhado da IA. Tem um processamento mais demorado.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input className="sr-only peer" id="thinking" type="checkbox" onChange={(e) => setThinking(e.target.value)} />
              <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500">
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-100 rounded-xl border border-gray-300">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-200 rounded-lg text-gray-600">
                <span className="material-symbols-outlined">book</span>
              </div>
              <div>
                <p className="text-sm font-medium">Lembranças</p>
                <p className="text-[12px] text-gray-500">Quantidade de perguntas e respostas que enviadas como complemento.</p>
              </div>
            </div>
            <input type="number" id="memory" min="0" max="10" value={memory} onChange={(e) => setMemory(e.target.value)} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>

          <div className="bg-gray-100 p-4 rounded-xl border border-gray-300">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Temperatura</label>
              <span className="bg-blue-400 text-blue-300 px-2 py-1 rounded text-sm" id="temperature-value">0.7</span>
            </div>
            <input className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500" id="temperature-range" max="2" min="0" step="0.1" type="range" defaultValue={temperature} />
            <div className="flex justify-between text-[11px] text-gray-700">
              <span className="">Preciso (0.0)</span>
              <span className="">Criativo (2.0)</span>
            </div>
            <p className="text-[12px] text-gray-500">
              Define a aleatoriedade das respostas. Valores baixos são mais determinísticos e os altos mais inventivos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getHistory = () => {
    return (
      <div className="bg-white border border-gray-300 rounded-xl p-8 h-full">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-500"
            style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
          <h2 className="text-xl font-medium">Conversas</h2>
        </div>

        <div className="flex-grow">
          <div className="flex items-center justify-end space-x-2 sm:space-x-4">
            <button className="inline-block bg-transparent border border-red-300 hover:bg-red-400 text-red-400 hover:text-white rounded-lg py-0.5 pl-2 pr-3 sm:pl-6 sm:pr-8 whitespace-nowrap" onClick={cleanChat} title="Limpar conversa atual">
              <span className="material-symbols-outlined">mop</span>Limpar
            </button>

            <button className="inline-block bg-gray-600 text-white rounded-lg py-1 pl-2 pr-3 sm:pl-6 sm:pr-8 flex items-center justify-center hover:bg-gray-700 shadow-md whitespace-nowrap" onClick={saveChat} title="Salvar conversa atual">
              <span className="material-symbols-outlined">keep</span>Salvar
            </button>

            <button className="inline-block bg-blue-400 text-white rounded-lg py-1 pl-2 pr-3 sm:pl-6 sm:pr-8 flex items-center justify-center hover:bg-blue-600 shadow-md whitespace-nowrap" onClick={newChat} title="Salvar a atual e criar uma nova conversa">
              <span className="material-symbols-outlined">add</span>Novo Chat
            </button>
          </div>

          <div className="flex-grow overflow-y-auto px-2 space-y-xs">
            <div className="px-md py-sm">
              <h3 className="text-sm text-gray-500 uppercase tracking-wider">Histórico</h3>
            </div>
            <div className="history">
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="flex-grow overflow-y-auto p-6 max-w-[1376px] mx-auto w-full h-full space-y-4">
      {getModelCards()}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6">
          {getContext()}
        </div>

        <div className="lg:col-span-6">
          {getThinking()}
        </div>

        <div className="lg:col-span-12">
          {getHistory()}
        </div>
      </div>
    </section>
  );
}

export default Config;