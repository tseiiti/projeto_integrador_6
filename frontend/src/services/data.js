
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
    "content": "Ao gerar relatórios de MTBF, entre outras métricas, é necessário definir um padrão operacional correto para o campo \"período\" e como essa definição deve ser aplicada ao critério do indicador.\n",
    "id": "qje8el9hmis",
    "times": {
      "created_at": "17/06/2026, 09:48:35"
    }
  },
  {
    "role": "assistant",
    "content": "O contexto fornecido descreve a funcionalidade do Sistema EGA Soluções Industriais, focando em relatórios e análises relacionadas ao Tempo Médio Entre Falha (MTBF). O sistema permite a personalização da exibição de dados, incluindo filtros para selecionar datas, áreas, equipamentos e eventos relevantes. Ele também oferece opções de agrupamento e seleção de itens.  A informação é relevante para o entendimento do processo de geração de relatórios de MTBF.\n",
    "model": "gemma3:1b",
    "up_tokens": 891,
    "dw_tokens": 96,
    "file": "Todos",
    "score": 1.05,
    "temperature": 0.5,
    "thinking": false,
    "quantity": 8,
    "memory": 4,
    "influence": 2,
    "contexts": [
      {
        "content": "Página : 16 Relatório → MTBF Vá em [ Relatórios ], e escolha a opção [ MTBF ], como é exibido na figura abaixo. Na parte superior se abrirá a tela onde o usuário irá realizar a parametrização do relatório. [1-Período ] →selecione Diário; Entre Datas; Mensal, ou selecione a data desejada no calendário. [2-Filtros ] →é possível fazer filtros por ( Áreas ; Equipamentos; Eventos; Ativar ou desativar a exibição MTBF/MTTA/MTTR/MTTF ) e ainda exibir ou não, Considerar Previsto. [3-Opções do Gráfico ]",
        "score": 0.7087560892105103,
        "category": "EventManager",
        "file": "Event Manager - Gerenciador de Eventos.pdf",
        "page": 17
      },
      {
        "content": "Aqui é exibido o índice de Disponibilidade do período selecionado , onde o tempo produtivo + parada não programadas é divido pelo total do tempo disponível + paradas programadas (Disponibilidade). Aqui é exibida a quantidade de paradas efetivas que ocorreram dentro do período selecionado. (Número de Paradas). Na fig ura acima é exibida a informação do MTBF. MTTA→Tempo Médio atendimento (MTTA): É o tempo médio de atendimento. MTTR→Tempo Médio Para Reparo (MTTR): É o tempo médio gasto durante uma",
        "score": 0.8393189311027527,
        "category": "MTBF",
        "file": "MTBF - Tempo Médio entre Falhas.pdf",
        "page": 11
      },
      {
        "content": "exibidas as informações estatísticas do MTBF; MTTA; MTTR; MTTF. Relatório MTBF Mean Time Between Failures É o período médio entre falhas. O MTBF é um indicador da confiabilidade de um produto ou um sistema reparável. Ele mede o índice de falhas aleatórias excluindo falhas sistemáticas. Caso seja necessário mais detalhe do cálculo , por favor, consultar o manual específico do MTBF.",
        "score": 0.8431281447410583,
        "category": "EventManager",
        "file": "Event Manager - Gerenciador de Eventos.pdf",
        "page": 17
      },
      {
        "content": "], é possível definir como será exibido o eixo X e limitar a quantidade de itens no gráfico. Após parametrizado o período, agrupamento e demais filtros, pressione o botão [ Gerar Relatório ]. Na aba [ Visualização ] é exibido o gráfico estatístic o do MTBF; MTTA; MTTR; MTTF MTBF .",
        "score": 0.8534651398658752,
        "category": "PCM",
        "file": "PCM - Planejamento e Controle de Manutenção.pdf",
        "page": 20
      },
      {
        "content": "Página: 18 Relato rios – MTBF Na tela principal, vá em [ Relatórios ], e selecione a opção [MTBF ]. Logo se abrirá a tela com as opções de [ Filtros ], [Agrupamento ], e opção para carregar modelos de relatório salvo pelo usuário. Em [ Período ], é possível selecionar Diário; Entre Datas; Mensal, ou selecione a data desejada no calendário. Se a opção escolhida for [ Entre Datas ], através do botão [ Datas ] é possível também selecionar de modo aleatório as datas desejadas do período desejado.",
        "score": 0.8727321624755859,
        "category": "PCM",
        "file": "PCM - Planejamento e Controle de Manutenção.pdf",
        "page": 19
      },
      {
        "content": "Página : 11 →Analisando resultados em tela Sistema MTBF -Tempo Médio Entre Falhas\nNa Fig ura a cima é exibida a informação das Ultimas Paradas referente ao Período e as Maquinas selecionadas.",
        "score": 0.8842529654502869,
        "category": "MTBF",
        "file": "MTBF - Tempo Médio entre Falhas.pdf",
        "page": 12
      },
      {
        "content": "[ Datas ] é possível também selecionar de modo aleatório as datas desejadas do período desejado. Em [ Áreas ] e [Equipamentos ], [Moldes ] e [Eventos ], pode -se [Marcar ], [Desmarcar ] todos os itens ou selecionar apenas os itens desejados. MTBF MTBF - Mean Time Between Failures É o período médio entre falhas. O MTBF é um indicador da confiabilidade de um produto ou um sistema reparável. Ele mede o índice de falhas aleatórias excluindo falhas sistemáticas. Caso seja necessário mais detalhe do",
        "score": 0.8900966048240662,
        "category": "PCM",
        "file": "PCM - Planejamento e Controle de Manutenção.pdf",
        "page": 19
      }
    ],
    "prompt": "Ao gerar relatórios de MTBF, entre outras métricas, é necessário definir um padrão operacional correto para o campo \"período\" e como essa definição deve ser aplicada ao critério do indicador.\n",
    "times": {
      "context_at": "17/06/2026, 09:48:35",
      "think_at": "17/06/2026, 09:48:37",
      "created_at": "17/06/2026, 09:48:58",
      "finish_at": "17/06/2026, 09:49:07"
    },
    "id": "k3ky26zfgfq"
  }
];
