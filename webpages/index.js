/**
 * Funções básicas
 */
const cl = arg => console.log(arg);
const ce = error => { console.error(error); alert(error); }
const qs = arg => document.querySelector(arg);
const qsa = arg => document.querySelectorAll(arg);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const handle_enter = ev => {
  if (ev.key === 'Enter' && !ev.shiftKey) {
    ev.preventDefault();
    ev.target.form.requestSubmit();
  }
}

const get = (key, defaultValue) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const set = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

class Storage {
  constructor(key, init = {}) {
    this.key = key;
    this.init = init;
  }

  get() {
    return get(this.key, this.init);
  }

  set(e) {
    set(this.key, e);
  }

  clr() {
    set(this.key, this.init);
  }
}

class StorageArray {
  constructor(key, init = []) {
    this.key = key;
    this.init = init;
  }

  lst() {
    return get(this.key, this.init);
  }

  add(e, meta = true) {
    let es = this.lst();
    if (meta) {
      e = {
        id: Math.random().toString(36).substring(2),
        created_at: (new Date()).toLocaleString(),
        ...e,
      };
    }
    es.push(e);
    set(this.key, es);
    return e;
  }

  get(id) {
    return this.lst().find(e => e.id === id);
  }

  upd(id, e) {
    let es = this.lst();
    let i = es.findIndex(e => e.id === id);
    if (i !== -1) {
      es[i] = {...es[i], ...e};
      set(this.key, es);
    }
    return this.lst()[i];
  }

  clr() {
    set(this.key, this.init);
  }
}



/**
 * Funções acopladas ao html
 */

const select_model = (cur_mod) => {
  set(KEYS.CURRENT_MODEL, cur_mod);

  let cm = MODELS.find(e => e.model == cur_mod);
  let html = `
    <h4 class="font-semibold mb-2 text-[12px] text-gray-800 uppercase">${cm.name}</h4>
    <div class="text-[10px]">
      <p class="p-1">
        <span class="text-gray-500">family:</span><br>
        <span class="text-gray-900">${cm.details.family}</span>
      </p>
      <p class="p-1">
        <span class="text-gray-500">modified_at:</span><br>
        <span class="text-gray-900">${cm.modified_at}</span>
      </p>
      <p class="p-1">
        <span class="text-gray-500">size:</span><br>
        <span class="text-green-600">${(cm.size / 1024 ** 2).toFixed(2)}MB</span>
      </p>
      <p class="p-1">
        <span class="text-gray-500">parameter_size:</span><br>
        <span class="text-green-600">${cm.details.parameter_size}</span>
      </p>
      <p class="p-1">
        <span class="text-gray-500">quantization_level:</span><br>
        <span class="text-gray-900">${cm.details.quantization_level}</span>
      </p>
      <p class="p-1">
        <span class="text-gray-500">digest:</span><br>
        <span class="text-gray-600">${cm.digest}</span>
      </p>
      <p class="p-1">
        <span class="text-gray-500">format:</span><br>
        <span class="text-gray-600">${cm.details.format}</span>
      </p>
      <p class="p-1">
        <span class="text-gray-500">parent_model:</span><br>
        <span class="text-gray-600">${cm.details.parent_model}</span>
      </p>
    </div>
  `;
  qs('.model_tooltip').innerHTML = html;
  qs('.model').innerHTML = `${cm.name}`;
  
  html = '';
  for (let model of MODELS) {
    let aux;
    if (model.model == cur_mod) aux = 'text-primary border-b-2 border-primary pb-1';
    else aux = 'text-on-surface-variant hover:text-on-surface transition-opacity';

    html += `
      <a class="${aux} shrink-0" 
        href="javascript: select_model('${model.model}')">
        ${model.name}
      </a>`;
  }
  qs('.models').innerHTML = html;
  qs('[name=textarea_prompt]').focus();
}

const insert_user_message = (msg) => {
  let html = `
    <!-- User Message -->
    <div class="flex flex-col items-end group" id="msg_usr_${msg.id}">
      <div class="max-w-[80%] flex items-start gap-4 flex-row-reverse">
        <div
          class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-primary text-xs"
            style="font-variation-settings: 'FILL' 1;">person</span>
        </div>
        <div class="relative">
          <div class="border-l-4 border-primary pl-4 py-1">
            <p class="text-on-surface leading-relaxed text-sm font-medium">${msg.prompt}</p>
          </div>
          <span
            class="text-[10px] text-on-surface-variant mt-2 block opacity-0 group-hover:opacity-100 transition-opacity font-bold">
            ${msg.created_at}
          </span>
        </div>
      </div>
    </div>
  `;
  qs('.messages').innerHTML += html;
}

const insert_ia_message = (msg) => {
  let html = `
    <!-- AI Message -->
    <div class="flex flex-col items-start group" id="msg_ia_${msg.id}">
      <div class="max-w-[85%] flex items-start gap-4">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-1 shadow-md shadow-primary/10">
          <span class="material-symbols-outlined text-white text-xs"
            style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
        </div>
        <div class="bg-white rounded-lg rounded-tl-none p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-outline-variant/50">
          <div class="prose prose-sm max-w-none">
            <p class="text-on-surface content">${msg.content}</p>
          </div>
          <div class="flex items-center gap-3">
            <button class="p-1.5 hover:bg-surface-container rounded-md transition-colors text-outline hover:text-on-background">
              <span class="material-symbols-outlined text-[24px] like" style="font-variation-settings: 'FILL' ${msg.like == 1 ? 1 : 0};" onclick="messages_like(this, '${msg.id}', 1);">thumb_up</span>
            </button>
            <button class="p-1.5 hover:bg-surface-container rounded-md transition-colors text-outline hover:text-on-background">
              <span class="material-symbols-outlined text-[24px] like" style="font-variation-settings: 'FILL' ${msg.like == -1 ? 1 : 0};" onclick="messages_like(this, '${msg.id}', -1);">thumb_down</span>
            </button>
            <button class="p-1.5 hover:bg-surface-container rounded-md transition-colors text-outline hover:text-on-background"
              onclick="copy_text('${msg.id}')">
              <span class="material-symbols-outlined text-[24px]">content_copy</span>
            </button>
            <p class="text-[10px] text-on-surface-variant/80 mb-2">${msg.created_at}</p>
          </div>
        </div>
      </div>
      <span class="ml-12 text-[10px] text-on-surface-variant mt-2 block opacity-0 group-hover:opacity-100 transition-opacity font-bold tokens">
        tokens enviados: ${msg.up_tokens} | tokens recebidos: ${msg.dw_tokens}
      </span>
    </div>
  `;

  qs('.messages').innerHTML += html;
  qs(`#msg_ia_${msg.id} p`).scrollIntoView({
    behavior: 'smooth',
  });
}

const ia_thinking_state = (cur_mod) => {
  let html = `
    <div class="flex items-start gap-4 ia_thinking_state">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-1 opacity-50">
        <span class="material-symbols-outlined text-white text-xs"
          style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
      </div>
      <div class="bg-primary-container text-on-primary-container rounded-full px-4 py-2 flex items-center gap-2.5 animate-pulse shadow-sm border border-primary/10">
        <div class="flex gap-1">
          <div class="w-1.5 h-1.5 bg-primary rounded-full"></div>
          <div class="w-1.5 h-1.5 bg-primary rounded-full opacity-60"></div>
          <div class="w-1.5 h-1.5 bg-primary rounded-full opacity-30"></div>
        </div>
        <span class="text-xs font-bold"><label class="uppercase">${cur_mod}</label> is thinking...</span>
      </div>
    </div>
  `;
  qs('.messages').innerHTML += html;
  qs('.ia_thinking_state').scrollIntoView({
    behavior: 'smooth',
  });
}

const messages_clear = () => {
  MESSAGES.clr();
  qs('.messages').innerHTML = '';
  set(KEYS.TOKENS, { up_tokens: 0, dw_tokens: 0 });
  qs('.up_tokens').innerHTML = '0 TOKENS ENVIADO';
  qs('.dw_tokens').innerHTML = '0 TOKENS RECEBIDOS';
}

const messages_like = (element, id, value) => {
  let msg = MESSAGES.get(id);
  if (value == msg.like) value = 0;
  MESSAGES.upd(id, { ...msg, like: value });

  qsa(`#msg_ia_${id} .like`).forEach(e => {
    e.style.fontVariationSettings = "'FILL' 0";
  });
  element.style.fontVariationSettings = `'FILL' ${value == 0 ? 0 : 1}`;
}

const show_toast = (title, text) => {
  qs('#toast span').innerHTML = title;
  qs('#toast p').innerHTML = text;

  const toast = qs('#toast');
  toast.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
  toast.classList.add('opacity-80', 'translate-y-0');
  setTimeout(() => {
    toast.classList.remove('opacity-80', 'translate-y-0');
    toast.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
  }, 3000);
}

const copy_text = (id) => {
  let text = qs(`#msg_ia_${id} p.content`).innerHTML;

  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    if (text.length > 50) text = `${text.substring(0, 47).trim()}...`
    show_toast('Copiado:', `Texto "${text}" copiado!`);
  } catch (err) {
    ce(error);
  }
  document.body.removeChild(textArea);
};



/**
 * Funções de acesso a APIs
 */

const set_assitent_messages = (id) => {
  let e = qs(`#msg_ia_${id} p.content`);
  MESSAGES.upd(id, { role: 'assistant', content: e.innerHTML });

  qs('.ia_thinking_state').remove();
  qs('[name=textarea_prompt]').readOnly = false;
  qs('[name=textarea_prompt]').focus();
  
  e.scrollIntoView({
    behavior: 'smooth',
  });
}

const get_content = (id, value) => {
  try {
    let rjson = new TextDecoder().decode(value);
    let json = JSON.parse(rjson);
    if (json.done) {
      let msg = MESSAGES.get(id);
      MESSAGES.upd(id, { 
        ...msg, 
        up_tokens: json.prompt_eval_count,
        dw_tokens: json.eval_count, 
      });
      qs(`#msg_ia_${id} span.tokens`).innerHTML = `tokens enviados: ${json.prompt_eval_count} | tokens recebidos: ${json.eval_count}`;

      let tk = get(KEYS.TOKENS, { up_tokens: 0, dw_tokens: 0 });
      set(KEYS.TOKENS, {
        ...tk,
        up_tokens: tk.up_tokens + json.prompt_eval_count,
        dw_tokens: tk.dw_tokens + json.eval_count,
      });
      qs('.up_tokens').innerHTML = `${tk.up_tokens + json.prompt_eval_count} TOKENS ENVIADO`;
      qs('.dw_tokens').innerHTML = `${tk.dw_tokens + json.eval_count} TOKENS RECEBIDOS`;
    } else {
      let content = json.message.content;
      qs(`#msg_ia_${id} p.content`).innerHTML += content;
    }
  } catch (error) {
    ce(error);
  }
}

const call_chat_api = async (cur_mod, msgs) => {
  let msg;

  try {
    const response = await fetch(KEYS.CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: cur_mod,
        messages: msgs,
      })
    });
    
    const reader = response.body?.getReader();
    if (!reader) return;

    msg = MESSAGES.add({ role: 'assistant', content: '', up_tokens: 0, dw_tokens: 0 });
    insert_ia_message(msg);
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      get_content(msg.id, value);
    }
  } catch (error) {
    ce(error);
  } finally {
    set_assitent_messages(msg.id);
  }
}

const get_context = async (prompt) => {
  try {
    const response = await fetch(KEYS.CONTEXT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: prompt
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

const send_query = async () => {
  // armazena a questão do usuário
  let e = qs('[name=textarea_prompt]');
  if (e.value.length == 0) return;

  show_toast('Envio:', 'Mensagem sendo enviada...');
  e.readOnly = true;

  // cria lista inicial de mensagens
  let msgs = MESSAGES.lst().map((e) => {
    return {
      role: e.role, content: e.role == 'user' ? e.prompt : e.content
    }
  });

  // define o contexto da questão
  let context = await get_context(e.value);
  let content = `
    Pergunta: ${e.value}
    
    Contexto: ${context}
  `;

  // adiciona o conteúdo da questão do usuário
  msgs.push({ role: 'user', content: content })
  let msg = MESSAGES.add({ role: 'user', prompt: e.value, content: content });
  insert_user_message(msg);
  e.value = '';

  // ícone de espera do assistente
  let cur_mod = get(KEYS.CURRENT_MODEL);
  ia_thinking_state(cur_mod);

  // chamada da api do assistente
  call_chat_api(cur_mod, msgs);
}



const KEYS = {
  MODELS: 'models',
  CURRENT_MODEL: 'current_model',
  MESSAGES: 'messages',
  TOKENS: 'tokens',
  CHAT_API_URL: `http://${window.location.hostname}:11434/api/chat`,
  CONTEXT_URL: `http://${window.location.hostname}:8000/context`,
  API_TAGS_URL: `http://${window.location.hostname}:11434/api/tags`,
  API_PS_URL: `http://${window.location.hostname}:11434/api/ps`,
  DEFAULT_MESSAGE: {
    role: 'system',
    content: 'Responda a pergunta com base somente no contexto. E você é um especialista no assunto deste contexto. A resposta deve ser sempre em português de forma clara e objetiva, e sem formatação. A resposta deve ser em um único parágrafo bem elaborado e completo, a menos que esteja explícito outro formato na pergunta.'
  },
}

var MESSAGES = new StorageArray(KEYS.MESSAGES, [KEYS.DEFAULT_MESSAGE]);
var MODELS = [];

document.addEventListener('DOMContentLoaded', () => {
  qs('#form_chat_api').addEventListener('submit', function(e) {
    e.preventDefault();
    send_query();
    return;
  });

  for (let msg of MESSAGES.lst()) {
    if (msg.role == 'user') {
      insert_user_message(msg);
    } else if (msg.role == 'assistant') {
      insert_ia_message(msg);
    }
  }

  fetch(KEYS.API_TAGS_URL)
  .then(response => { return response.json(); })
  .then(json => { 
    MODELS = json.models.filter(m => !m.model.includes('embedding')).sort(
      (a, b) => a.name.localeCompare(b.name)
    );
    let cur_mod = get(
      KEYS.CURRENT_MODEL, 
      MODELS.filter(m => m.model.includes('gemma3:1b'))[0]?.model || MODELS[0]?.model);
    select_model(cur_mod);

    qs(`#msg_ia_${MESSAGES.lst().findLast(e => e.role == 'assistant')?.id}`)?.scrollIntoView({
      behavior: 'smooth',
    });
    
    let tk = get(KEYS.TOKENS, { up_tokens: 0, dw_tokens: 0 });
    qs('.up_tokens').innerHTML = `${tk.up_tokens} TOKENS ENVIADO`;
    qs('.dw_tokens').innerHTML = `${tk.dw_tokens} TOKENS RECEBIDOS`;
  })
  .catch(error => ce(error));
});
