
export const MENU_ITEMS = [{
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

export const MESSAGES = [
  {
    "role": "system",
    "content": "O usuário deve enviar o contexto, caso o contexto não seja informado, não responda. Diga que a pergunta deve ser sobre o Sistema EGA Soluções Industriais. Responda a pergunta com base no contexto e no histórico de mensagens. Ainda, caso o contexto não seja encontrado, informe que é possível reduzir o score, mas acarreta na degradação da precisão do contexto. E você é um especialista no assunto deste contexto. A resposta deve ser SEMPRE EM PORTUGUÊS, bem elaborado, completo, em poucos parágrafos fluidos. Sem qualquer formatação, a menos que esteja explícito outro formato na pergunta."
  },
  {
    "role": "user",
    "content": "oi",
    "id": "e96q4mt1v0q",
    "times": {
      "created_at": "12/06/2026, 20:21:04"
    }
  },
  {
    "role": "assistant",
    "content": "Olá! Como posso ajudar?\n",
    "model": "gemma3:1b",
    "up_tokens": 102,
    "dw_tokens": 8,
    "file": "Todos",
    "score": 1.05,
    "temperature": 0.5,
    "contexts": [
      {
        "content": ".. 017",
        "score": 1.003105640411377,
        "category": "PCPMaster",
        "file": "PCPMaster - Modulo III - Online & Histórico.pdf",
        "page": 2
      }
    ],
    "prompt": "oi",
    "times": {
      "context_at": "12/06/2026, 20:21:04",
      "think_at": "12/06/2026, 20:21:39",
      "created_at": "12/06/2026, 20:22:15",
      "finish_at": "12/06/2026, 20:22:16"
    },
    "id": "jkmahewwuu"
  },
  {
    "role": "user",
    "content": "Se o valor do Time Apropriado entre Falhas (MTBF) de um equipamento estiver sendo satisfeito, com maior índice demonstrando maior confiabilidade, como podemos utilizar os dados de diferentes tipos de falhas ou as informações das últimas paradas para potencializar a melhoria contínua além dapenas focar no tempo?\n",
    "id": "lyivq3l7r3s",
    "times": {
      "created_at": "12/06/2026, 20:23:29"
    }
  },
  {
    "role": "assistant",
    "content": "O usuário quer identificar como usar os dados do Time Apropriado entre Falha (MTBF) para melhorar a manutenção dos equipamentos, mesmo que o valor do MTBF esteja satisfeito e demonstrando maior confiabilidade.\n\n**Resposta:**\n\nPara otimizar a manutenção de equipamentos com base nos dados do MTBF, você pode considerar as seguintes estratégias:\n\n1.  **Análise Histórica das Falhas:** Utilize os dados históricos das falhadas para identificar padrões e causas raízes mais profundas.\n2.  **Dados de Todas as Falhas (MTTA, MTTR, MTTF):** Combine os dados de diferentes tipos de falha (MTTA, MTTR, MTTF) para obter uma visão completa do ciclo de vida do equipamento.\n3.  **Redução de Variáveis:** Em vez de focar apenas no tempo de falha, utilize informações sobre o período de disponibilidade e paradas programadas como indicadores chave da confiabilidade do equipamento. Isso pode ajudar a identificar pontos críticos que precisam de atenção especial.\n4. **Análise de Tempo de Reparo (MTTR):** O MTTR é um indicador importante para otimizar processos de manutenção, pois ele mede o tempo gasto em cada intervenção e ajuda a reduzir custos com reparos.\n5.  **Foco no Intervalo de Disponibilidade (TD - TP):** Ao analisar as informações do MTBF, você pode identificar quando o equipamento está em ponto de operação ou falha, possibilitando a implementação de estratégias de manutenção preventiva.\n\nEm resumo, utilize os dados do MTBF como ponto de partida para uma análise mais abrangente e direcionada à otimização da manutenção dos equipamentos.",
    "model": "gemma3:1b",
    "up_tokens": 892,
    "dw_tokens": 350,
    "file": "Todos",
    "score": 1.05,
    "temperature": 0.5,
    "contexts": [
      {
        "content": "exibidas as informações estatísticas do MTBF; MTTA; MTTR; MTTF. Relatório MTBF Mean Time Between Failures É o período médio entre falhas. O MTBF é um indicador da confiabilidade de um produto ou um sistema reparável. Ele mede o índice de falhas aleatórias excluindo falhas sistemáticas. Caso seja necessário mais detalhe do cálculo , por favor, consultar o manual específico do MTBF.",
        "score": 0.7314956784248352,
        "category": "EventManager",
        "file": "Event Manager - Gerenciador de Eventos.pdf",
        "page": 17
      },
      {
        "content": "[ Datas ] é possível também selecionar de modo aleatório as datas desejadas do período desejado. Em [ Áreas ] e [Equipamentos ], [Moldes ] e [Eventos ], pode -se [Marcar ], [Desmarcar ] todos os itens ou selecionar apenas os itens desejados. MTBF MTBF - Mean Time Between Failures É o período médio entre falhas. O MTBF é um indicador da confiabilidade de um produto ou um sistema reparável. Ele mede o índice de falhas aleatórias excluindo falhas sistemáticas. Caso seja necessário mais detalhe do",
        "score": 0.7621653079986572,
        "category": "PCM",
        "file": "PCM - Planejamento e Controle de Manutenção.pdf",
        "page": 19
      },
      {
        "content": "Página : 1 O EGA_ MTBF On-Line é um aplicativo desenvolvido pela EGA engenharia , o qual permite demonstrar o período médio entre as falhas , cujo valor atribuído a um determinado dispositivo ou aparelho irá descrever a sua confiabilidade. Este valor atribuído indica quando poderá ocorrer uma falha no aparelho em questão. Quanto maior for este índice, maior será a confiabilidade no equipamento e, consequentemente, a manutenção será avaliada em questões de eficiência. Este manual tem por",
        "score": 0.7851125001907349,
        "category": "MTBF",
        "file": "MTBF - Tempo Médio entre Falhas.pdf",
        "page": 2
      },
      {
        "content": "Aqui é exibido o índice de Disponibilidade do período selecionado , onde o tempo produtivo + parada não programadas é divido pelo total do tempo disponível + paradas programadas (Disponibilidade). Aqui é exibida a quantidade de paradas efetivas que ocorreram dentro do período selecionado. (Número de Paradas). Na fig ura acima é exibida a informação do MTBF. MTTA→Tempo Médio atendimento (MTTA): É o tempo médio de atendimento. MTTR→Tempo Médio Para Reparo (MTTR): É o tempo médio gasto durante uma",
        "score": 0.8122299313545227,
        "category": "MTBF",
        "file": "MTBF - Tempo Médio entre Falhas.pdf",
        "page": 11
      },
      {
        "content": "→Tempo médio de atendimento MTTF →Tempo médio para falha MTTR →Tempo médio de reparo CÁLCULOS MTBF = (TD – TP) / QR MTTA = (TP – TR) / QR MTTF = TD / QR MTTR = TR / QR",
        "score": 0.833899199962616,
        "category": "MTBF",
        "file": "MTBF - Conceitos e Regras de Calculos.pdf",
        "page": 3
      },
      {
        "content": "tempo médio de atendimento. MTTR→Tempo Médio Para Reparo (MTTR): É o tempo médio gasto durante uma intervenção no processo MTTF→Tempo Médio Entre Falhas (MTBF): É a média de tempo entre uma parada e outra Na Fig ura a cima é exibida a informação da Evolução do MTBF da máquina e período selecionado. Conforme parâmetros pré -selecionados é traçada a Meta em horas referente a evolução, note que ao arrastar o mouse é exibido a informação MTBF/HRS.",
        "score": 0.8443037271499634,
        "category": "MTBF",
        "file": "MTBF - Tempo Médio entre Falhas.pdf",
        "page": 11
      },
      {
        "content": "o índice de falhas aleatórias excluindo falhas sistemáticas. Caso seja necessário mais detalhe do cálculo, por favor, solicite a EGA o manual específico do MTBF.",
        "score": 0.8475570678710938,
        "category": "PCM",
        "file": "PCM - Planejamento e Controle de Manutenção.pdf",
        "page": 19
      },
      {
        "content": "exibidos. Veja o exemplo abaixo. Veja abaixo o resultado do novo filtro que agora é por tempo de Reparo. Sistema MTBF -Tempo Médio Entre Falhas",
        "score": 0.8771857023239136,
        "category": "MTBF",
        "file": "MTBF - Tempo Médio entre Falhas.pdf",
        "page": 13
      }
    ],
    "prompt": "Se o valor do Time Apropriado entre Falhas (MTBF) de um equipamento estiver sendo satisfeito, com maior índice demonstrando maior confiabilidade, como podemos utilizar os dados de diferentes tipos de falhas ou as informações das últimas paradas para potencializar a melhoria contínua além dapenas focar no tempo?\n",
    "times": {
      "context_at": "12/06/2026, 20:23:29",
      "think_at": "12/06/2026, 20:23:30",
      "created_at": "12/06/2026, 20:23:50",
      "finish_at": "12/06/2026, 20:24:32"
    },
    "id": "iz0e5szy4wr"
  }
];
