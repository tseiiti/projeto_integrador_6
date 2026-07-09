import { useState, useEffect } from 'react';
import { KEYS, get, set } from '../services/config';
import Card from '../components/Card';
import Input from '../components/Input';
import ConfigModel from '../components/config/ConfigModel';

const Config = () => {
  const [conf, setConf] = useState(() => {
    return get(KEYS.CONF, KEYS.DEFAULT_CONF);
  });
  const [backup, setBackup] = useState(() => {
    return get(KEYS.BACKUP, []);
  });
  const [chatId, setChatId] = useState();

  const setCurrent = (current) => { setConf({...conf, current: current}) }
  const setQuantity = (quantity) => { setConf({...conf, quantity: quantity}) }
  const setInfluence = (influence) => { setConf({...conf, influence: influence}) }
  const setScore = (score) => { setConf({...conf, score: score}) }
  const setThinking = (thinking) => { setConf({...conf, thinking: thinking}) }
  const setMemory = (memory) => { setConf({...conf, memory: memory}) }
  const setTemperature = (temperature) => { setConf({...conf, temperature: temperature}) }

  const backupChat = (id) => {console.log(2); 
    const messages = get(KEYS.MESSAGES, [KEYS.DEFAULT_MESSAGE]);
    if (messages?.length > 1) {console.log(3); 
      setBackup(prev => {
        const i = prev.findIndex(e => e.id == id);
        if (id && i >= 0) {
          prev[i] = {
            ...prev[i],
            messages: messages,
            conf: conf
          }
          return prev;
        } else {
          return [...prev, {
            id: prev.length,
            messages: messages,
            conf: conf
          }];
        }
      });
    }
  }
  const cleanChat = () => {}
  const saveChat = () => {console.log(1); backupChat()}
  const newChat = () => {}

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

      setConf(prev => {return {
        ...prev, 
        models: models,
        current: current,
      }});
    })();
  }, []);

  useEffect(() => {
    set(KEYS.CONF, conf);
  }, [conf]);

  useEffect(() => {
    set(KEYS.BACKUP, backup);
  }, [backup]);


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

  const getHistBtn = (color, onclick, title, icon, desc) => {
    return (
      <button className={`flex items-center justify-center rounded-lg py-1 pl-2 pr-3 sm:pl-6 sm:pr-7 whitespace-nowrap text-white shadow-md bg-${color}/60 hover:bg-${color}`} onClick={onclick} title={title}>
        <span className="material-symbols-outlined">{icon}</span> {desc}
      </button>
    );
  }

  const getHistory = () => {
    return (
      <Card title='Conversas' icon='chat'>
        <div className="flex items-center justify-end space-x-2 sm:space-x-4">
          {getHistBtn('red-500', cleanChat, 'Limpar conversa atual', 'mop', 'Limpar')}
          {getHistBtn('green-600', saveChat, 'Salvar conversa atual', 'keep', 'Salvar')}
          {getHistBtn('blue-600', newChat, 'Salvar a atual e criar uma nova conversa', 'add', 'Novo Chat')}
        </div>

        <div className="flex-grow overflow-y-auto px-2 space-y-xs">
          <div className="px-4 py-2">
            <h3 className="text-sm text-gray-500 uppercase tracking-wider">Histórico</h3>
          </div>
          <div className="history">as</div>
        </div>
      </Card>
    );
  }

  return (
    <section className="overflow-y-auto p-6 max-w-[1376px] mx-auto w-full h-full space-y-4">
      {getModelCards()}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6">
          {getContext()}
        </div>

        <div className="md:col-span-6">
          {getThinking()}
        </div>

        <div className="md:col-span-12">
          {getHistory()}
        </div>
      </div>
    </section>
  );
}

export default Config;