import { useState, useEffect } from 'react';
import { KEYS, get, set, bottomToast } from '../services/config';
import Card from '../components/Card';
import Input from '../components/Input';
import ConfigModel from '../components/config/ConfigModel';

const Config = ({desktop, setActive, theme, setTheme}) => {
  const [config, setConfig] = useState(() => {
    return get(KEYS.CONFIG, KEYS.DEFAULT_CONFIG);
  });
  const [backup, setBackup] = useState(() => {
    return get(KEYS.BACKUP, []);
  });
  const [chatId, setChatId] = useState(() => {
    return get(KEYS.CHAT_ID, null);
  });
  
  useEffect(() => {
    (async () => {
      const resp = await fetch(KEYS.API_TAGS_URL);
      const data = await resp.json();
      
      let models = data.models
          .filter(m => !m.capabilities.includes('embedding'))
          .sort((a, b) => a.name.localeCompare(b.name));
      
      let current = config.current;
      if (!models.map(m => m.model).includes(current))
        current = models.filter(m => m.model.includes('gemma3:1b'))[0]?.model || models[0]?.model;

      setConfig(ant => {return {
        ...ant, 
        models: models,
        current: current,
      }});
    })();
  }, []);

  useEffect(() => {
    set(KEYS.CONFIG, config);
  }, [config]);

  useEffect(() => {
    set(KEYS.BACKUP, backup);
  }, [backup]);

  useEffect(() => {
    set(KEYS.CHAT_ID, chatId);
  }, [chatId]);

  const setCurrent = (e) => { setConfig({...config, current: e.model}); bottomToast(); }
  const setQuantity = (e) => { setConfig({...config, quantity: e.target.value}); bottomToast(); }
  const setInfluence = (e) => { setConfig({...config, influence: e.target.value}); bottomToast(); }
  const setScore = (e) => { setConfig({...config, score: e.target.value}); bottomToast(); }
  const setThinking = (e) => { setConfig({...config, thinking: e.target.checked}); bottomToast(); }
  const setMemory = (e) => { setConfig({...config, memory: e.target.value}); bottomToast(); }
  const setTemperature = (e) => { setConfig({...config, temperature: e.target.value}); bottomToast(); }

  const bkp = (addOther) => {
    const messages = get(KEYS.MESSAGES, [KEYS.DEFAULT_MESSAGE]);
    if (messages?.length > 1) {
      const aux = {
        messages: messages,
        config: config,
        updated_at: Date.now(),
      }
      setBackup(ant => {
        const i = ant.findIndex(e => e.id == chatId);
        if (i >= 0) {
          ant[i] = {...ant[i], ...aux}
          if (addOther) setChatId(null);
        } else {
          ant = [...ant, {id: ant.length + 1, ...aux}];
          if (!addOther) setChatId(ant.length);
        }
        if (addOther) set(KEYS.MESSAGES, [KEYS.DEFAULT_MESSAGE]);
        bottomToast();
        return ant;
      });
    }
  }
  const savChat = () => { bkp(false); }
  const newChat = () => { bkp(true); setActive('chat'); }
  const selChat = (id) => {
    const aux = backup.find(e => e.id == id);
    if (aux) {
      set(KEYS.CHAT_ID, aux.id);
      setChatId(aux.id);
      set(KEYS.CONFIG, aux.config);
      setConfig(aux.config);
      set(KEYS.MESSAGES, aux.messages);
      setActive('chat');
    }
  }
  const clrChat = () => {
    setConfig(KEYS.DEFAULT_CONFIG)
    set(KEYS.CONFIG, KEYS.DEFAULT_CONFIG);
    localStorage.removeItem(KEYS.MESSAGES);
    setActive('chat');
  }
  const titleChat = () => {}
  const deleteChat = (id) => {
    setBackup(ant => {
      const aux = [...ant];
      const i = aux.findIndex(e => e.id == id);
      if (i >= 0) {
        aux.splice(i, i); 
      }
      console.log(aux)
      return aux;
    });
    bottomToast();
  }

  const getModelCards = () => {
    return (
      <Card title='Modelos' icon='model_training'
        rightTitle={config.models.length + (config.models.length > 1 ? ' modelos disponíveis' : ' modelo disponível')}>
        <nav className="flex items-center gap-2 overflow-x-auto hide-scrollbar mask-gradient relative">
          <div className="flex items-center gap-6 whitespace-nowrap mb-4">
            { config.models.map((model, i) => 
              <ConfigModel 
                key={`config-model-${i}`}
                model={model}
                current={config.current}
                setCurrent={() => setCurrent(model)} />) }
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
            min={1} max={10} value={config.quantity} onChange={(e) => setQuantity(e)} />
          <Input title='Quantidade de Relações' icon='grain' type='number' id='influence' 
            description='Quantidade de perguntas anteriores que influenciam no contexto atual.'
            min={0} max={10} value={config.influence} onChange={(e) => setInfluence(e)} />
          <Input title='Score Mínimo' icon='readiness_score' type='range' id='score' 
            description='Define o nível mínimo de relevância para que um fragmento de contexto seja utilizado na resposta.'
            min={1} max={100} value={config.score} onChange={(e) => setScore(e)}
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
            description='Habilita o processo de raciocínio detalhado da IA. Tem um processamento mais demorado.' value={config.thinking} onChange={(e) => setThinking(e)} />
          <Input title='Lembranças' icon='book' type='number' id='memory' 
            description='Quantidade de perguntas e respostas que enviadas como complemento.'
            min={0} max={10} value={config.memory} onChange={(e) => setMemory(e)} />
          <Input title='Temperatura' icon='device_thermostat' type='range' id='temperature' 
            description='Define a aleatoriedade das respostas. Valores baixos são mais determinísticos e os altos mais inventivos.'
            min={0} max={2} step={0.1} value={config.temperature} onChange={(e) => setTemperature(e)}
            minDesc='Preciso (0.0)' maxDesc='Criativo (2.0)' />
        </div>
      </Card>
    );
  }

  const getTheme = () => {
    return (
      <Card title='Aparência Visual' icon='palette'>
        <p className="text-xs text-gray-450 dark:text-gray-400 leading-relaxed font-sans">
          Alterne o visual de layout completo de acordo com o conforto de iluminação de seu monitor.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setTheme('light')}
            className={`p-3 border rounded-xl flex flex-col items-center justify-center transition space-y-1.5 cursor-pointer ${
              theme === 'light'
                ? 'border-blue-500 bg-blue-50/50 dark:bg-zinc-900 text-blue-600 font-semibold'
                : 'border-gray-200 dark:border-zinc-800 text-gray-550 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-850'
            }`}>
            <span className="material-symbols-rounded select-none text-[22px]">light_mode</span>
            <span className="text-xs">Tema Claro</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-3 border rounded-xl flex flex-col items-center justify-center transition space-y-1.5 cursor-pointer ${
              theme === 'dark'
                ? 'border-blue-500 bg-zinc-800 text-blue-400 font-semibold'
                : 'border-gray-200 dark:border-zinc-800 text-gray-550 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-855'
            }`}>
            <span className="material-symbols-rounded select-none text-[22px]">dark_mode</span>
            <span className="text-xs">Tema Escuro</span>
          </button>
        </div>
      </Card>
    );
  }

  const getHistBtn = (color, onclick, title, icon, desc) => {
    return (
      <button className={`flex items-center justify-center gap-0.5 rounded-lg py-0.5 pl-2 pr-3 sm:pl-6 sm:pr-7 hover:scale-105 whitespace-nowrap text-white shadow-md bg-${color}/60 hover:bg-${color}`} onClick={onclick} title={title}>
        <span className="material-symbols-outlined" style={{fontSize: 20}}>{icon}</span>{desc}
      </button>
    );
  }

  const getHistItem = (chat, i) => {
    return (
      <div key={`chat-${i}`} className={`p-4 rounded-xl ${chat.id == chatId ? 'bg-blue-50 border border-blue-100' : 'hover:bg-blue-300 transition-colors'}`}>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <p className="flex items-center text-sm text-gray-500 cursor-pointer truncate" onClick={() => selChat(chat.id)}>
            <span className={`material-symbols-outlined text-${chat.id == chatId ? 'blue-500' : 'gray-500'} mr-1 sm:mr-2`}>chat_bubble</span>
            {`${chat.id}: ${chat.title || chat.messages.at(-1).content}`}
          </p>
          <span className="material-symbols-outlined text-green-400 cursor-pointer" onClick={() => titleChat(chat.id)} title="cria um título">label</span>
          <span className="material-symbols-outlined text-red-400 cursor-pointer" onClick={() => deleteChat(chat.id)} title="excluir a conversa">delete</span>
        </div>
        <p className="text-[12px] italic">{(new Date(chat.updated_at)).toLocaleString()}</p>
      </div>
    );
  }

  const getHistory = () => {
    return (
      <Card title='Conversas' icon='chat'>
        <div className="bg-red-500 bg-green-600 bg-blue-600 hover:bg-red-500 hover:bg-green-600 hover:bg-blue-600" />
        <div className="flex items-center justify-end space-x-2 sm:space-x-4">
          {getHistBtn('red-500', clrChat, 'Limpar conversa atual', 'mop', 'Limpar')}
          {getHistBtn('green-600', savChat, 'Salvar conversa atual', 'keep', 'Salvar')}
          {getHistBtn('blue-600', newChat, 'Salvar a atual e criar uma nova conversa', 'add', 'Novo Chat')}
        </div>
        <div className="flex-grow overflow-y-auto px-2 space-y-xs">
          <div className="px-4 py-2">
            <h3 className="text-sm text-gray-500 uppercase tracking-wider">Histórico</h3>
          </div>
          <div className="history">
            { backup.map((chat, i) => {return getHistItem(chat, i)}) }
          </div>
        </div>
      </Card>
    );
  }

  return (
    <section className="overflow-y-auto p-6 max-w-[1376px] mx-auto w-full h-full space-y-4">
      {getModelCards()}
      <div className={`grid grid-cols-1 ${desktop ? 'md' : 'lg'}:grid-cols-12 gap-4`}>
        <div className={`${desktop ? 'md' : 'lg'}:col-span-6`}>
          {getContext()}
        </div>
        <div className={`${desktop ? 'md' : 'lg'}:col-span-6`}>
          {getThinking()}
        </div>
        {/* <div className={`col-span-4 ${desktop ? 'md' : 'lg'}:col-span-4`}>
          {getTheme()}
        </div> */}
        <div className={`${desktop ? 'md' : 'lg'}:col-span-12`}>
          {getHistory()}
        </div>
      </div>
    </section>
  );
}

export default Config;