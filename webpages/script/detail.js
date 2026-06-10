const load = (id) => {
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
        <td class="border-b border-gray-100 p-4 text-gray-500 text-center">
          ${Math.round(-ct.score * 100) + 180}
        </td>
        <td class="border-b border-gray-100 p-4 text-gray-500 text-justify group relative inline-block">
          ${ct.content}
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-white text-sm rounded p-3 pt-2 border border-slate-300 whitespace-nowrap shadow-lg">
            categoria: ${ct.category}<br>
            arquivo: ${ct.file}<br>
            página: ${ct.page}
            <div class="absolute top-full left-1/2 -translate-x-1/2 border-6 border-transparent border-t-gray-400"></div>
          </div>
        </td>
        <td class="border-b border-gray-100 p-4 text-gray-500 text-center">
          ${ct.content.length}
        </td>
      </tr>
      `;
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
      <td class="border-b border-gray-100 p-4 text-gray-500">
        ~${((msg.up_tokens + msg.dw_tokens) / (((new Date(msg.times.finish_at)) - (new Date(msg.times.context_at))) / 1000)).toFixed(2)}
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
 * Processo principal
 ******************************************************************************/

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  load(urlParams.get('id'))
});
