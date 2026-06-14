/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
// import { ArrowLeft, Clock, Info, Layers, Activity } from 'lucide-react';

// Convert "DD/MM/YYYY, HH:MM:SS" into standard parseable JS Date
const parseLocaleDate = (t) => {
  if (!t) return new Date();
  try {
    // Replace slash dates and commas
    const normalized = t.replace(/(\d{2})\/(\d{2})\/(\d{4}),?\s*/, '$3-$2-$1T');
    const d = new Date(normalized);
    if (isNaN(d.getTime())) {
      return new Date();
    }
    return d;
  } catch {
    return new Date();
  }
};

export default function DetailView({
  userId,
  messages,
  setView,
  setSelectedMsgId,
}) {
  // Find messages by matching ID
  const msg = useMemo(() => {
    return messages.find(m => m.id === userId);
  }, [messages, userId]);

  if (!msg) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[calc(100dvh-64px)]">
        {/* <Info className="w-12 h-12 text-slate-400 mb-4 animate-bounce" /> */}
        <span>f</span>
        <h3 className="font-bold text-slate-700 text-lg mb-2">Mensagem não encontrada</h3>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          Não foi possível encontrar a mensagem com o ID selecionado. Volte e selecione outra mensagem.
        </p>
        <button
          onClick={() => setView('chat')}
          className="bg-primary hover:bg-primary-dim text-white font-semibold py-1.5 px-6 rounded-lg transition-transform active:scale-95 outline-none"
        >
          Voltar para o Chat
        </button>
      </div>
    );
  }

  // Latency variables
  const times = msg.times || {};
  const dateContext = parseLocaleDate(times.context_at);
  const dateThink = parseLocaleDate(times.think_at);
  const dateCreated = parseLocaleDate(times.created_at);
  const dateFinish = parseLocaleDate(times.finish_at);

  const contextSecs = Math.max(0, (dateThink.getTime() - dateContext.getTime()) / 1000);
  const thinkSecs = Math.max(0, (dateCreated.getTime() - dateThink.getTime()) / 1000);
  const renderSecs = Math.max(0, (dateFinish.getTime() - dateCreated.getTime()) / 1000);
  const totalSecs = Math.max(0, (dateFinish.getTime() - dateContext.getTime()) / 1000);

  const tokenRate = useMemo(() => {
    const totalTokens = (msg.up_tokens || 0) + (msg.dw_tokens || 0);
    if (totalSecs <= 0 || totalTokens <= 0) return 0;
    return parseFloat((totalTokens / totalSecs).toFixed(2));
  }, [msg, totalSecs]);

  return (
    <section className="flex-grow overflow-y-auto custom-scrollbar bg-background p-4 max-w-[1376px] mx-auto w-full h-[calc(100dvh-64px)] pb-16">
      <div className="px-0 sm:px-4 lg:px-12 max-w-5xl mx-auto space-y-8 animate-fade-in">
        {/* Header summary of selected message */}
        <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm space-y-2">
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 font-headline-md leading-tight">
            ID de Mensagem: <span className="text-primary font-mono text-lg font-bold">{msg.id}</span>
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-slate-400 bg-slate-50 border px-3 py-1 rounded inline-block">
            Modelo Ativo: <span className="uppercase text-slate-650 font-black">{msg.model || 'Desconhecido'}</span>
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Conteúdo Respondido</h4>
          <p className="text-sm text-slate-700 leading-relaxed text-justify bg-slate-50 p-4 border rounded-xl overflow-x-auto select-all max-h-[260px] custom-scrollbar whitespace-pre-line">
            {msg.content}
          </p>
        </div>

        {/* Dynamic Context section */}
        <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5">
            {/* <Layers className="w-4 h-4 text-primary shrink-0" /> */}
            <span>g</span>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600">Buscas de Contexto Utilizadas</h4>
          </div>

          <div className="overflow-x-auto custom-scrollbar border rounded-xl">
            <table className="w-full table-auto border-collapse text-xs sm:text-sm min-w-[500px]">
              <thead>
                <tr className="bg-slate-55 border-b border-slate-205 py-2">
                  <th className="text-left font-semibold text-slate-400 p-2 sm:p-3 leading-normal">Score</th>
                  <th className="text-center font-semibold text-slate-400 p-2 sm:p-3 leading-normal">Score Calculado</th>
                  <th className="text-left font-semibold text-slate-400 p-2 sm:p-3 leading-normal">Conteúdo do Fragmento</th>
                  <th className="text-center font-semibold text-slate-400 p-2 sm:p-3 leading-normal">Tamanho (char)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {!msg.contexts || msg.contexts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-400 text-xs">
                      Nenhum fragmento extra de contexto foi pesquisado ou anexado para esta resposta.
                    </td>
                  </tr>
                ) : (
                  msg.contexts.map((ct, idx) => {
                    const calcScore = Math.round(-ct.score * 100) + 180;
                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-2 sm:p-3 text-slate-600 font-mono font-bold leading-normal">{ct.score.toFixed(5)}</td>
                        <td className="p-2 sm:p-3 text-center text-slate-600 font-bold leading-normal">{calcScore}</td>
                        <td className="p-2 sm:p-3 text-slate-700 text-justify relative group max-w-sm truncate leading-normal">
                          {ct.content}
                          {/* Tooltip on hovering details */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-white border border-slate-300 text-slate-700 text-xs rounded-lg p-3 whitespace-pre-wrap shadow-xl max-w-sm z-50 animate-fade-in line-clamp-6">
                            <p className="font-bold text-primary mb-1 inline-block">Metadados:</p>
                            <div className="space-y-0.5">
                              <p>• Categoria: {ct.category || 'Geral'}</p>
                              <p>• Arquivo Original: {ct.file || 'N/A'}</p>
                              <p>• Seção / Página: {ct.page || 'N/A'}</p>
                            </div>
                            <hr className="my-1.5" />
                            <p className="line-clamp-4 leading-normal">{ct.content}</p>
                          </div>
                        </td>
                        <td className="p-2 sm:p-3 text-center text-slate-450 leading-normal">{ct.content?.length || 0}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transfer tokens section */}
        <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5">
            {/* <Activity className="w-4 h-4 text-secondary shrink-0 animate-pulse" /> */}
            <span>h</span>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600">Métricas de Transferência de Tokens</h4>
          </div>

          <div className="overflow-x-auto custom-scrollbar border rounded-xl">
            <table className="w-full table-auto border-collapse text-xs sm:text-sm min-w-[500px]">
              <thead>
                <tr className="bg-slate-55 border-b border-slate-205 py-2">
                  <th className="text-left font-semibold text-slate-400 p-3 leading-normal">Tokens Enviados (Prompt Eval)</th>
                  <th className="text-left font-semibold text-slate-400 p-3 leading-normal">Tokens Recebidos (Eval Output)</th>
                  <th className="text-left font-semibold text-slate-400 p-3 leading-normal">Vazão Global de Processamento</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 text-slate-700 font-mono font-bold leading-normal">{msg.up_tokens || 0}</td>
                  <td className="p-3 text-slate-700 font-mono font-bold leading-normal">{msg.dw_tokens || 0}</td>
                  <td className="p-3 text-slate-700 font-semibold leading-normal">
                    {tokenRate > 0 ? `~${tokenRate} tokens / segundo` : 'N/A tokens / segundo'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Timing Analysis section */}
        <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5">
            {/* <Clock className="w-4 h-4 text-purple-600 shrink-0" /> */}
            <span>e</span>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600">Tempos de Processamento e Latência</h4>
          </div>

          <div className="overflow-x-auto custom-scrollbar border rounded-xl">
            <table className="w-full table-auto border-collapse text-xs sm:text-sm min-w-[500px]">
              <thead>
                <tr className="bg-slate-55 border-b border-slate-205 py-2">
                  <th className="text-left font-semibold text-slate-400 p-3 leading-normal">Início Busca</th>
                  <th className="text-center font-semibold text-slate-400 p-3 leading-normal">Latência Busca</th>
                  <th className="text-center font-semibold text-slate-400 p-3 leading-normal">Raciocínio IA</th>
                  <th className="text-center font-semibold text-slate-400 p-3 leading-normal">Exibição Stream</th>
                  <th className="text-left font-semibold text-slate-400 p-3 leading-normal">Concluído</th>
                  <th className="text-center font-semibold text-slate-400 p-3 leading-normal">Latência Geral</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 text-slate-600 leading-normal text-[11px] sm:text-xs">
                    {times.context_at || 'N/A'}
                  </td>
                  <td className="p-3 text-center text-slate-600 font-bold leading-normal">
                    {contextSecs.toFixed(2)}s
                  </td>
                  <td className="p-3 text-center text-slate-600 font-bold leading-normal">
                    {thinkSecs.toFixed(2)}s
                  </td>
                  <td className="p-3 text-center text-slate-600 font-bold leading-normal">
                    {renderSecs.toFixed(2)}s
                  </td>
                  <td className="p-3 text-slate-600 leading-normal text-[11px] sm:text-xs">
                    {times.finish_at || 'N/A'}
                  </td>
                  <td className="p-3 text-center text-primary-dim font-extrabold leading-normal">
                    ~{totalSecs.toFixed(2)}s
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Filtros e Configurações de Origem */}
        <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">Parâmetros Filtros Aplicados na Geração</h4>
          <div className="border border-slate-100 rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 text-xs sm:text-sm divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              <div className="divide-y divide-slate-100">
                <div className="p-3 flex justify-between gap-4">
                  <span className="font-bold text-slate-500">Pergunta Usuário:</span>
                  <span className="text-slate-800 italic text-right max-w-xs truncate">{msg.prompt || 'N/A'}</span>
                </div>
                <div className="p-3 flex justify-between gap-4">
                  <span className="font-bold text-slate-500">Categoria Origem:</span>
                  <span className="text-slate-800 font-mono font-bold">{msg.file || 'Todos'}</span>
                </div>
                <div className="p-3 flex justify-between gap-4">
                  <span className="font-bold text-slate-500">Quantidade de Buscas (K):</span>
                  <span className="text-slate-800 font-extrabold">{msg.quantity ?? 8}</span>
                </div>
                <div className="p-3 flex justify-between gap-4">
                  <span className="font-bold text-slate-500">Quantidade Relações Histórico:</span>
                  <span className="text-slate-800 font-extrabold">{msg.influence ?? 2}</span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 bg-slate-50/30">
                <div className="p-3 flex justify-between gap-4">
                  <span className="font-bold text-slate-500">Score de Relevância Limite:</span>
                  <span className="text-slate-800 font-extrabold">{((180 - (msg.score || 0.75) * 100)).toFixed(0)}</span>
                </div>
                <div className="p-3 flex justify-between gap-4">
                  <span className="font-bold text-slate-500">Modo Thinking:</span>
                  <span className={`font-black ${msg.thinking ? 'text-green-500' : 'text-slate-400'}`}>
                    {msg.thinking ? 'Habilitado' : 'Desativado'}
                  </span>
                </div>
                <div className="p-3 flex justify-between gap-4">
                  <span className="font-bold text-slate-500">Complemento de Lembranças:</span>
                  <span className="text-slate-800 font-extrabold">{msg.memory ?? 4}</span>
                </div>
                <div className="p-3 flex justify-between gap-4">
                  <span className="font-bold text-slate-500">Temperatura (Geração):</span>
                  <span className="text-slate-800 font-extrabold">{msg.temperature ?? 0.5}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Voltar button */}
        <div className="flex items-center justify-end pt-4">
          <button
            onClick={() => {
              setSelectedMsgId(null);
              setView('chat');
            }}
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1.5 px-8 border border-blue-500 hover:border-transparent rounded-lg transition-transform active:scale-95 outline-none cursor-pointer flex items-center gap-1"
          >
            {/* <ArrowLeft className="w-4 h-4" /> */}
            <span>d</span>
             Voltar para o Chat
          </button>
        </div>
      </div>
    </section>
  );
}
