const cl = arg => console.log(arg);
const qs = arg => document.querySelector(arg);
const handle_enter = ev => {
  if (ev.key === 'Enter' && !ev.shiftKey) {
    ev.preventDefault();
    ev.target.form.requestSubmit();
  }
}

const select_model = (m) => {
  CURRENT_MODEL = m;
  qs('.model').innerHTML = `${CURRENT_MODEL}`;
  
  let ce = MODELS.find(e => e.model == CURRENT_MODEL);
  
  let html = `
    <h4 class="font-semibold mb-2 text-[12px] text-gray-800 uppercase">${ce.name}</h4>
    <div class="text-[10px]">
      <p class="p-1">
        <span class="text-gray-500">family:</span><br>
        <span class="text-gray-900">${ce.details.family}</span>
      </p>
      <p class="p-1">
        <span class="text-gray-500">modified_at:</span><br>
        <span class="text-gray-900">${ce.modified_at}</span>
      </p>
      <p class="p-1">
        <span class="text-gray-500">size:</span><br>
        <span class="text-green-600">${(ce.size / 1024 ** 2).toFixed(2)}MB</span>
      </p>
      <p class="p-1">
        <span class="text-gray-500">parameter_size:</span><br>
        <span class="text-green-600">${ce.details.parameter_size}</span>
      </p>
      <p class="p-1">
        <span class="text-gray-500">quantization_level:</span><br>
        <span class="text-gray-900">${ce.details.quantization_level}</span>
      </p>
      <p class="p-1">
        <span class="text-gray-500">digest:</span><br>
        <span class="text-gray-600">${ce.digest}</span>
      </p>
      <p class="p-1">
        <span class="text-gray-500">format:</span><br>
        <span class="text-gray-600">${ce.details.format}</span>
      </p>
      <p class="p-1">
        <span class="text-gray-500">parent_model:</span><br>
        <span class="text-gray-600">${ce.details.parent_model}</span>
      </p>
    </div>
  `;
  qs('.model_tooltip').innerHTML = html;
  
  html = '';
  for (let model of MODELS) {
    if (model.model == CURRENT_MODEL) {
      html += `
        <a class="text-primary border-b-2 border-primary pb-1 shrink-0" href="javascript: select_model('${model.model}')">
          ${model.name}
        </a>`;
    } else {
      html += `
        <a class="text-on-surface-variant hover:text-on-surface transition-opacity shrink-0" href="javascript: select_model('${model.model}')">
          ${model.name}
        </a>`;
    }
  }
  qs('.models').innerHTML = html;
  qs('[name=textarea_prompt]').focus();
}

const insert_user_message = (content) => {
  let html = `
    <!-- User Message -->
    <div class="flex flex-col items-end group">
      <div class="max-w-[80%] flex items-start gap-4 flex-row-reverse">
        <div
          class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-primary text-xs"
            style="font-variation-settings: 'FILL' 1;">person</span>
        </div>
        <div class="relative">
          <div class="border-l-4 border-primary pl-4 py-1">
            <p class="text-on-surface leading-relaxed text-sm font-medium">${content}</p>
          </div>
          <span
            class="text-[10px] text-on-surface-variant mt-2 block opacity-0 group-hover:opacity-100 transition-opacity font-bold">
            ${(new Date()).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  `;
  qs('.messages').innerHTML += html;
}

const insert_ia_message = (id) => {
  let html = `
    <!-- AI Message -->
    <div class="flex flex-col items-start group invisible">
      <div class="max-w-[85%] flex items-start gap-4">
        <div
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-1 shadow-md shadow-primary/10">
          <span class="material-symbols-outlined text-white text-xs"
            style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
        </div>
        <div
          class="bg-white rounded-lg rounded-tl-none p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-outline-variant/50">
          <div class="prose prose-sm max-w-none">
            <p class="text-on-surface" id="ia_msg_${id}"></p>
          </div>
          <div class="flex items-center gap-3 pt-2">
            <button
              class="p-1.5 hover:bg-surface-container rounded-md transition-colors text-on-surface-variant hover:text-primary">
              <span class="material-symbols-outlined text-sm">thumb_up</span>
            </button>
            <button
              class="p-1.5 hover:bg-surface-container rounded-md transition-colors text-on-surface-variant hover:text-primary">
              <span class="material-symbols-outlined text-sm">thumb_down</span>
            </button>
            <button
              class="p-1.5 hover:bg-surface-container rounded-md transition-colors text-on-surface-variant hover:text-primary">
              <span class="material-symbols-outlined text-sm">refresh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  qs('.messages').innerHTML += html;
}

const ia_thinking_state = () => {
  let html = `
    <div class="flex items-start gap-4 ia_thinking_state">
      <div
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-1 opacity-50">
        <span class="material-symbols-outlined text-white text-xs"
          style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
      </div>
      <div
          class="bg-primary-container text-on-primary-container rounded-full px-4 py-2 flex items-center gap-2.5 animate-pulse shadow-sm border border-primary/10">
        <div class="flex gap-1">
          <div class="w-1.5 h-1.5 bg-primary rounded-full"></div>
          <div class="w-1.5 h-1.5 bg-primary rounded-full opacity-60"></div>
          <div class="w-1.5 h-1.5 bg-primary rounded-full opacity-30"></div>
        </div>
        <span class="text-xs font-bold"><label class="uppercase">${CURRENT_MODEL}</label> is thinking...</span>
      </div>
    </div>
  `;
  qs('.messages').innerHTML += html;
  qs('.ia_thinking_state').scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
}

const call_chat_api = async (content) => {
  MESSAGES.push({ role: 'user', content: content });
  IA_MSG_ID = MESSAGES.length;

  insert_user_message(PROMPT);
  insert_ia_message(IA_MSG_ID);
  ia_thinking_state();

  try {
    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: CURRENT_MODEL,
        messages: MESSAGES,
      })
    });
    
    const reader = response.body?.getReader();
    if (!reader) return;

    qs('.flex.flex-col.items-start.group.invisible').classList.remove('invisible');
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      get_content(value);
    }
  } catch (error) {
    console.log('call_chat_api error:', error);
  } finally {
    let msg = MESSAGES.findLast(msg => msg.role == 'user');
    msg.content = PROMPT;
    set_assitent_messages();
  }
}

const get_content = value => {
  try {
    let rjson = new TextDecoder().decode(value);
    let json = JSON.parse(rjson);
    if (json.done) {
      TOKENS += json.prompt_eval_count;
      TOKENS += json.eval_count;

      qs('.token').innerHTML = `${TOKENS} TOKENS SPENT`;
    } else {
      let content = json.message.content;
      qs(`#ia_msg_${IA_MSG_ID}`).innerHTML += content;
    }
  } catch (error) {
    console.log('get_content error:', error);
  }
}

const set_assitent_messages = () => {
  let content = qs(`#ia_msg_${IA_MSG_ID}`).innerHTML;
  MESSAGES.push({ role: 'assistant', content: content });

  qs('.ia_thinking_state').remove();
  qs('[name=textarea_prompt]').readOnly = false;
  qs('[name=textarea_prompt]').focus();
}

const send_query = async () => {
  let e = qs('[name=textarea_prompt]');
  if (e.value.length == 0) return;
  PROMPT = e.value;
  e.readOnly = true;
  e.value = '';
  
  if (!CONTEXT_URL) {
    let content = `
      Pergunta: ${PROMPT}
    `;
    call_chat_api(content);
    return;
  }

  await fetch(CONTEXT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: PROMPT
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(context => {
    let content = `
      Pergunta: ${PROMPT}
      
      Contexto: ${context}
    `;
    call_chat_api(content);
  })
  .catch(error => console.log('send_query error:', error));
}


const DOMAIN = window.location.hostname;
const CHAT_API_URL = `http://${DOMAIN}:11434/api/chat`;
const CONTEXT_URL  = `http://${DOMAIN}:8000/context`;
const MODELS_URL   = `http://${DOMAIN}:11434/api/tags`;
var MODELS = [];
var MESSAGES = [{
  role: 'system',
  content: 'Responda a pergunta com base somente no contexto. E você é um especialista no assunto informado nesse contexto. A resposta deve ser sempre em português de forma clara e objetiva. A resposta deve ser em um único parágrafo bem elaborado e completo, a menos que esteja explícito outro formato na pergunta.'
}];
var IA_MSG_ID;
var PROMPT;
var TOKENS = 0;
var CURRENT_MODEL = 'gemma3:1b';

document.addEventListener('DOMContentLoaded', () => {
  qs('#form_chat_api').addEventListener('submit', function(e) {
    e.preventDefault();
    send_query();
    return;
  });

  fetch(MODELS_URL)
  .then(response => { return response.json(); })
  .then(json => { 
    MODELS = json.models.sort(
      (a, b) => a.name.localeCompare(b.name)
    );
    select_model(CURRENT_MODEL || MODELS[0].name);
  })
  .catch(error => { console.error(error); });
});
