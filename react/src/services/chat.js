import { KEYS, cl, ce, qs, sleep, get, showToast } from './util';

var BUFFER;

// trata stream do chat e contagem de tokens
const getContent = (id, str, setMessages) => {
  if (!str) return;

  const con = qs(`#${id} .assistant-content`);
  const json = JSON.parse(str);
  if (json.done) {
    setMessages(prev => {
      const items = [...prev];
      const i = items.length - 1;
      if (i >= 0) {
        items[i] = {
          ...items[i],
          content: BUFFER,
          up_tokens: items[i].up_tokens + json.prompt_eval_count,
          dw_tokens: items[i].dw_tokens + json.eval_count, 
          times: {
            ...items[i].times,
            finish_at: Date.now()
          }
        }
      }
      return items;
    });
  } else {
    BUFFER += json.message.content;
    con.innerHTML = BUFFER;
  }
}

// consome serviço de chat
const callChatApi = async (msgs, file, score, temperature, quantity, memory, 
  influence, contexts, prompt, context_at, setMessages) => {
  const cur_mod = get(KEYS.CONFIG).current;
  const think_at = Date.now();
  const thinking = get(KEYS.CONFIG).thinking && 
    get(KEYS.CONFIG).models.find(m => m.model == cur_mod).capabilities.includes('thinking');
  try {
    const response = await fetch(KEYS.API_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: cur_mod,
        think: thinking,
        messages: msgs,
        options: {
          temperature: temperature
        }
      })
    });

    const reader = response.body?.getReader();
    if (!reader) return;

    // adiciona o conteúdo do assistente
    const id = 'ass-' + Date.now().toString();
    setMessages(prev => [
      ...prev, {
      id: id,
      role: 'assistant',
      content: '',
      model: cur_mod,
      up_tokens: 0,
      dw_tokens: 0,
      file: file,
      score: score,
      temperature: temperature,
      thinking: thinking,
      quantity: quantity,
      memory: memory, 
      influence: influence, 
      contexts: contexts,
      prompt: prompt, 
      times: {
        created_at: Date.now(),
        context_at: context_at,
        think_at: think_at,
      },
    }]);
    await sleep(10);
    
    BUFFER = '';
    const td = new TextDecoder('utf-8');
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const strs = td.decode(value).split('\n');
      strs.forEach(str => getContent(id, str, setMessages));
    }
  } catch (error) {
    ce(error);
  }
}

// pega contexto embedding da pergunta
const getContext = async (prompt, category, score, quantity) => {
  try {
    const response = await fetch(KEYS.CONTEXT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: prompt,
        score: score,
        cate: category,
        k: quantity
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch(error) {
    ce(error);
  }
}

const sendQuery = async (arg, messages, setMessages, setLoading) => {
  // questão do usuário
  const textarea = qs(arg);
  const prompt = textarea.value;
  
  const context_at = Date.now();
  const category = get(KEYS.CONFIG).category;
  const score = (180 - get(KEYS.CONFIG).score) / 100;;
  const temperature = get(KEYS.CONFIG).temperature;
  const quantity = get(KEYS.CONFIG).quantity;
  const memory = get(KEYS.CONFIG).memory;
  const influence = get(KEYS.CONFIG).influence;
  
  textarea.readOnly = true;
  textarea.value = '';
  setLoading(true);
  showToast('Envio:', 'Mensagem sendo enviada...', 5);

  const msgs = messages
    .slice(0)
    .concat(messages.slice(1).slice(-memory))
    .map(m => {
      return {
        role: m.role, content: m.content.substring(0, 300)
      }
    });

  // adiciona o conteúdo da questão do usuário
  setMessages(prev => [
    ...prev, {
      id: 'usr-' + Date.now().toString(),
      role: 'user',
      content: prompt,
      times: { created_at: Date.now() },
    }
  ]);

  // define o contexto da questão
  const aux = messages
    .filter(m => m.role == 'assistant' && m.contexts.length > 0)
    .slice(-influence)
    .map(m => { return m.prompt }).join('\n') + '\n' + prompt;
  
  const contexts = await getContext(aux, category, score, quantity);
  msgs.push({ role: 'user', content: `
    Pergunta: ${prompt}

    Contexto: ${'\n' + contexts.map(c => { return '      - "' + c.content + '";'; }).join('\n')}
  `});

  // chamada da api do assistente
  await callChatApi(msgs, category, score, temperature, quantity, memory, 
    influence, contexts, prompt, context_at, setMessages);
  
  textarea.readOnly = false;
  setLoading(false);
}

export {
  sendQuery
}
