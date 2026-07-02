import { KEYS, cl, ce, qs, sleep, showToast } from './util';

var buffer;

// trata stream do chat e contagem de tokens
const getContent = (id, str, setMessages) => {
  if (!str) return;

  const con = qs(`#${id} .assistant-content`);
  const json = JSON.parse(str);
  if (json.done) {
    setMessages(
      prev => prev.map(item => item.id === id ? {
        ...item,
        content: buffer,
        up_tokens: item.up_tokens + json.prompt_eval_count,
        dw_tokens: item.dw_tokens + json.eval_count,
      } : item)
    );
  } else {
    buffer += json.message.content;
    con.innerHTML = buffer;
  }
}

// consome serviço de chat
const callChatApi = async (msgs, file, score, temperature, quantity, memory, 
  influence, contexts, prompt, context_at, setMessages) => {
  const cur_mod = 'gemma3:1b';// get(KEYS.C_MODEL);
  const think_at = Date.now();
  const thinking = false;// get(KEYS.THINKING) && MODELS.find(m => m.model == cur_mod).capabilities.includes('thinking');
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
    let id = 'ass-' + Date.now().toString();
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
    
    buffer = '';
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
const getContext = async (prompt, categories, score, quantity) => {
  try {
    const response = await fetch(KEYS.CONTEXT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: prompt,
        score: score,
        cate: categories,
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
  const categories = 'Todos';// CATEGORIES[qs('.categories').value];
  const score = 1.05;// (180 - Number(get(KEYS.SCORE))) / 100;
  const temperature = 0.5;// Number(get(KEYS.TEMPERATURE));
  const quantity = 8;// Number(get(KEYS.QUANTITY));
  const memory = 4;// Number(get(KEYS.MEMORY));
  const influence = 2;// Number(get(KEYS.INFLUENCE));
  
  textarea.readOnly = true;
  textarea.value = '';
  setLoading(true);
  showToast('Envio:', 'Mensagem sendo enviada...', 5);

  let msgs = messages;
  msgs = msgs
    .slice(0)
    .concat(msgs.slice(1).slice(-memory))
    .map((m) => {
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
  
  const contexts = await getContext(aux, categories, score, quantity);
  msgs.push({ role: 'user', content: `
    Pergunta: ${prompt}

    Contexto: ${'\n' + contexts.map(c => { return '      - "' + c.content + '";'; }).join('\n')}
  `});

  // chamada da api do assistente
  await callChatApi(msgs, categories, score, temperature, quantity, memory, 
    influence, contexts, prompt, context_at, setMessages);
  
  textarea.readOnly = false;
  setLoading(false);
}

export {
  sendQuery
}
