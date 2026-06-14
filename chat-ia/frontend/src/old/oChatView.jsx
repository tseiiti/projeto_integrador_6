/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useRef, useEffect } from 'react';
// import { Sparkles, Send, Copy, ThumbsUp, ThumbsDown, FileText } from 'lucide-react';
import { KEYS, SessionStorageManager, getStorageJson, setStorageJson } from './ostorage.js';
import { renderMarkdownToHtml } from './omarkdown.js';

export default function ChatView({
  messages,
  setMessages,
  currentModel,
  categories,
  selectedCategoryIndex,
  baseUrl,
  showToast,
  setView,
  setSelectedMsgId,
}) {
  const [promptText, setPromptText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [likeStates, setLikeStates] = useState({});
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Initialize likes from localStorage on mount
  useEffect(() => {
    const activeMsgs = SessionStorageManager.getActiveMessages();
    const likes = {};
    activeMsgs.forEach(m => {
      if (m.like !== undefined) {
        likes[m.id] = m.like;
      }
    });
    setLikeStates(likes);
  }, [messages]);

  // Scroll to bottom helper
  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, [messages, isThinking]);

  // Paste from clipboard helper
  const handlePasteClippedText = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPromptText(text);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      const preview = text.length > 50 ? `${text.substring(0, 47).trim()}...` : text;
      showToast('Colado:', `Texto "${preview}" colado!`, 'success');
    } catch (err) {
      console.error('Failed to read clipboard', err);
      showToast('Erro:', 'Não foi possível ler a área de transferência', 'error');
    }
  };

  // Copy text to clipboard helper
  const handleCopyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      const preview = text.length > 50 ? `${text.substring(0, 47).trim()}...` : text;
      showToast('Copiado:', `Texto "${preview}" copiado!`, 'success');
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  // Switch like triggers and update active stored Message list
  const handleLikeMessage = (msgId, value) => {
    const currentLike = likeStates[msgId] || 0;
    const finalValue = currentLike === value ? 0 : value;

    setLikeStates(prev => ({
      ...prev,
      [msgId]: finalValue,
    }));

    const activeMsgs = SessionStorageManager.getActiveMessages();
    const updated = activeMsgs.map(m => {
      if (m.id === msgId) {
        return { ...m, like: finalValue };
      }
      return m;
    });
    SessionStorageManager.saveActiveMessages(updated);
    setMessages(updated);
  };

  // Paste message submission
  const handleSendQuery = async (e) => {
    if (e) e.preventDefault();
    if (promptText.trim().length === 0 || isThinking) return;

    const userPrompt = promptText.trim();
    setPromptText('');
    showToast('Envio:', 'Mensagem sendo enviada...', 'info');

    const contextAtStr = new Date().toLocaleString('pt-BR');
    const cateName = categories[selectedCategoryIndex] || 'Todos';

    // Settings retrieval
    const scoreVal = parseFloat(localStorage.getItem(KEYS.SCORE) || '75');
    const parsedScore = (180 - scoreVal) / 100;
    const tempVal = parseFloat(localStorage.getItem(KEYS.TEMPERATURE) || '0.5');
    const quantityVal = parseInt(localStorage.getItem(KEYS.QUANTITY) || '8', 10);
    const influenceVal = parseInt(localStorage.getItem(KEYS.INFLUENCE) || '2', 10);
    const memoryVal = parseInt(localStorage.getItem(KEYS.MEMORY) || '4', 10);
    const thinkingVal = localStorage.getItem(KEYS.THINKING) === 'true';

    // 1. Create a user message payload
    const userMsgId = Math.random().toString(36).substring(2, 10);
    const userMsg = {
      id: userMsgId,
      role: 'user',
      content: userPrompt,
      times: {
        created_at: contextAtStr,
      }
    };

    // Update state and active messages list
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    SessionStorageManager.saveActiveMessages(updatedMsgs);

    // 2. Fetch context
    setIsThinking(true);
    let contexts = [];

    // Query combination including assistants base prompt history
    const assistPrompts = updatedMsgs
      .filter(m => m.role === 'assistant' && m.contexts && m.contexts.length > 0)
      .slice(-influenceVal)
      .map(m => m.prompt || m.content)
      .join('\n');
    const combinedQuery = assistPrompts ? `${assistPrompts}\n${userPrompt}` : userPrompt;

    try {
      const contextUrl = `${baseUrl}:8000/context`;
      const contextRes = await fetch(contextUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: combinedQuery,
          score: parsedScore,
          cate: cateName,
          k: quantityVal,
        }),
      });

      if (contextRes.ok) {
        contexts = await contextRes.json();
      }
    } catch (err) {
      console.warn('Categories/Context server not active. Simulating empty contexts.', err);
    }

    // 3. Setup message list to send to Ollama API
    const systemPromptList = updatedMsgs.filter(m => m.role === 'system');
    const historyPromptList = updatedMsgs.filter(m => m.role !== 'system').slice(-memoryVal);

    // Format query text for Ollama
    const inlineContextText = contexts.length > 0
      ? `\nContextos:\n${contexts.map(c => ` - "${c.content}"`).join('\n')}`
      : '\n(Nenhum contexto encontrado)';

    const ollamaMessages = [
      ...systemPromptList.map(m => ({ role: m.role, content: m.content })),
      ...historyPromptList.map(m => ({ role: m.role, content: m.content })),
      {
        role: 'user',
        content: `Pergunta: ${userPrompt}${inlineContextText}`,
      },
    ];

    const thinkAtStr = new Date().toLocaleString('pt-BR');
    const assistantMsgId = Math.random().toString(36).substring(2, 10);
    let currentAssistantContent = '';

    // Create an empty assistant message as placeholder
    const initAssistantMsg = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      model: currentModel,
      up_tokens: 0,
      dw_tokens: 0,
      file: cateName,
      score: parsedScore,
      temperature: tempVal,
      thinking: thinkingVal,
      quantity: quantityVal,
      memory: memoryVal,
      influence: influenceVal,
      contexts: contexts,
      prompt: userPrompt,
      times: {
        context_at: contextAtStr,
        think_at: thinkAtStr,
        created_at: new Date().toLocaleString('pt-BR'),
      },
    };

    setMessages(prev => [...prev, initAssistantMsg]);

    try {
      const ollamaChatUrl = `${baseUrl}:11434/api/chat`;
      const ollamaRes = await fetch(ollamaChatUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: currentModel,
          think: thinkingVal,
          messages: ollamaMessages,
          options: {
            temperature: tempVal,
          },
        }),
      });

      if (!ollamaRes.body) {
        throw new Error('ReadableStream of prompt response is not available');
      }

      const reader = ollamaRes.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value);
        const lines = chunkText.split('\n');

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.done) {
              const finishAtStr = new Date().toLocaleString('pt-BR');
              setMessages(prev => {
                const output = prev.map(m => {
                  if (m.id === assistantMsgId) {
                    return {
                      ...m,
                      up_tokens: parsed.prompt_eval_count,
                      dw_tokens: parsed.eval_count,
                      times: {
                        ...m.times,
                        finish_at: finishAtStr,
                      },
                    };
                  }
                  return m;
                });
                SessionStorageManager.saveActiveMessages(output);
                return output;
              });

              // Increment local dynamic tokens stats per model
              const currentTokensStats = getStorageJson(KEYS.TOKENS, {});
              const activeModelStats = currentTokensStats[currentModel] || { up_tokens: 0, dw_tokens: 0 };
              currentTokensStats[currentModel] = {
                up_tokens: (activeModelStats.up_tokens || 0) + (parsed.prompt_eval_count || 0),
                dw_tokens: (activeModelStats.dw_tokens || 0) + (parsed.eval_count || 0),
              };
              setStorageJson(KEYS.TOKENS, currentTokensStats);

            } else if (parsed.message?.content) {
              currentAssistantContent += parsed.message.content;
              setMessages(prev =>
                prev.map(m => {
                  if (m.id === assistantMsgId) {
                    return { ...m, content: currentAssistantContent };
                  }
                  return m;
                })
              );
            }
          } catch (e) {
            console.warn('JSON line parse chunk issue: ', e);
          }
        }
      }
    } catch (err) {
      console.error('Ollama communication error', err);
      showToast('Erro:', 'Falha de comunicação com o Ollama', 'error');
      // Update template content with mistake indication
      setMessages(prev =>
        prev.map(m => {
          if (m.id === assistantMsgId) {
            return {
              ...m,
              content: 'Erro: O modelo do Ollama está inacessível. Certifique-se de que o host Ollama local está ativo ou edite a API nas configurações.',
            };
          }
          return m;
        })
      );
    } finally {
      setIsThinking(false);
    }
  };

  // Keyboard shortcut layout
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  const activeMessages = messages.filter(m => m.role !== 'system');

  return (
    <div className="flex-1 flex flex-col h-[calc(100dvh-64px)] overflow-hidden relative" id="chat-container">
      {/* Messages Stream Container */}
      <div className="flex-grow overflow-y-auto custom-scrollbar p-4 sm:p-8 lg:px-16 space-y-8 scroll-smooth pb-32">
        {activeMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg text-white mb-6">
              {/* <Sparkles className="w-8 h-8" /> */}
              <span>i</span>
            </div>
            <h3 className="text-xl font-headline-md text-slate-800 font-bold mb-2">
              Bem-vindo ao Chat IA
            </h3>
            <p className="text-sm text-slate-500 max-w-sm">
              Conecte-se com modelos Ollama locais, processe buscas de contexto e aproveite uma modelagem de raciocínio avançada.
            </p>
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
            {activeMessages.map((msg) => {
              const isUser = msg.role === 'user';
              if (isUser) {
                return (
                  <div key={msg.id} className="flex flex-col items-end group animate-fade-in" id={`msg_usr_${msg.id}`}>
                    <div className="max-w-[80%] flex items-start gap-4 flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-xs font-semibold">User</span>
                      </div>
                      <div className="relative">
                        <div className="border-l-4 border-primary pl-4 py-1 text-justify">
                          <div
                            className="text-on-surface leading-relaxed text-sm font-medium content break-words whitespace-pre-line"
                            dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(msg.content) }}
                          />
                        </div>
                        <span className="text-[10px] text-on-surface-variant mt-2 block opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                          {msg.times?.created_at || new Date().toLocaleTimeString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyText(msg.content)}
                        className="cursor-pointer p-1.5 hover:bg-surface-container rounded-md transition-colors text-outline hover:text-on-background opacity-0 group-hover:opacity-100 active:scale-90"
                        title="Copiar texto"
                      >
                        {/* <Copy className="w-4 h-4" /> */}
                        <span>m</span>
                      </button>
                    </div>
                  </div>
                );
              } else {
                // Assistant Message rendering
                const ctxs = msg.contexts || [];
                const firstCtx = ctxs[0];
                const lastCtx = ctxs[ctxs.length - 1];
                const contextSummary = firstCtx
                  ? ` | contextos: ${ctxs.length}, max: ${Math.round(180 - firstCtx.score * 100)}, min: ${Math.round(180 - lastCtx.score * 100)}`
                  : '';

                const renderedHtml = renderMarkdownToHtml(msg.content);

                return (
                  <div key={msg.id} className="flex flex-col items-start group animate-fade-in" id={`msg_ia_${msg.id}`}>
                    <div className="max-w-[95%] sm:max-w-[85%] sm:flex sm:items-start gap-2 space-y-2 sm:space-y-0">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-1 shadow-md shadow-primary/10">
                        {/* <Sparkles className="w-4 h-4 text-white" /> */}
                        <span>j</span>
                      </div>
                      
                      <div className="bg-white rounded-lg rounded-tl-none p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-outline-variant/50">
                        <div className="prose prose-sm max-w-none text-justify">
                          <div
                            className="text-on-surface content break-words space-y-2 [&>ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&>table]:w-full [&>table]:border-collapse [&_th]:border-b [&_td]:border-b [&_th]:p-2 [&_td]:p-2 [&_th]:text-left [&_pre]:bg-slate-50 [&_pre]:p-3 [&_pre]:rounded-md"
                            dangerouslySetInnerHTML={{ __html: renderedHtml }}
                          />
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <button
                            onClick={() => handleLikeMessage(msg.id, 1)}
                            className={`cursor-pointer p-1.5 hover:bg-surface-container rounded-md transition-all active:scale-90 ${
                              likeStates[msg.id] === 1 ? 'text-green-500 scale-105' : 'text-outline hover:text-on-background'
                            }`}
                            title="Gostei"
                          >
                            {/* <ThumbsUp className="w-4 h-4" /> */}
                            <span>o</span>
                          </button>
                          
                          <button
                            onClick={() => handleLikeMessage(msg.id, -1)}
                            className={`cursor-pointer p-1.5 hover:bg-surface-container rounded-md transition-all active:scale-90 ${
                              likeStates[msg.id] === -1 ? 'text-red-500 scale-105' : 'text-outline hover:text-on-background'
                            }`}
                            title="Não gostei"
                          >
                            {/* <ThumbsDown className="w-4 h-4" /> */}
                            <span>p</span>
                          </button>
                          
                          <button
                            onClick={() => handleCopyText(msg.content)}
                            className="cursor-pointer p-1.5 hover:bg-surface-container rounded-md transition-colors text-outline hover:text-on-background active:scale-90"
                            title="Copiar texto"
                          >
                            {/* <Copy className="w-4 h-4" /> */}
                            <span>n</span>
                          </button>
                          
                          <span className="text-[10px] text-on-surface-variant/80 font-semibold mb-0">
                            {msg.times?.created_at || new Date().toLocaleTimeString()}
                          </span>
                          
                          <button
                            onClick={() => {
                              setSelectedMsgId(msg.id);
                              setView('detail');
                            }}
                            className="text-[10px] text-primary hover:underline font-bold transition-all focus:outline-none cursor-pointer"
                          >
                            detalhes
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-2 sm:ml-12 text-[10px] text-on-surface-variant mt-2 block opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      <span className="tokens">
                        tokens enviados: {msg.up_tokens || 0} | tokens recebidos: {msg.dw_tokens || 0}
                      </span>
                      {contextSummary}
                    </div>
                  </div>
                );
              }
            })}
            
            {/* Real assistant thinking indicator */}
            {isThinking && (
              <div className="flex items-start gap-4 animate-pulse duration-1000" id="thinking-placeholder">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-1 opacity-50 shadow-md">
                  {/* <Sparkles className="w-4 h-4 text-white" /> */}
                  <span>k</span>
                </div>
                <div className="bg-primary-container text-on-primary-container rounded-full px-4 py-2 flex items-center gap-2.5 shadow-sm border border-primary/10">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-300" />
                  </div>
                  <span className="text-xs font-bold font-sans">
                    <span className="uppercase">{currentModel}</span> está processando...
                  </span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area positioned fixed above bottom screen boundary */}
      <div className="absolute bottom-0 right-0 left-0 p-4 sm:px-12 lg:px-24 bg-gradient-to-t from-background via-background/95 to-transparent z-15">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-outline-variant focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-300">
            <form onSubmit={handleSendQuery}>
              <div className="flex items-center gap-2 px-2 py-1">
                <button
                  type="button"
                  onClick={handlePasteClippedText}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-all cursor-pointer font-bold shrink-0 active:scale-95"
                  title="Colar da área de transferência"
                >
                  {/* <FileText className="w-5 h-5 text-gray-500" /> */}
                  <span>q</span>
                </button>
                
                <textarea
                  ref={textareaRef}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isThinking}
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm py-2 px-1 resize-none h-11 pointer-events-auto custom-scrollbar placeholder:text-outline text-on-surface font-medium outline-none"
                  placeholder="Escreva a mensagem a ser enviada ao Assistente"
                  rows={2}
                />
                
                <button
                  type="submit"
                  disabled={promptText.trim().length === 0 || isThinking}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all shrink-0 cursor-pointer ${
                    promptText.trim().length === 0 || isThinking
                      ? 'bg-slate-350 text-slate-400 opacity-60 shadow-none cursor-not-allowed'
                      : 'bg-primary text-white shadow-primary/20 hover:bg-primary-dim hover:scale-105 active:scale-95'
                  }`}
                  title="Enviar"
                >
                  {/* <Send className="w-4 h-4" /> */}
                  <span>l</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
