
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


// mostra alerta (toast)
const show_toast = (title, text, time = 3000) => {
  qs('#toast span').innerHTML = title;
  qs('#toast p').innerHTML = text;

  const toast = qs('#toast');
  toast.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
  toast.classList.add('opacity-80', 'translate-y-0');
  setTimeout(() => {
    toast.classList.remove('opacity-80', 'translate-y-0');
    toast.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
  }, time);
}

const toggle_status = async (model) => {
  let url;
  let payload;
  let ativo = PS.map(m => { return m.model; }).includes(model);

  if (ativo) {
    url = KEYS.API_GEN_URL;
    payload = { "model": model, "keep_alive": 0 };
    show_toast('Status:', `Desativando o modelo ${model}`);
  } else {
    url = KEYS.API_CHAT_URL;
    payload = { "model": model, "prompt": "" };  
    show_toast('Status:', `Ativando o modelo ${model}`, 5000);
  }


  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (!response.ok) throw new Error('Failed to post data');
    return response.json();
  })
  .then(data => setTimeout(() => { window.location.href = '/config.html'; }, 1000))
  .catch(error => ce(error));
}

const get_table_body = async () => {
  // carrega lista de modelos
  await fetch(KEYS.API_TAGS_URL)
  .then(response => { return response.json(); })
  .then(json => {
    MODELS = json.models.sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  })
  .catch(error => ce(error));
  
  await fetch(KEYS.API_PS_URL)
  .then(response => { return response.json(); })
  .then(json => {
    PS = json.models.sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  })
  .catch(error => ce(error));

  let html = '';
  for (let model of MODELS) {
    let ativo = PS.map(m => { return m.model; }).includes(model.model);
    html += `
      <tr>
        <th scope="row" class="border-b border-gray-100 p-4 text-gray-500 dark:border-gray-700 dark:text-gray-400">
          ${model.model}
        </th>
        <td class="border-b border-gray-100 p-4 text-gray-500 dark:border-gray-700 dark:text-gray-400">
        ${(model.size / 1024 ** 2).toFixed(2) + 'MB'}
        </td>
        <td class="border-b border-gray-100 p-4 text-gray-500 dark:border-gray-700 dark:text-gray-400">
        ${model.details.parameter_size}
        </td>
        <td class="border-b border-gray-100 p-4 dark:border-gray-700 ${ ativo ? 'text-lime-500' : 'text-red-400' }">
          <span class="material-symbols-outlined cursor-pointer" title="clique para ${ ativo ? 'desativar' : 'ativar'}"
          onclick="toggle_status('${model.model}')">
            ${ ativo ? 'toggle_on' : 'toggle_off'}
          </span>
        </td>
      </tr>`;
  }
  qs('.models').innerHTML = html;
}

/******************************************************************************
 * Variáveis globais
 ******************************************************************************/
const BASE = ['192.168.', 'localhos'].includes(window.location.hostname.substring(0, 8)) ?
  `${window.location.protocol}//${window.location.hostname}` :
  'https://tseiiti.duckdns.org';

const KEYS = {
  API_CHAT_URL:  `${BASE}:11434/api/chat`,
  API_TAGS_URL:  `${BASE}:11434/api/tags`,
  API_PS_URL:    `${BASE}:11434/api/ps`,
  API_GEN_URL:   `${BASE}:11434/api/generate`,
}

var MODELS = [];
var PS     = [];

/******************************************************************************
 * Processo principal
 ******************************************************************************/

document.addEventListener('DOMContentLoaded', () => {
  get_table_body();
});
