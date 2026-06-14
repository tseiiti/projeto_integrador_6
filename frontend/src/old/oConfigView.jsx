/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
// import {
//   Cpu,
//   Layers,
//   Wrench,
//   Eye,
//   FileText,
//   Brain,
//   MessageSquare,
//   Trash2,
//   Tag,
//   Plus,
//   Save,
//   Trash,
//   Clock,
//   Sparkles,
//   ToggleLeft,
//   ToggleRight,
// } from 'lucide-react';
import { KEYS, SessionStorageManager, getStorageJson, setStorageJson } from '../lib/storage.js';

export default function ConfigView({
  models,
  currentModel,
  setCurrentModel,
  baseUrl,
  setBaseUrl,
  messages,
  setMessages,
  showToast,
  setView,
}) {
  // Context states
  const [quantity, setQuantity] = useState(8);
  const [influence, setInfluence] = useState(2);
  const [score, setScore] = useState(75);

  // Reasoning states
  const [thinking, setThinking] = useState(false);
  const [memory, setMemory] = useState(4);
  const [temperature, setTemperature] = useState(0.5);

  // Backup sessions list state
  const [backups, setBackups] = useState([]);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingTitleText, setEditingTitleText] = useState('');

  // Load configuration from local storage on mount
  useEffect(() => {
    setQuantity(getStorageJson(KEYS.QUANTITY, 8));
    setInfluence(getStorageJson(KEYS.INFLUENCE, 2));
    setScore(getStorageJson(KEYS.SCORE, 75));
    setThinking(localStorage.getItem(KEYS.THINKING) === 'true');
    setMemory(getStorageJson(KEYS.MEMORY, 4));
    setTemperature(getStorageJson(KEYS.TEMPERATURE, 0.5));
    setBackups(SessionStorageManager.getBackups());
  }, []);

  // Set & trigger save toasts
  const updateSetting = (key, value, setter) => {
    setter(value);
    if (key === KEYS.THINKING) {
      localStorage.setItem(key, String(value));
    } else {
      setStorageJson(key, value);
    }
    showToast('Sucesso!', 'Configurações atualizadas com sucesso.', 'success');
  };

  // Helper actions
  const handleBackupChat = () => {
    // Only backup if there are actual user/assistant messages present aside from default system message
    const validMessages = messages.filter(m => m.role !== 'system');
    if (validMessages.length > 0) {
      const chatBackup = {
        messages: JSON.stringify(messages),
        c_model: currentModel,
        quantity: quantity,
        score: score,
        temperature: temperature,
        thinking: thinking,
        title: validMessages[0]?.content?.substring(0, 40) || 'Nova Conversa',
      };
      
      const currentChatId = localStorage.getItem(KEYS.C_CHAT);
      const saved = SessionStorageManager.addBackup(chatBackup, currentChatId);
      localStorage.setItem(KEYS.C_CHAT, saved.id);
      setBackups(SessionStorageManager.getBackups());
      showToast('Salvo:', 'Histórico de conversa arquivado com sucesso!', 'success');
    }
  };

  const handleNewChat = () => {
    handleBackupChat();
    // Clear out messages array
    localStorage.removeItem(KEYS.MESSAGES);
    localStorage.removeItem(KEYS.C_CHAT);
    setMessages([]);
    showToast('Novo Chat:', 'Sessão limpa iniciada com sucesso!', 'success');
    setView('chat');
  };

  const handleCleanChat = () => {
    if (window.confirm('Tem certeza de que deseja limpar a conversa ativa?')) {
      localStorage.removeItem(KEYS.MESSAGES);
      setMessages([]);
      showToast('Limpo:', 'Conversa ativa redefinida.', 'success');
    }
  };

  const handleRestoreChat = (chat) => {
    handleBackupChat(); // backup current first

    try {
      const parsedMsgs = JSON.parse(chat.messages);
      localStorage.setItem(KEYS.MESSAGES, chat.messages);
      localStorage.setItem(KEYS.C_MODEL, chat.c_model || currentModel);
      localStorage.setItem(KEYS.C_CHAT, chat.id);
      
      // Merge other configurations
      if (chat.quantity !== undefined) updateSetting(KEYS.QUANTITY, Number(chat.quantity), setQuantity);
      if (chat.score !== undefined) updateSetting(KEYS.SCORE, Number(chat.score), setScore);
      if (chat.temperature !== undefined) updateSetting(KEYS.TEMPERATURE, Number(chat.temperature), setTemperature);
      if (chat.thinking !== undefined) updateSetting(KEYS.THINKING, chat.thinking === 'true' || chat.thinking === true, setThinking);

      setMessages(parsedMsgs);
      if (chat.c_model) {
        setCurrentModel(chat.c_model);
      }

      showToast('Restaurado:', `Conversa "${chat.id}" carregada!`, 'success');
      setView('chat');
    } catch (e) {
      showToast('Erro:', 'Não foi possível restaurar esta conversa.', 'error');
    }
  };

  const handleDeleteBackup = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Excluir esta conversa salva permanentemente?')) {
      SessionStorageManager.deleteBackup(id);
      setBackups(SessionStorageManager.getBackups());
      
      // If we are currently in this chat, disconnect the linkage
      if (localStorage.getItem(KEYS.C_CHAT) === id) {
        localStorage.removeItem(KEYS.C_CHAT);
      }
      showToast('Excluído:', 'Conversa excluída do histórico.', 'success');
    }
  };

  const handleRenameClick = (id, currentTitle, e) => {
    e.stopPropagation();
    setEditingTitleId(id);
    setEditingTitleText(currentTitle);
  };

  const handleSaveRename = (id) => {
    if (editingTitleText.trim().length > 0) {
      SessionStorageManager.updateBackupTitle(id, editingTitleText.trim());
      setBackups(SessionStorageManager.getBackups());
      showToast('Título:', 'Título atualizado com sucesso!', 'success');
    }
    setEditingTitleId(null);
  };

  const handleAutoTitleChat = async (id, e) => {
    e.stopPropagation();
    const chat = backups.find(b => b.id === id);
    if (!chat) return;

    try {
      const parsed = JSON.parse(chat.messages);
      const firstUserMsg = parsed.find(m => m.role === 'user');
      if (!firstUserMsg) {
        showToast('Info:', 'Conversa vazia para criar título automático.', 'info');
        return;
      }

      showToast('Gerando:', 'Criando título automático com a IA...', 'info');

      // Simple prompt call to generate title
      const ollamaChatUrl = `${baseUrl}:11434/api/chat`;
      const response = await fetch(ollamaChatUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: currentModel,
          stream: false,
          messages: [
            {
              role: 'user',
              content: `Resuma o seguinte texto em um título super curto, elegante e direto de no máximo 4 palavras em português, sem aspas ou caracteres especiais adicionais:\n\n"${firstUserMsg.content}"`,
            },
          ],
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const autoTitle = json.message?.content?.trim() || 'Conversa';
        SessionStorageManager.updateBackupTitle(id, autoTitle);
        setBackups(SessionStorageManager.getBackups());
        showToast('Sucesso:', `Título automático alterado para: "${autoTitle}"`, 'success');
      } else {
        throw new Error('Ollama failed to respond');
      }
    } catch (err) {
      console.error('Auto rename failed', err);
      showToast('Erro:', 'Não foi possível gerar título com a IA. Altere manualmente.', 'error');
    }
  };

  return (
    <section className="flex-grow overflow-y-auto custom-scrollbar bg-background p-4 max-w-[1376px] mx-auto w-full h-[calc(100dvh-64px)] pb-16">
      <div className="px-0 sm:px-4 lg:px-12 max-w-5xl mx-auto space-y-6">
        {/* Model Section */}
        <div className="bg-white border border-outline-variant rounded-xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {/* <Cpu className="text-primary w-5 h-5" /> */}
              <h2 className="font-headline-md text-slate-800 font-bold text-lg animate-fade-in">Modelos Disponíveis</h2>
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 rounded-md px-2 py-0.5">
              {models.length} {models.length === 1 ? 'modelo' : 'modelos'}
            </span>
          </div>

          {/* Horizontal scroll of models cards */}
          <div className="flex gap-4 overflow-x-auto pb-3 custom-scrollbar hide-scrollbar mask-gradient">
            {models.length === 0 ? (
              <div className="p-8 text-center text-slate-450 border border-dashed rounded-xl w-full">
                Nenhum modelo Ollama carregado. Verifique se o Ollama está rodando na porta 11434 ou configure o Base URL.
              </div>
            ) : (
              models.map((mod) => {
                const isSelected = mod.model === currentModel;
                const paramSize = mod.details?.parameter_size || 'N/A';
                const sizeMb = (mod.size / (1024 * 1024)).toFixed(0);

                return (
                  <div
                    key={mod.model}
                    onClick={() => updateSetting(KEYS.C_MODEL, mod.model, setCurrentModel)}
                    className={`min-w-[260px] sm:min-w-[300px] flex flex-col justify-between border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                      isSelected
                        ? 'bg-primary/5 border-primary ring-2 ring-primary/10'
                        : 'bg-white border-outline-variant hover:border-slate-350'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-slate-800 text-sm md:text-base capitalize truncate">
                          {mod.name.split(':')[0]}
                          <span className="uppercase text-xs font-extrabold text-primary ml-1">
                            {mod.name.split(':')[1] || ''}
                          </span>
                        </h3>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase">
                          {mod.details?.family || 'Ollama'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <span className="font-extrabold text-slate-700">{paramSize}</span>
                        <span>•</span>
                        <span className="uppercase text-[10px] bg-slate-50 border px-1 rounded sm:inline-block">
                          {mod.details?.format || 'GGUF'}
                        </span>
                        <span>•</span>
                        <span className="text-[10px] truncate max-w-[80px]">
                          {mod.details?.quantization_level || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-1">
                        {/* <Clock className="w-3.5 h-3.5" /> */}
                        <span>{sizeMb} MB</span>
                      </div>

                      {/* Capabilities indicators */}
                      <div className="flex items-center gap-1.5 grayscale shrink-0">
                        {/* {mod.capabilities?.includes('vision') && <Eye className="w-3.5 h-3.5" title="Vision Capable" />}
                        {mod.capabilities?.includes('tools') && <Wrench className="w-3.5 h-3.5" title="Tool Use Capable text-blue-500" />}
                        {mod.capabilities?.includes('thinking') && <Brain className="w-3.5 h-3.5 text-primary" title="Thinking" />}
                        {mod.capabilities?.includes('completion') && <FileText className="w-3.5 h-3.5" title="Completion" />} */}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* API Base url input widget */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-500">API Ollama / Context Base URL</span>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full sm:max-w-xs px-3 py-1.5 bg-slate-50 border border-gray-300 rounded-lg text-xs shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700"
              placeholder="e.g. https://127.0.0.1"
            />
          </div>
        </div>

        {/* Configuration settings grids */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Section: Contexto */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {/* <Layers className="text-primary w-5 h-5" /> */}
                  <h2 className="font-headline-md text-slate-800 font-bold text-base">Parâmetros de Contexto</h2>
                </div>

                <div className="space-y-4">
                  {/* Quantity */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/50">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Quantidade Máxima</p>
                      <p className="text-[11px] text-slate-500 leading-normal max-w-xs">Quantidade máxima de fragmentos de busca adicionados de volta ao Ollama.</p>
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={quantity}
                      onChange={(e) => updateSetting(KEYS.QUANTITY, Number(e.target.value), setQuantity)}
                      className="w-16 px-2 py-1 bg-white border border-gray-300 rounded-lg text-sm text-center font-bold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  {/* Influence relations */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/50">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Quantidade de Relações</p>
                      <p className="text-[11px] text-slate-500 leading-normal max-w-xs">Perguntas e respostas anteriores que orientam a busca por novos termos.</p>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={influence}
                      onChange={(e) => updateSetting(KEYS.INFLUENCE, Number(e.target.value), setInfluence)}
                      className="w-16 px-2 py-1 bg-white border border-gray-300 rounded-lg text-sm text-center font-bold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary animate-fade-in"
                    />
                  </div>

                  {/* Score Mínimo */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold text-slate-800 text-sm">Score Mínimo</label>
                      <span className="bg-primary text-white font-bold px-2 py-0.5 rounded text-xs">
                        {score}
                      </span>
                    </div>
                    <input
                      className="w-full cursor-pointer accent-primary py-1"
                      max={100}
                      min={1}
                      step={1}
                      type="range"
                      value={score}
                      onChange={(e) => updateSetting(KEYS.SCORE, Number(e.target.value), setScore)}
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>Mínimo (1)</span>
                      <span>Máximo (100)</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed pt-1">
                      Nível de restrição de compatibilidade exigida para inclusão da informação.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Raciocínio */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {/* <Brain className="text-secondary w-5 h-5 block" /> */}
                  <h2 className="font-headline-md text-slate-800 font-bold text-base">Raciocínio & Respostas</h2>
                </div>

                <div className="space-y-4">
                  {/* Thinking toggle */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/50">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-slate-800 text-sm">Modo Thinking</p>
                        {/* <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" /> */}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal max-w-xs">Ativa trajetórias de pensamento detalhadas (disponíveis nos modelos DeepSeek r1, gemma3, etc).</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSetting(KEYS.THINKING, !thinking, setThinking)}
                      className="text-primary hover:scale-105 active:scale-95 transition-all outline-none"
                    >
                      {thinking ? (
                        // <ToggleRight className="w-11 h-11 text-primary focus:outline-none" />
                        <span>y</span>
                      ) : (
                        // <ToggleLeft className="w-11 h-11 text-slate-350 focus:outline-none" />
                        <span>z</span>
                      )}
                    </button>
                  </div>

                  {/* Memories / Memory count */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/50">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Lembranças</p>
                      <p className="text-[11px] text-slate-500 leading-normal max-w-xs">Quantidade total de mensagens de rodadas anteriores enviadas de volta ao modelo.</p>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={12}
                      value={memory}
                      onChange={(e) => updateSetting(KEYS.MEMORY, Number(e.target.value), setMemory)}
                      className="w-16 px-2 py-1 bg-white border border-gray-300 rounded-lg text-sm text-center font-bold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  {/* Temperature slider */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold text-slate-800 text-sm">Temperatura</label>
                      <span className="bg-secondary text-white font-bold px-2 py-0.5 rounded text-xs">
                        {temperature}
                      </span>
                    </div>
                    <input
                      className="w-full cursor-pointer accent-secondary py-1"
                      max={2}
                      min={0}
                      step={0.1}
                      type="range"
                      value={temperature}
                      onChange={(e) => updateSetting(KEYS.TEMPERATURE, parseFloat(e.target.value), setTemperature)}
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>Rígido (0.0)</span>
                      <span>Criativo (2.0)</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed pt-1">
                      Temperaturas mais baixas são analíticas, enquanto focado em criatividade gera resultados inventivos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Histórico */}
          <div className="lg:col-span-12">
            <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  {/* <MessageSquare className="text-primary w-5 h-5" /> */}
                  <h2 className="font-headline-md text-slate-800 font-bold text-base">Controle de Mensagens</h2>
                </div>

                <div className="flex items-center flex-wrap gap-2.5">
                  <button
                    onClick={handleCleanChat}
                    className="cursor-pointer bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all outline-none"
                  >
                    {/* <Trash className="w-3.5 h-3.5" /> */}
                     Limpar
                  </button>

                  <button
                    onClick={handleBackupChat}
                    title="Arquivar conversa ativa em backups"
                    className="cursor-pointer bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all outline-none"
                  >
                    {/* <Save className="w-3.5 h-3.5" /> */}
                     Salvar Conversa
                  </button>

                  <button
                    onClick={handleNewChat}
                    className="cursor-pointer bg-primary text-white hover:bg-primary-dim rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1 active:scale-95 shadow-md shadow-primary/10 transition-all font-sans outline-none"
                  >
                    {/* <Plus className="w-3.5 h-3.5" /> */}
                     Novo Chat
                  </button>
                </div>
              </div>

              {/* Backups List */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">Backups e Arquivos</h3>
                {backups.length === 0 ? (
                  <div className="text-center p-8 text-slate-400 text-xs border border-dashed rounded-lg bg-slate-50 animate-fade-in">
                    Nenhum backup de conversa encontrado. Use o botão "Salvar" para arquivar conversas importantes.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {backups.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleRestoreChat(chat)}
                        className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 cursor-pointer hover:border-primary/30 transition-all hover:bg-white relative group animate-fade-in"
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {/* <MessageSquare className="w-4 h-4 text-primary shrink-0" /> */}
                            {editingTitleId === chat.id ? (
                              <input
                                type="text"
                                value={editingTitleText}
                                onChange={(e) => setEditingTitleText(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                onBlur={() => handleSaveRename(chat.id)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.stopPropagation();
                                    handleSaveRename(chat.id);
                                  }
                                }}
                                className="w-full text-xs font-semibold border-b border-primary text-slate-800 bg-white py-px px-1 focus:outline-none"
                                autoFocus
                              />
                            ) : (
                              <p className="font-semibold text-slate-800 text-xs sm:text-sm truncate">
                                {chat.title || `${chat.id}`}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            {editingTitleId !== chat.id ? (
                              <>
                                <button
                                  onClick={(e) => handleRenameClick(chat.id, chat.title || '', e)}
                                  title="Editar Título"
                                  className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 active:scale-90 cursor-pointer"
                                >
                                  {/* <Tag className="w-3.5 h-3.5" /> */}
                                </button>
                                <button
                                  onClick={(e) => handleAutoTitleChat(chat.id, e)}
                                  title="Gerar título com IA do Ollama"
                                  className="p-1 hover:bg-indigo-50 rounded text-indigo-500 hover:text-indigo-800 active:scale-90 cursor-pointer"
                                >
                                  {/* <Sparkles className="w-3.5 h-3.5" /> */}
                                </button>
                              </>
                            ) : null}
                            <button
                              onClick={(e) => handleDeleteBackup(chat.id, e)}
                              title="Excluir"
                              className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700 active:scale-90 cursor-pointer"
                            >
                              {/* <Trash2 className="w-3.5 h-3.5" /> */}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-450 mt-1 md:mt-2">
                          <span className="font-semibold text-slate-400 bg-white border rounded px-1.5 font-sans">
                            {chat.c_model || 'Ollama'}
                          </span>
                          <span className="font-medium text-slate-400">{chat.times?.created_at}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button layout bottom footer redirection */}
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => setView('manage')}
            className="text-xs text-primary hover:underline font-bold transition-all focus:outline-none cursor-pointer"
          >
            Gerenciar Modelos Carregados no Sistema &gt;
          </button>

          <button
            onClick={() => setView('chat')}
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1.5 px-8 border border-blue-500 hover:border-transparent rounded-lg transition-all focus:outline-none cursor-pointer active:scale-95"
          >
            Voltar
          </button>
        </div>
      </div>
    </section>
  );
}
