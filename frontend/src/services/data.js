const BASE = ['192.168.', 'localhos'].includes(window.location.hostname.substring(0, 8)) ?
  `${window.location.protocol}//${window.location.hostname}` :
  'https://tseiiti.duckdns.org';

const KEYS = {
  BACKUP:         'backup',
  C_CHAT:         'c_chat',
  MESSAGES:       'messages',
  MODELS:         'models',
  CURRENT:        'current',
  TOKENS:         'tokens',
  QUANTITY:       'quantity',
  INFLUENCE:      'influence',
  SCORE:          'score',
  THINKING:       'thinking',
  MEMORY:         'memory',
  TEMPERATURE:    'temperature',
  CONF:           'conf',
  API_CHAT_URL:   `${BASE}:11434/api/chat`,
  API_TAGS_URL:   `${BASE}:11434/api/tags`,
  API_PS_URL:     `${BASE}:11434/api/ps`,
  API_GEN_URL:    `${BASE}:11434/api/generate`,
  CONTEXT_URL:    `${BASE}:8000/context`,
  CATEGORIES_URL: `${BASE}:8000/categories`,
  DEFAULT_MESSAGE: {
    id: 'sys-0',
    role: 'system',
    content: 'O usuário deve enviar o contexto, caso o contexto não seja informado, não responda. Diga que a pergunta deve ser sobre o Sistema EGA Soluções Industriais. Responda a pergunta com base no contexto e no histórico de mensagens. Ainda, caso o contexto não seja encontrado, informe que é possível reduzir o score, mas acarreta na degradação da precisão do contexto. E você é um especialista no assunto deste contexto. A resposta deve ser SEMPRE EM PORTUGUÊS, bem elaborado, completo, em poucos parágrafos fluidos. Sem qualquer formatação, a menos que esteja explícito outro formato na pergunta.'
  },
  DEFAULT_CONF: {
    quantity: 8,
    influence: 2,
    score: 75,
    thinking: false,
    memory: 4,
    temperature: 0.5,
  }
}

const MENU_ITEMS = [{
  id: 'chat',
  label: 'Chat',
  icon: 'chat',
  description: 'Perguntar ao Chatbot'
}, {
  id: 'cadastros',
  label: 'Cadastros',
  icon: 'assignment',
  description: 'Gestão de tarefas e categorias'
}, {
  id: 'relatorios',
  label: 'Relatórios',
  icon: 'table_chart',
  description: 'Exportação e filtros avançados'
}, {
  id: 'config',
  label: 'Configurações',
  icon: 'settings',
  description: 'Perfil e preferências'
}];

export {
  KEYS,
  MENU_ITEMS, 
}
