import { useState, useEffect } from 'react';
import { KEYS, get, set } from '../services/config';
import Card from '../components/Card';
import Input from '../components/Input';
import ConfigModel from '../components/config/ConfigModel';

const Config = () => {
  const [conf, setConf] = useState(() => {
    let saved = get(KEYS.CONF);
    if (saved) return saved;
    return {
      models: [],
      current: null,
      quantity: 8,
      influence: 2,
      score: 75,
      thinking: false,
      memory: 4,
      temperature: 0.5,
    }
  });

  useEffect(() => {
    (async () => {
      const resp = await fetch(KEYS.API_TAGS_URL);
      const data = await resp.json();
      
      let models = data.models
          .filter(m => !m.capabilities.includes('embedding'))
          .sort((a, b) => a.name.localeCompare(b.name));
      
      let current = conf.current;
      if (!models.map(m => m.model).includes(current))
        current = models.filter(m => m.model.includes('gemma3:1b'))[0]?.model || models[0]?.model;

      setConf(prev => { return {
        ...prev, 
        models: models,
        current: current,
      } });
    })();
  }, []);

  useEffect(() => {
    set(KEYS.CONF, conf);
  }, [conf]);

  const setCurrent = (current) => { setConf({...conf, current: current}) }
  const setQuantity = (quantity) => { setConf({...conf, quantity: quantity}) }
  const setInfluence = (influence) => { setConf({...conf, influence: influence}) }
  const setScore = (score) => { setConf({...conf, score: score}) }
  const setThinking = (thinking) => { setConf({...conf, thinking: thinking}) }
  const setMemory = (memory) => { setConf({...conf, memory: memory}) }
  const setTemperature = (temperature) => { setConf({...conf, temperature: temperature}) }
  const cleanChat = () => {}
  const saveChat = () => {}
  const newChat = () => {}

  const getModelCards = () => {
    return (
      <Card title='Modelos' icon='model_training'
        rightTitle={conf.models.length + (conf.models.length > 1 ? ' modelos disponíveis' : ' modelo disponível')}>
        <nav className="flex items-center gap-2 overflow-x-auto hide-scrollbar mask-gradient relative">
          <div className="flex items-center gap-6 whitespace-nowrap mb-4">
            { conf.models.map((model, i) => 
              <ConfigModel 
                key={`config-model-${i}`}
                model={model}
                current={conf.current}
                setCurrent={setCurrent} />) }
          </div>
        </nav>
      </Card>
    );
  }

  const getContext = () => {
    return (
      <Card title='Contexto' icon='contextual_token' otherClasses='h-full'>
        <div className="space-y-4">
          <Input title='Quantidade de Máxima' icon='17mp' type='number' id='quantity' 
            description='Quantidade máxima de buscas de contexto que corresponda a pergunta.'
            min={1} max={10} value={conf.quantity} onChange={(e) => setQuantity(e.target.value)} />
          <Input title='Quantidade de Relações' icon='grain' type='number' id='influence' 
            description='Quantidade de perguntas anteriores que influenciam no contexto atual.'
            min={0} max={10} value={conf.influence} onChange={(e) => setInfluence(e.target.value)} />
          <Input title='Score Mínimo' icon='readiness_score' type='range' id='score' 
            description='Define o nível mínimo de relevância para que um fragmento de contexto seja utilizado na resposta.'
            min={1} max={100} value={conf.score} onChange={(e) => setScore(e.target.value)}
            minDesc='Mínimo (1)' maxDesc='Máximo (100)' />
        </div>
      </Card>
    );
  }

  const getThinking = () => {
    return (
      <Card title='Raciocínio' icon='contextual_token' otherClasses='h-full'>
        <div className="space-y-4">
          <Input title='Modo Thinking' icon='threat_intelligence' type='checkbox' id='thinking'
            description='Habilita o processo de raciocínio detalhado da IA. Tem um processamento mais demorado.' value={conf.thinking} onChange={(e) => setThinking(e.target.checked)} />
          <Input title='Lembranças' icon='book' type='number' id='memory' 
            description='Quantidade de perguntas e respostas que enviadas como complemento.'
            min={0} max={10} value={conf.memory} onChange={(e) => setMemory(e.target.value)} />
          <Input title='Temperatura' icon='device_thermostat' type='range' id='temperature' 
            description='Define a aleatoriedade das respostas. Valores baixos são mais determinísticos e os altos mais inventivos.'
            min={0} max={2} step={0.1} value={conf.temperature} onChange={(e) => setTemperature(e.target.value)}
            minDesc='Preciso (0.0)' maxDesc='Criativo (2.0)' />
        </div>
      </Card>
    );
  }

  const getHistory = () => {
    return (
      <Card title='Conversas' icon='chat'>
        <div className="flex items-center justify-end space-x-2 sm:space-x-4">
          <button className="flex items-center justify-center rounded-lg py-1 pl-2 pr-3 sm:pl-6 sm:pr-7 whitespace-nowrap text-white shadow-md bg-red-500/60 hover:bg-red-500" onClick={cleanChat} title="Limpar conversa atual">
            <span className="material-symbols-outlined sm:mr-1">mop</span> Limpar
          </button>

          <button className="flex items-center justify-center rounded-lg py-1 pl-2 pr-3 sm:pl-6 sm:pr-7 whitespace-nowrap text-white shadow-md bg-green-600/60 hover:bg-green-600" onClick={saveChat} title="Salvar conversa atual">
            <span className="material-symbols-outlined">keep</span> Salvar
          </button>

          <button className="flex items-center justify-center rounded-lg py-1 pl-2 pr-3 sm:pl-6 sm:pr-7 whitespace-nowrap text-white shadow-md bg-blue-600/60 hover:bg-blue-600" onClick={newChat} title="Salvar a atual e criar uma nova conversa">
            <span className="material-symbols-outlined">add</span> Novo Chat
          </button>
        </div>

        <div className="flex-grow overflow-y-auto px-2 space-y-xs">
          <div className="px-4 py-2">
            <h3 className="text-sm text-gray-500 uppercase tracking-wider">Histórico</h3>
          </div>
          <div className="history"></div>
        </div>
      </Card>
    );
  }

  return (
    <section className="overflow-y-auto p-6 max-w-[1376px] mx-auto w-full h-full space-y-4">
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