/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const KEYS = {
  BACKUP: 'backup',
  C_CHAT: 'c_chat',
  MESSAGES: 'messages',
  C_MODEL: 'c_model',
  TOKENS: 'tokens',
  QUANTITY: 'quantity',
  INFLUENCE: 'influence',
  SCORE: 'score',
  THINKING: 'thinking',
  MEMORY: 'memory',
  TEMPERATURE: 'temperature',
};

export const DEFAULT_SYSTEM_MESSAGE = {
  id: 'system_init',
  role: 'system',
  content: 'O usuário deve enviar o contexto, caso o contexto não seja informado, não responda. Diga que a pergunta deve ser sobre o Sistema EGA Soluções Industriais. Responda a pergunta com base no contexto e no histórico de mensagens. Ainda, caso o contexto não seja encontrado, informe que é possível reduzir o score, mas acarreta na degradação da precisão do contexto. E você é um especialista no assunto deste contexto. A resposta deve ser SEMPRE EM PORTUGUÊS, bem elaborado, completo, em poucos parágrafos fluidos. Sem qualquer formatação, a menos que esteja explícito outro formato na pergunta.'
};

export const resolveBaseUrl = () => {
  if (typeof window === 'undefined') return 'https://tseiiti.duckdns.org';
  const hostname = window.location.hostname || '';
  if (hostname.startsWith('192.168.') || hostname.startsWith('localhost') || hostname === '127.0.0.1') {
    return `${window.location.protocol}//${hostname}`;
  }
  return 'https://tseiiti.duckdns.org';
};

// Storage helper functions
export const getStorageJson = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStorageJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing to localStorage', e);
  }
};

export class SessionStorageManager {
  static getBackups() {
    return getStorageJson(KEYS.BACKUP, []);
  }

  static saveBackups(backups) {
    setStorageJson(KEYS.BACKUP, backups);
  }

  static getActiveMessages() {
    const msgs = getStorageJson(KEYS.MESSAGES, [DEFAULT_SYSTEM_MESSAGE]);
    // Ensure system message exists
    if (msgs.length === 0 || msgs[0].role !== 'system') {
      return [DEFAULT_SYSTEM_MESSAGE, ...msgs.filter(m => m.id !== 'system_init')];
    }
    return msgs;
  }

  static saveActiveMessages(messages) {
    setStorageJson(KEYS.MESSAGES, messages);
  }

  static addBackup(chat, currentId) {
    const backups = this.getBackups();
    const cleanMsgs = chat.messages || '[]';
    
    // Check if we updating existing or inserting new
    let existingIndex = -1;
    if (currentId) {
      existingIndex = backups.findIndex(b => b.id === currentId);
    }

    let payload;
    if (existingIndex !== -1) {
      payload = {
        ...backups[existingIndex],
        ...chat,
        messages: cleanMsgs,
        times: {
          ...backups[existingIndex].times,
        }
      };
      backups[existingIndex] = payload;
    } else {
      const generatedId = Math.random().toString(36).substring(2, 10);
      payload = {
        id: generatedId,
        messages: cleanMsgs,
        c_model: chat.c_model || '',
        tokens: chat.tokens || '{}',
        quantity: chat.quantity ?? 8,
        score: chat.score ?? 75,
        temperature: chat.temperature ?? 0.5,
        thinking: chat.thinking ?? false,
        title: chat.title || '',
        times: {
          created_at: new Date().toLocaleString('pt-BR'),
        }
      };
      backups.push(payload);
    }

    this.saveBackups(backups);
    return payload;
  }

  static deleteBackup(id) {
    const backups = this.getBackups();
    const filtered = backups.filter(b => b.id !== id);
    this.saveBackups(filtered);
  }

  static updateBackupTitle(id, newTitle) {
    const backups = this.getBackups();
    const index = backups.findIndex(b => b.id === id);
    if (index !== -1) {
      backups[index].title = newTitle;
      this.saveBackups(backups);
    }
  }
}
