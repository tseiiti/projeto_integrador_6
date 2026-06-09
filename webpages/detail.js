
/******************************************************************************
 * Funções básicas
 ******************************************************************************/
const ONLOG = true;
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

// // mostra alerta (toast)
// const show_toast = (title, text, time = 3000) => {
//   qs('#toast span').innerHTML = title;
//   qs('#toast p').innerHTML = text;

//   const toast = qs('#toast');
//   toast.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
//   toast.classList.add('opacity-80', 'translate-y-0');
//   setTimeout(() => {
//     toast.classList.remove('opacity-80', 'translate-y-0');
//     toast.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
//   }, time);
// }

  
const x = (id) => {
  let msg = MESSAGES.get(id);
  
  qs('h3').innerHTML = `ID: ${id}`;
  qs('.model').innerHTML = `modelo: ${msg.model}`;
  qs('.content').innerHTML = msg.content;

  let html = '';
  msg.contexts.forEach(ct => {
    html += `
      <tr>
        <th scope="row" class="border-b border-gray-100 p-4 text-gray-500">
          ${ct.score.toFixed(5)}
        </th>
        <td class="border-b border-gray-100 p-4 text-gray-500">
          ${Math.round(-ct.score * 100) + 180}
        </td>
        <td class="border-b border-gray-100 p-4 text-gray-500">
          ${ct.content}
        </td>
      </tr>`;
  });
  qs('.contexts tbody').innerHTML = html;
  
  html = `
    <tr>
      <td class="border-b border-gray-100 p-4 text-gray-500">
        ${msg.up_tokens}
      </td>
      <td class="border-b border-gray-100 p-4 text-gray-500">
        ${msg.dw_tokens}
      </td>
    </tr>`;
  qs('.tokens tbody').innerHTML = html;
  
  html = `
    <tr>
      <td class="border-b border-gray-100 p-4 text-gray-500">
        ${msg.times.context_at}
      </td>
      <td class="border-b border-gray-100 p-4 text-gray-500">
        ~${((new Date(msg.times.think_at)) - (new Date(msg.times.context_at))) / 1000} segundos
      </td>
      <td class="border-b border-gray-100 p-4 text-gray-500">
        ~${((new Date(msg.times.created_at)) - (new Date(msg.times.think_at))) / 1000} segundos
      </td>
      <td class="border-b border-gray-100 p-4 text-gray-500">
        ~${((new Date(msg.times.finish_at)) - (new Date(msg.times.created_at))) / 1000} segundos
      </td>
      <td class="border-b border-gray-100 p-4 text-gray-500">
        ${msg.times.finish_at}
      </td>
      <td class="border-b border-gray-100 p-4 text-gray-500">
        ~${((new Date(msg.times.finish_at)) - (new Date(msg.times.context_at))) / 1000} segundos
      </td>
    </tr>`;
  qs('.times tbody').innerHTML = html;

  qs('.prompt').innerHTML = msg.prompt;
  qs('.file').innerHTML = msg.file;
  qs('.score').innerHTML = Math.round(-msg.score * 100) + 180;
  qs('.temperature').innerHTML = msg.temperature;
}

/******************************************************************************
 * Variáveis globais
 ******************************************************************************/
// const BASE = ['192.168.', 'localhos'].includes(window.location.hostname.substring(0, 8)) ?
//   `${window.location.protocol}//${window.location.hostname}` :
//   'https://tseiiti.duckdns.org';

const KEYS = {
  MESSAGES:      'messages',
  // CATEGORIES_URL: `${BASE}:8000/categories`,
}
  
var MESSAGES   = new StorageArray(KEYS.MESSAGES, [KEYS.DEFAULT_MESSAGE]);
// var CATEGORIES = [];

/******************************************************************************
 * Processo principal
 ******************************************************************************/

document.addEventListener('DOMContentLoaded', () => {
  // // carrega categorias
  // fetch(KEYS.CATEGORIES_URL)
  // .then(response => { return response.json(); })
  // .then(json => {
  //   CATEGORIES = ['Todos'].concat(json); 
  // })
  // .catch(error => ce(error));

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  x(id)
});
