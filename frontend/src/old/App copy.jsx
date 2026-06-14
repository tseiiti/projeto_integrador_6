/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import ChatView from './components/ChatView.jsx';
import ConfigView from './components/ConfigView.jsx';
import DetailView from './components/DetailView.jsx';
import ManageView from './components/ManageView.jsx';
import {
  KEYS,
  SessionStorageManager,
  resolveBaseUrl,
  getStorageJson,
  setStorageJson,
} from './lib/storage.js';
// import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('chat');
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  
  // Storage states
  const [messages, setMessages] = useState([]);
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState('');
  const [categories, setCategories] = useState(['Todos']);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  
  // Custom API configuration
  const [baseUrl, setBaseUrlState] = useState('');

  // Toast system state
  const [toast, setToast] = useState({
    show: false,
    title: '',
    text: '',
    type: 'success',
  });

  // Load baseline on mount
  useEffect(() => {
    // Determine Base URL
    const initialBaseUrl = getStorageJson('c_base_url', resolveBaseUrl());
    setBaseUrlState(initialBaseUrl);

    // Initial messages load
    setMessages(SessionStorageManager.getActiveMessages());
    
    // Ensure all localStorage parameters are populated with defaults
    setStorageJson(KEYS.QUANTITY, getStorageJson(KEYS.QUANTITY, 8));
    setStorageJson(KEYS.INFLUENCE, getStorageJson(KEYS.INFLUENCE, 2));
    setStorageJson(KEYS.SCORE, getStorageJson(KEYS.SCORE, 75));
    if (localStorage.getItem(KEYS.THINKING) === null) {
      localStorage.setItem(KEYS.THINKING, 'false');
    }
    setStorageJson(KEYS.MEMORY, getStorageJson(KEYS.MEMORY, 4));
    setStorageJson(KEYS.TEMPERATURE, getStorageJson(KEYS.TEMPERATURE, 0.5));
  }, []);

  // Fetch Ollama models & context categories
  useEffect(() => {
    if (!baseUrl) return;

    const fetchAllApiDetails = async () => {
      // 1. Fetch tags
      try {
        const tagsUrl = `${baseUrl}:11434/api/tags`;
        const res = await fetch(tagsUrl);
        if (res.ok) {
          const data = await res.json();
          const filteredModels = (data.models || [])
            .filter((m) => !m.capabilities?.includes('embedding'))
            .sort((a, b) => a.name.localeCompare(b.name));
          
          setModels(filteredModels);

          // Select current active model
          const savedModel = getStorageJson(KEYS.C_MODEL, '');
          if (savedModel && filteredModels.some(m => m.model === savedModel)) {
            setCurrentModel(savedModel);
          } else if (filteredModels.length > 0) {
            // Check if gemma3:1b exists
            const gemmaModel = filteredModels.find(m => m.model.includes('gemma3:1b'));
            const defaultModel = gemmaModel ? gemmaModel.model : filteredModels[0].model;
            setCurrentModel(defaultModel);
            setStorageJson(KEYS.C_MODEL, defaultModel);
          }
        }
      } catch (e) {
        console.warn('Ollama tags endpoint is offline or unavailable', e);
      }

      // 2. Fetch context categories list
      try {
        const categoriesUrl = `${baseUrl}:8000/categories`;
        const res = await fetch(categoriesUrl);
        if (res.ok) {
          const data = await res.json();
          setCategories(['Todos', ...data]);
        }
      } catch (e) {
        console.warn('Context categories server is offline or unavailable', e);
      }
    };

    fetchAllApiDetails();
  }, [baseUrl]);

  // Save base URL state to localStorage when altered
  const setBaseUrl = (newUrl) => {
    setBaseUrlState(newUrl);
    setStorageJson('c_base_url', newUrl);
  };

  // Trigger Toast Notification helper
  let toastTimerId;
  const showToast = (title, text, type = 'success') => {
    setToast({ show: true, title, text, type });
    clearTimeout(toastTimerId);
    toastTimerId = setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  return (
    <div className="font-body overflow-hidden h-screen bg-background select-none flex flex-col pt-16">
      {/* Universal Top Navigation Shell */}
      <Header
        view={view}
        setView={setView}
        categories={categories}
        selectedCategoryIndex={selectedCategoryIndex}
        setSelectedCategoryIndex={setSelectedCategoryIndex}
        currentModel={currentModel}
        onBack={() => {
          setSelectedMsgId(null);
          setView('chat');
        }}
      />

      {/* Main interactive panel canvas with transitions */}
      <main className="flex-1 w-full h-[calc(100dvh-64px)] relative flex flex-col glow-accent overflow-hidden">
        {view === 'chat' && (
          <ChatView
            messages={messages}
            setMessages={setMessages}
            currentModel={currentModel}
            categories={categories}
            selectedCategoryIndex={selectedCategoryIndex}
            baseUrl={baseUrl}
            showToast={showToast}
            setView={setView}
            setSelectedMsgId={setSelectedMsgId}
          />
        )}

        {view === 'config' && (
          <ConfigView
            models={models}
            currentModel={currentModel}
            setCurrentModel={(mod) => {
              setCurrentModel(mod);
              setStorageJson(KEYS.C_MODEL, mod);
            }}
            baseUrl={baseUrl}
            setBaseUrl={setBaseUrl}
            messages={messages}
            setMessages={setMessages}
            showToast={showToast}
            setView={setView}
          />
        )}

        {view === 'detail' && (
          <DetailView
            userId={selectedMsgId}
            messages={messages}
            setView={setView}
            setSelectedMsgId={setSelectedMsgId}
          />
        )}

        {view === 'manage' && (
          <ManageView
            models={models}
            baseUrl={baseUrl}
            showToast={showToast}
            setView={setView}
          />
        )}
      </main>

      {/* High contrast custom Toast Alert notifications (Success, Info, Error) */}
      <div
        className={`fixed bottom-6 right-6 z-55 max-w-sm rounded-xl p-4 shadow-xl flex items-start gap-3 border transition-all duration-300 transform ${
          toast.show ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-12 opacity-0 pointer-events-none'
        } ${
          toast.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-800'
            : toast.type === 'info'
            ? 'bg-blue-50 border-blue-200 text-blue-800'
            : 'bg-green-50 border-green-200 text-green-800'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {toast.type === 'error' ? (
            // <AlertCircle className="w-5 h-5 text-red-500" />
            <span>a</span>
          ) : toast.type === 'info' ? (
            // <Info className="w-5 h-5 text-blue-500" />
            <span>b</span>
          ) : (
            // <CheckCircle className="w-5 h-5 text-green-500" />
            
            <span>c</span>
          )}
        </div>
        
        <div className="space-y-0.5">
          <p className="font-bold text-xs sm:text-sm font-sans tracking-wide leading-tight">
            {toast.title}
          </p>
          <p className="text-[11px] sm:text-xs leading-normal opacity-90 font-medium">
            {toast.text}
          </p>
        </div>
      </div>
    </div>
  );
}
