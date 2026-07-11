
/******************************************************************************
*  Modelos
 ******************************************************************************/
const capabilities = {
  vision: 'eye_tracking',
  completion: 'text_snippet',
  tools: 'construction',
  thinking: 'network_intel_node',
}

var timerId;
const handle_save = () => {
  clearTimeout(timerId);

  let toast = qs('#success-toast');
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  
  timerId = setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3000);
}

const select_model = (cur_mod) => {
  if (get(KEYS.C_MODEL) == cur_mod && qs('.models').innerHTML != "") return;

  set(KEYS.C_MODEL, cur_mod);

  let html = '';
  for (let model of MODELS) {
    let cur_aux = model.model == cur_mod ? 'primary' : 'outline';
    let names = model.name.split(':')
    let cap_icons = '';
    for (let c of model.capabilities) {
      cap_icons += `
      <span class="material-symbols-outlined text-[16px] text-gray-600" title="${c.charAt(0).toUpperCase() + c.slice(1)}">
        ${capabilities[c]}
      </span>
      `;
    }

    html += `
      <div class="relative flex flex-col bg-surface-white border border-${cur_aux} rounded-xl overflow-hidden transition-all hover:border-primary/50 hover:shadow-md cursor-pointer group">
        <div class="p-md pb-sm border-b border-${cur_aux}/30 bg-${cur_aux}/20">
          <div class="flex items-start justify-between mb-xs">
            <h3 class="font-label-md text-${cur_aux} group-hover:text-gray-800 text-[18px] capitalize">${names[0]}:<span class="uppercase">${names[1]}</span></h3>
          </div>
          <div class="flex items-center gap-sm mt-xs">
            <span class="text-[13px] font-bold text-${cur_aux} group-hover:text-gray-800">${model.details.parameter_size}</span>
            <span class="text-[10px] text-gray-500 px-2 bg-white py-px border border-surface-container-highest rounded-sm uppercase">${model.details.format} * ${model.details.quantization_level}</span>
            <span class="bg-surface-container-highest px-1.5 py-0.5 rounded text-[10px] ml-auto text-gray-600 font-bold uppercase">${model.details.family}</span>
          </div>
        </div>
        <div class="p-md space-y-md flex-grow flex flex-col justify-between">
          <div class="space-y-sm">
            <div class="flex items-center gap-xs text-[11px]">
              <span class="material-symbols-outlined text-[14px] text-gray-600">schedule</span>
              <span class="text-gray-500">Modificado em ${(new Date(model.modified_at)).toLocaleString()}</span>
            </div>
            <div class="flex flex-wrap gap-1.5">
              ${cap_icons}
            </div>
          </div>
          <hr class="text-gray-300 mb-2">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-xs text-[11px]">
              <span class="material-symbols-outlined text-[14px] text-gray-600">data_table</span>
              <span class="text-gray-500">${(model.size / 1024 ** 2).toFixed(2)}MB</span>
            </div>
            <button class="p-xs rounded-full border border-outline text-gray-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center" title="Selecionar modelo" onclick="select_model('${model.model}'); handle_save();">
              <span class="material-symbols-outlined text-${cur_aux} text-[20px]">radio_button_unchecked</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }
  qs('.models').innerHTML = html;
}




/******************************************************************************
*  Histórico de conversas
 ******************************************************************************/
const historic = () => {
  let id = get(KEYS.C_CHAT);
  let html = '';
  for (let chat of BACKUP.lst().sort((a, b) => (new Date(b.times.created_at)) - (new Date(a.times.created_at)))) {
    html += `
      <div class="p-md rounded-xl cursor-pointer ${chat.id == id ? 'bg-primary/5 border border-primary/10' : 'hover:bg-surface-container-highest transition-colors'}">
          <div class="flex items-center space-x-2 sm:space-x-4">
            <div class="flex items-center gap-sm mb-xs truncate" onclick="sel_chat('${chat.id}');">
                <span class="material-symbols-outlined text-${chat.id == id ? 'primary' : 'outline'} text-[18px]">chat_bubble</span>
                <p class="font-label-md text-text-main truncate">${chat.id}: ${chat.title || JSON.parse(chat.messages).at(-1).content}</p>
            </div>
            <div class="inline-block ml-auto">
                <span class="material-symbols-outlined text-green-400" onclick="title_chat('${chat.id}');" title="cria um título">label</span>
            </div>
            <div class="inline-block">
                <span class="material-symbols-outlined text-red-400" onclick="delete_chat('${chat.id}');" title="excluir a conversa">delete</span>
            </div>
          </div>
          <p class="text-[12px]">${chat.times.created_at}</p>
      </div>
    `;
  };
  qs('.history').innerHTML = html;
}

const new_chat = () => {
  backup_chat();
  // clear_chat();
  localStorage.removeItem(KEYS.MESSAGES);
  localStorage.removeItem(KEYS.C_CHAT);
  window.location.href = '/';
}

const sel_chat = (id) => {
  if (chat = BACKUP.get(id)) {
    backup_chat();
    clear_chat();
    localStorage.removeItem(KEYS.C_CHAT);
    restore_chat(chat);
    set(KEYS.C_CHAT, chat.id);
    window.location.href = '/';
  }
}

const save_chat = () => {
  backup_chat();
  window.location.reload();
}

const clean_chat = () => {
  clear_chat();
  window.location.reload();
}

const delete_chat = (id) => {
  BACKUP.del(id);
  window.location.reload();
}

const title_chat = async (id) => {
  let msg = JSON.parse(
              BACKUP.lst()
              .find(b => b.id == id)
              .messages)
            .slice(1)
            .map(m => {return m.content})
            .join(' ')
            .replace(/\n/g, ' ');
            
  await fetch(KEYS.API_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'ssfdre38/gemma4-nano:e2b',
      think: false,
      stream: false,
      messages: [{
        role: 'user',
        content: `crie um título criativo para o conteúdo abaixo. em português. não inclua mais nada, somente o título.
        """
        ${msg}
        """`
      }]
    })
  })
  .then(response => { return response.json(); })
  .then(json => {
    BACKUP.upd(id, { title: json.message.content })
  });

  window.location.reload();
}





/******************************************************************************
 * Processo principal
 ******************************************************************************/
const load = async () => {
  // carrega lista de modelos
  await fetch(KEYS.API_TAGS_URL)
  .then(response => { return response.json(); })
  .then(json => {
    MODELS = json.models.filter(m => !m.capabilities.includes('embedding')).sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  })
  .catch(error => ce(error));

  qs('.disp').innerHTML = MODELS.length + (MODELS.length > 1 ? ' modelos disponíveis' : ' modelo disponível');

  let cur_mod = get(
    KEYS.C_MODEL,
    MODELS.filter(m => m.model.includes('gemma3:1b'))[0]?.model || MODELS[0]?.model);
  select_model(cur_mod);
  historic();
  
  // carrega valores do storage
  qs(`#${KEYS.QUANTITY}`).value = get(KEYS.QUANTITY);
  qs(`#${KEYS.THINKING}`).checked = get(KEYS.THINKING);
  qs(`#${KEYS.INFLUENCE}`).value = get(KEYS.INFLUENCE);
  qs(`#${KEYS.MEMORY}`).value = get(KEYS.MEMORY);

  qs(`#${KEYS.SCORE}-range`).value = get(KEYS.SCORE);
  qs(`#${KEYS.TEMPERATURE}-range`).value = get(KEYS.TEMPERATURE);
  qs(`#${KEYS.SCORE}-value`).textContent = get(KEYS.SCORE);
  qs(`#${KEYS.TEMPERATURE}-value`).textContent = get(KEYS.TEMPERATURE);

  [ KEYS.TEMPERATURE, KEYS.SCORE ].forEach(t => {
    let r = qs(`#${t}-range`);
    let v = qs(`#${t}-value`);
    r.addEventListener('input', (e) => { 
      v.textContent = e.target.value;
      set(t, e.target.value);
      handle_save();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  load();
});
