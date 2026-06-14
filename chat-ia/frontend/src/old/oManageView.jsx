/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
// import { RefreshCw, ToggleLeft, ToggleRight, ArrowLeft } from 'lucide-react';

export default function ManageView({
  models,
  baseUrl,
  showToast,
  setView,
}) {
  const [activeModels, setActiveModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Poll status of running models inside Ollama (Ollama's /api/ps)
  const fetchActiveModels = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const psUrl = `${baseUrl}:11434/api/ps`;
      const res = await fetch(psUrl);
      if (res.ok) {
        const data = await res.json();
        setActiveModels(data.models || []);
      }
    } catch (e) {
      console.warn('Ollama PS check is unavailable', e);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  // Run poll on load, and set a 10-second interval (as in the original setInterval)
  useEffect(() => {
    fetchActiveModels();

    const intervalId = setInterval(() => {
      fetchActiveModels(true);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [baseUrl]);

  // Toggle model loaded state in Ollama
  const handleToggleStatus = async (modelName) => {
    const isCurrentlyLoaded = activeModels.some(m => m.model === modelName);
    setIsLoading(true);

    try {
      if (isCurrentlyLoaded) {
        // Unload the model by sending a generate call with keep_alive: 0
        showToast('Ollama:', `Liberando o modelo ${modelName} da memória...`, 'info');
        const genUrl = `${baseUrl}:11434/api/generate`;
        await fetch(genUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: modelName,
            keep_alive: 0,
          }),
        });
        showToast('Sucesso:', `Modelo ${modelName} liberado das RAMs.`, 'success');
      } else {
        // Warm/Load the model by sending a light chat query (or prompt: "")
        showToast('Ollama:', `Ativando o modelo ${modelName} na VRAM (isso pode levar alguns segundos)...`, 'info');
        const chatUrl = `${baseUrl}:11434/api/chat`;
        await fetch(chatUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: modelName,
            prompt: '',
          }),
        });
        showToast('Sucesso:', `Modelo ${modelName} aquecido e carregado!`, 'success');
      }
      
      // Delay slightly and refresh state
      setTimeout(() => {
        fetchActiveModels();
      }, 1000);

    } catch (err) {
      console.error('Error toggling model status', err);
      showToast('Erro:', `Não foi possível alterar o estado do modelo ${modelName}.`, 'error');
      setIsLoading(false);
    }
  };

  return (
    <section className="flex-grow overflow-y-auto custom-scrollbar bg-background p-4 max-w-[1376px] mx-auto w-full h-[calc(100dvh-64px)] pb-16">
      <div className="px-0 sm:px-4 lg:px-12 max-w-4xl mx-auto space-y-6">
        
        {/* Card header */}
        <div className="bg-white border border-outline-variant rounded-xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              {/* <RefreshCw className={`w-5 h-5 text-primary ${isLoading ? 'animate-spin' : ''}`} /> */}
              <span>r</span>
              <h2 className="font-headline-md text-slate-800 font-bold text-base leading-normal">
                Status das RAMs e Modelos Carregados
              </h2>
            </div>

            <button
              onClick={() => fetchActiveModels()}
              disabled={isLoading}
              className="text-xs flex items-center gap-1.5 text-primary hover:underline hover:scale-105 active:scale-95 transition-all outline-none font-bold cursor-pointer"
            >
              {/* <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> */}
              <span>s</span> Atualizar
            </button>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mb-4">
            Abaixo estão listados todos os modelos registrados em seu Ollama. Os que possuem status <span className="text-lime-500 font-bold">Ativo</span> estão carregados na memória de vídeo (VRAM/RAM) do sistema, respondendo instantaneamente a novos prompts. Clique nos interruptores para liberá-los ou aquecê-los manualmente.
          </p>

          <div className="not-prose overflow-auto rounded-xl border border-slate-100">
            <table className="w-full table-auto border-collapse text-xs sm:text-sm min-w-[500px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-left font-medium text-slate-500 leading-normal">Identificador do Modelo</th>
                  <th className="p-4 text-left font-medium text-slate-500 leading-normal">Tamanho do Arquivo</th>
                  <th className="p-4 text-left font-medium text-slate-500 leading-normal">Parâmetros</th>
                  <th className="p-4 text-center font-medium text-slate-500 leading-normal">Estado de Alocação</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {models.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 text-xs">
                      Nenhum modelo disponível para gerenciar no Ollama. Connecte um servidor Ollama ativo.
                    </td>
                  </tr>
                ) : (
                  models.map((mod) => {
                    const isLoaded = activeModels.some(m => m.model === mod.model);
                    const sizeMb = (mod.size / (1024 * 1024)).toFixed(0);
                    const paramSize = mod.details?.parameter_size || 'N/A';

                    return (
                      <tr key={mod.model} className="hover:bg-slate-50/50 transition-colors animate-fade-in">
                        <td className="p-4 font-semibold text-slate-800 leading-normal">{mod.model}</td>
                        <td className="p-4 text-slate-500 font-mono font-bold leading-normal">{sizeMb} MB</td>
                        <td className="p-4 text-slate-505 font-bold leading-normal">{paramSize}</td>
                        <td className="p-4 leading-normal">
                          <button
                            onClick={() => handleToggleStatus(mod.model)}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center transition-all cursor-pointer focus:outline-none"
                            title={isLoaded ? "Liberar da RAM" : "Aquecer e alocar na RAM"}
                          >
                            {isLoaded ? (
                              // <ToggleRight className="w-10 h-10 text-lime-500 hover:scale-105 active:scale-95 transition-all outline-none" />
                              <span>v</span>
                            ) : (
                              // <ToggleLeft className="w-10 h-10 text-red-400 hover:scale-105 active:scale-95 transition-all outline-none" />
                              <span>t</span>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer redirection elements */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => setView('config')}
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1.5 px-8 border border-blue-500 hover:border-transparent rounded-lg transition-transform focus:outline-none cursor-pointer active:scale-95 flex items-center gap-1"
          >
            {/* <ArrowLeft className="w-4 h-4" /> */}
            <span>x</span> Voltar
          </button>
        </div>

      </div>
    </section>
  );
}
