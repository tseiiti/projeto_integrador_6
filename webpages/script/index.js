
/******************************************************************************
 * Funções acopladas ao html
 ******************************************************************************/

// evento enter
const handle_enter = e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    e.target.form.requestSubmit();
  }
}

const resize_select = () => {
  const select = qs('.categories');
  const selectedText = select.options[select.selectedIndex].text;
  const tempDiv = document.createElement('div');

  tempDiv.style.position = 'absolute';
  tempDiv.style.visibility = 'hidden';
  tempDiv.style.whiteSpace = 'nowrap';
  tempDiv.style.fontSize = window.getComputedStyle(select).fontSize;
  tempDiv.innerText = selectedText;

  document.body.appendChild(tempDiv);
  select.style.width = tempDiv.offsetWidth + 40 + 'px';
  document.body.removeChild(tempDiv);
}

// insere mensagem do usuário
const insert_user_message = (msg) => {
  let html = markdown_to_html(msg.content);
  html = `
    <!-- User Message -->
    <div class="flex flex-col items-end group" id="msg_usr_${msg.id}">
      <div class="max-w-[80%] flex items-start gap-4 flex-row-reverse">
        <div
          class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-primary text-sm"
            style="font-variation-settings: 'FILL' 1;">person</span>
        </div>
        <div class="relative">
          <div class="border-l-4 border-primary pl-4 py-1 text-justify">
            <div class="text-on-surface leading-relaxed text-sm font-medium content">${html}</div>
          </div>
          <span
            class="text-[10px] text-on-surface-variant mt-2 block opacity-0 group-hover:opacity-100 transition-opacity font-bold">
            ${msg.times.created_at}
          </span>
        </div>
        <button class="cursor-pointer p-1.5 hover:bg-surface-container rounded-md transition-colors text-outline hover:text-on-background opacity-0 group-hover:opacity-100 "
          onclick="copy_msg_usr_id('${msg.id}')">
          <span class="material-symbols-outlined text-[24px]">content_copy</span>
        </button>
      </div>
    </div>
  `;
  qs('.messages').innerHTML += html;
}

// insere mensagem do assistante
const insert_ia_message = (msg) => {
  let ctxs = msg.contexts;
  let ctx = ctxs[0];
  let ltx = ctxs.at(-1);
  let context = ctx ? ` | contextos: ${ctxs.length}, max: ${Math.round(180 - ctx.score * 100)}, min: ${Math.round(180 - ltx.score * 100)}` : '';
  
  let html = markdown_to_html(msg.content);
  html = `
    <!-- AI Message -->
    <div class="flex flex-col items-start group" id="msg_ia_${msg.id}">
      <div class="max-w-[95%] sm:max-w-[85%] sm:flex sm:items-start gap-2 space-y-2">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-1 shadow-md shadow-primary/10">
          <span class="material-symbols-outlined text-white text-sm"
            style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
        </div>
        <div class="bg-white rounded-lg rounded-tl-none p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-outline-variant/50">
          <div class="prose prose-sm max-w-none text-justify">
            <div class="text-on-surface content [&>*]:pb-2 [&>ul]:list-disc [&_ul]:pl-5 [&>ul]:[&_ul]:list-['⮞'] [&_ol]:list-decimal [&_ol]:pl-5">${html}</div>
          </div>
          <div class="flex items-center gap-3">
            <button class="cursor-pointer p-1.5 hover:bg-surface-container rounded-md transition-colors text-outline hover:text-on-background">
              <span class="material-symbols-outlined text-[24px] like" style="font-variation-settings: 'FILL' ${msg.like == 1 ? 1 : 0};" onclick="messages_like(this, '${msg.id}', 1);">thumb_up</span>
            </button>
            <button class="cursor-pointer p-1.5 hover:bg-surface-container rounded-md transition-colors text-outline hover:text-on-background">
              <span class="material-symbols-outlined text-[24px] like" style="font-variation-settings: 'FILL' ${msg.like == -1 ? 1 : 0};" onclick="messages_like(this, '${msg.id}', -1);">thumb_down</span>
            </button>
            <button class="cursor-pointer p-1.5 hover:bg-surface-container rounded-md transition-colors text-outline hover:text-on-background"
              onclick="copy_msg_ia_id('${msg.id}')">
              <span class="material-symbols-outlined text-[24px]">content_copy</span>
            </button>
            <p class="text-[10px] text-on-surface-variant/80 mb-1">${msg.times.created_at}</p>
            <a class="text-[10px] text-on-surface-variant/80 mb-1" href="/detail.html?id=${msg.id}">detalhes</a>
          </div>
        </div>
      </div>
      <div class="ml-2 sm:ml-12 text-[10px] text-on-surface-variant mt-2 block opacity-0 group-hover:opacity-100 transition-opacity font-bold">
        <span class="tokens">tokens enviados: ${msg.up_tokens} | tokens recebidos: ${msg.dw_tokens}</span>${context}
      </div>
    </div>
  `;

  qs('.messages').innerHTML += html;
  qs('.messages-end').scrollIntoView({
    behavior: 'smooth',
  });
}

// mostra icone em pensamento (loading)
const ia_thinking_state = (cur_mod) => {
  let html = `
    <div class="flex items-start gap-4 ia_thinking_state">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-1 opacity-50">
        <span class="material-symbols-outlined text-white text-sm"
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

// limpar conversa
const messages_clear = () => {
  MESSAGES.clr();
  qs('.messages').innerHTML = '';
  set(KEYS.TOKENS, { up_tokens: 0, dw_tokens: 0 });
  qs('.prompt').focus();
}

// marca mensagem ia com like
const messages_like = (element, id, value) => {
  let msg = MESSAGES.get(id);
  if (value == msg.like) value = 0;
  MESSAGES.upd(id, { ...msg, like: value });

  qsa(`#msg_ia_${id} .like`).forEach(e => {
    e.style.fontVariationSettings = "'FILL' 0";
  });
  element.style.fontVariationSettings = `'FILL' ${value == 0 ? 0 : 1}`;
}

const copy_msg_ia_id = (id) => {
  let text = qs(`#msg_ia_${id} .content`).innerText;
  copy_text(text);
};
const copy_msg_usr_id = (id) => {
  let text = qs(`#msg_usr_${id} .content`).innerText;
  copy_text(text);
};



/******************************************************************************
 * Funções de acesso a APIs
 ******************************************************************************/

// finaliza mensagem resposta do assistente
const set_assitent_messages = (id) => {
  MESSAGES.upd(id, { content: BUFFER });

  qs('.ia_thinking_state').remove();
  qs('.prompt').readOnly = false;
  qs('.prompt').focus();

  qs('.messages-end').scrollIntoView({
    behavior: 'smooth',
  });
}

// trata conteúdo picado (stream do chat) e contagem de tokens
const get_content = (msg, json) => {
  try {
    let pcont = qs(`#msg_ia_${msg.id} .content`);
    if (json.done) {
      msg = MESSAGES.upd(msg.id, {
        ...msg,
        up_tokens: json.prompt_eval_count,
        dw_tokens: json.eval_count,
        times: {
          ...msg.times,
          finish_at: (new Date()).toLocaleString(),
        }
      });
      qs(`#msg_ia_${msg.id} span.tokens`).innerHTML = `tokens enviados: ${json.prompt_eval_count} | tokens recebidos: ${json.eval_count}`;

      let tk = get(KEYS.TOKENS, { up_tokens: 0, dw_tokens: 0 });
      set(KEYS.TOKENS, {
        ...tk,
        up_tokens: tk.up_tokens + json.prompt_eval_count,
        dw_tokens: tk.dw_tokens + json.eval_count,
      });
      pcont.innerHTML = markdown_to_html(BUFFER);
    } else {
      BUFFER += json.message.content
      pcont.innerHTML = BUFFER;
      qs('.messages-end').scrollIntoView({
        behavior: 'smooth',
      });
    }
  } catch(error) {
    ce(error);
  }
}

// consome serviço de chat
const call_api_chat = async (msgs, file, score, temperature, contexts, prompt, context_at) => {
  let msg;
  let content = `
    Pergunta: ${prompt}

    Contexto: ${'\n' + contexts.map(e => { return '      - "' + e.content + '";'; }).join('\n')}
  `;
  msgs.push({ role: 'user', content: content });
  cl(msgs);

  // ícone de espera do assistente
  let cur_mod = get(KEYS.CURRENT_MODEL);
  ia_thinking_state(cur_mod);
  let think_at = (new Date()).toLocaleString();

  try {
    const response = await fetch(KEYS.API_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: cur_mod,
        think: false,
        messages: msgs,
        options: {
          temperature: temperature
        }
      })
    });

    const reader = response.body?.getReader();
    if (!reader) return;

    msg = MESSAGES.add({
      role: 'assistant',
      content: '',
      model: cur_mod,
      up_tokens: 0,
      dw_tokens: 0,
      file: file,
      score: score,
      temperature: temperature,
      contexts: contexts,
      prompt: prompt, 
      times: {
        context_at: context_at,
        think_at: think_at,
      },
    });
    insert_ia_message(msg);
    
    const td = new TextDecoder('utf-8');
    BUFFER = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      let strs = td.decode(value).split('\n');
      strs.forEach(str => {
        if (str) {
          let json = JSON.parse(str);
          get_content(msg, json);
        }
      });
    }
  } catch (error) {
    ce(error);
  } finally {
    set_assitent_messages(msg.id);
  }
}

// pega contexto embedding da pergunta
const get_context = async (prompt, cate, score) => {
  cl(prompt);
  try {
    const response = await fetch(KEYS.CONTEXT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: prompt,
        score: score,
        cate: cate
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

// função principal de envio de pergunta
const send_query = async () => {
  // armazena a questão do usuário
  let ppt = qs('.prompt');
  let prompt = ppt.value;
  if (prompt.length == 0) return;

  let context_at = (new Date()).toLocaleString();
  let cate = CATEGORIES[qs('.categories').value];
  let score = (180 - Number(get(KEYS.SCORE))) / 100;
  let temperature = Number(get(KEYS.TEMPERATURE));

  show_toast('Envio:', 'Mensagem sendo enviada...');
  ppt.readOnly = true;

  // cria lista inicial de mensagens
  let msgs = MESSAGES.lst().filter(m => m.role == 'system');
  msgs = msgs.concat(MESSAGES.lst().filter(m => m.role != 'system').slice(-6));
  msgs = msgs.map((e) => {
    return {
      role: e.role, content: e.content.substring(0, 300)
    }
  });

  // adiciona o conteúdo da questão do usuário
  let msg = MESSAGES.add({ role: 'user', content: prompt });
  insert_user_message(msg);
  ppt.value = '';

  // define o contexto da questão
  let aux = MESSAGES.lst()
    .filter(m => m.role == 'assistant' && m.contexts.length > 0)
    .slice(-2)
    .map(m => { return m.prompt }).join('\n') + '\n' + prompt;
  let contexts = await get_context(aux, cate, score);

  // chamada da api do assistente
  await call_api_chat(msgs, cate, score, temperature, contexts, prompt, context_at);
  return false;
}

// alguns processos iniciais
const load = async () => {
  // evento submit
  qs('#form_chat_api').addEventListener('submit', function(e) {
    e.preventDefault();
    send_query();
    return;
  });

  // carrega histórico de mensagens
  for (let msg of MESSAGES.lst()) {
    if (msg.role == 'user') {
      insert_user_message(msg);
    } else if (msg.role == 'assistant') {
      insert_ia_message(msg);
    }
  }

  // carrega categorias
  await fetch(KEYS.CATEGORIES_URL)
  .then(response => { return response.json(); })
  .then(json => {
    CATEGORIES = ['Todos'].concat(json); 
    let html = '';
    for (let i in CATEGORIES) {
      html += `<option class="bg-transparent border-none" value="${i}">${CATEGORIES[i]}</option>`;
    }
    qs('.categories').innerHTML = html;
    resize_select();
  })
  .catch(error => ce(error));

  // carrega lista de modelos
  await fetch(KEYS.API_TAGS_URL)
  .then(response => { return response.json(); })
  .then(json => {
    MODELS = json.models.filter(m => !m.capabilities.includes('embedding')).sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  })
  .catch(error => ce(error));

  let cur_mod = get(
    KEYS.CURRENT_MODEL,
    MODELS.filter(m => m.model.includes('gemma3:1b'))[0]?.model || MODELS[0]?.model);
  // qs('.model').innerHTML = cur_mod;
  qsa('.model').forEach(e => { e.innerHTML = cur_mod });

  qs('.messages-end').scrollIntoView({
    behavior: 'smooth',
  });

  let tk = get(KEYS.TOKENS, { up_tokens: 0, dw_tokens: 0 });
}



/******************************************************************************
 * Processo principal
 ******************************************************************************/

document.addEventListener('DOMContentLoaded', () => {
  load();
});
