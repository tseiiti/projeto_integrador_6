
/******************************************************************************
 * Funções básicas
 ******************************************************************************/
const ONLOG = false;
const ONALERT = false;
const cl = arg => { if (ONLOG) console.log(arg); };
const ce = error => { console.error(error); if (ONALERT) alert(error); }
const qs = arg => document.querySelector(arg);
const qsa = arg => document.querySelectorAll(arg);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));



// funções de armazenamento
const get = (key, defaultValue) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const set = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

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
      let times = e.times;
      e = {
        ...e,
        id: Math.random().toString(36).substring(2),
        times: {
          ...times,
          created_at: (new Date()).toLocaleString(),
        }
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



// copia texto para área de transferência
const copy_text = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    if (text.length > 50) text = `${text.substring(0, 47).trim()}...`
    show_toast('Copiado:', `Texto "${text}" copiado!`);
  } catch (error) {
    ce(error);
  }
};

const paste_text = async (e) => {
  try {
    let text = await navigator.clipboard.readText();
    e.value = text;
    if (text.length > 50) text = `${text.substring(0, 47).trim()}...`
    show_toast('Colado:', `Texto "${text}" colado!`);
    e.focus();
  } catch (error) {
    ce(error);
  }
};

// mostra alerta (toast)
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

const markdown_to_html = (text) => {
  // trata latex
  text = text.replace(/\$+(.*?)\$+/g,  (match, value) => {
    let html = value
      .replace(/\\frac\{(.*?)\}\{(.*?)\}/g, '($1)/($2)')
      .replace(/\\text\{(.*?)\}/g, '$1')
      .replace(/\\times/g, '*')
      .replace(/\s\\%/g, '%');
    return '<i>' + html + '</i>';
  });

  const converter = new showdown.Converter({optionKey: 'value'});
  return converter.makeHtml(text);
}

const base_load = async () => {
  let html = `
    <!-- Alert Container -->
    <div id="toast" class="fixed top-24 px-4 py-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2
            gap-2 rounded-lg bg-green-100 px-4 py-3 text-green-800 shadow-lg border border-green-300 transition-all duration-300
            transition-all duration-300 ease-in-out
            opacity-0 -translate-y-4 pointer-events-none">
        <span class="font-semibold">Successo</span>
        <p>Action completed successfully.</p>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", html);
}



/******************************************************************************
 * Variáveis globais
 ******************************************************************************/
const BASE = ['192.168.', 'localhos'].includes(window.location.hostname.substring(0, 8)) ?
  `${window.location.protocol}//${window.location.hostname}` :
  'https://tseiiti.duckdns.org';

const KEYS = {
  CURRENT_MODEL:  'current_model',
  SCORE:          'score',
  TEMPERATURE:    'temperature',
  QUANTITY:       'quantity',
  THINKING:       'thinking',
  MESSAGES:       'messages',
  TOKENS:         'tokens',
  API_CHAT_URL:   `${BASE}:11434/api/chat`,
  API_TAGS_URL:   `${BASE}:11434/api/tags`,
  API_PS_URL:     `${BASE}:11434/api/ps`,
  API_GEN_URL:    `${BASE}:11434/api/generate`,
  CONTEXT_URL:    `${BASE}:8000/context`,
  CATEGORIES_URL: `${BASE}:8000/categories`,
  DEFAULT_MESSAGE: {
    role: 'system',
    content: 'O usuário deve enviar o contexto, caso o contexto não seja informado, não responda. Diga que a pergunta deve ser sobre o Sistema EGA Soluções Industriais. Responda a pergunta com base no contexto e no histórico de mensagens. Ainda, caso o contexto não seja encontrado, informe que é possível reduzir o score, mas acarreta na degradação da precisão do contexto. E você é um especialista no assunto deste contexto. A resposta deve ser SEMPRE EM PORTUGUÊS, conciso, coeso e coerênte, mas bem elaborado e completo, em poucos parágrafos fluidos. Sem qualquer formatação, a menos que esteja explícito outro formato na pergunta.'
  },
}

var MESSAGES   = new StorageArray(KEYS.MESSAGES, [KEYS.DEFAULT_MESSAGE]);
var MODELS     = [];
var CATEGORIES = [];
var PS         = [];
var BUFFER     = '';



/******************************************************************************
 * Processo principal
 ******************************************************************************/

document.addEventListener('DOMContentLoaded', () => {
  base_load();
});
