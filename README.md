
# Assistente Virtual Integrado - Projeto Integrador VI

O **Assistente Virtual Integrado** é um ecossistema multiplataforma inteligente baseado em arquitetura **RAG (Retrieval-Augmented Generation)**. O principal propósito do sistema é atuar como uma camada de extração e gerenciamento de conhecimento industrial a partir de documentos brutos, projetado sob medida para o cenário prático da **EGA Soluções Industriais** voltado para a Indústria 4.0 e sistemas MES (como o PCPMaster e diretrizes de cálculo de O.E.E.).

A solução responde a consultas em linguagem natural em tempo real de forma estritamente local, o que garante a privacidade, governança de dados e elimina custos com APIs de nuvem de terceiros.

---

## 📱 Frentes de Distribuição e Interfaces

O ecossistema é distribuído por múltiplos canais para atender a diferentes perfis operacionais e gerenciais:

1. **Aplicativo Mobile (Android):** Desenvolvido nativamente em **Kotlin**, projetado especificamente para que operadores e supervisores realizem consultas rápidas aos indicadores e manuais diretamente no chão de fábrica.
2. **Plataforma Web (Front-end):** Interface interativa baseada em tecnologias web padrão (HTML, CSS e JavaScript), hospedada na infraestrutura serverless da **Vercel** para sessões fluidas de chat.
3. **Camada de Integração (Back-end e APIs):** Web services REST baseados em **FastAPI** (Python), servidos por **Uvicorn** e gerenciados por um proxy reverso **NGINX**, fornecendo alta performance e suporte assíncrono.

---

## 🛠️ Arquitetura e Engenharia de Dados (RAG)

O ciclo de vida e processamento do conhecimento segue um fluxo estruturado utilizando ferramentas de código aberto:

```
[Manuais Técnicos PDF]
│
▼ (LangChain: RecursiveCharacterTextSplitter)
[Segmentação / Chunks]
│
▼ (EmbeddingGemma-300m via DeepMind)
[Vetores Numéricos]
│
▼
[Banco Vetorial ChromaDB] <───> [Busca por Similaridade de Cosseno] <─── [Prompt do Usuário]
│
▼ (Injeção de Contexto)
[Ollama: LLMs Locais]
│
▼
[Resposta em Linguagem Natural]
```

* **Ingestão:** Documentos e manuais técnicos em formato PDF passam por uma quebra de blocos (*chunks*) através do framework **LangChain**.
* **Vetorização:** Cada bloco é transformado em um vetor numérico pelo modelo open-source **EmbeddingGemma-300m**.
* **Indexação:** Os embeddings gerados são persistidos e gerenciados no banco de dados vetorial **ChromaDB**.
* **Inferência Local:** A orquestração e o gerenciamento de Large Language Models (LLMs) privados e locais ocorrem através do **Ollama**. O sistema opera de modo intercambiável dando suporte a diferentes famílias de modelos de código aberto, tais como **Gemma (Google), Llama (Meta), Mistral, Phi (Microsoft) e Qwen (Alibaba)**.

---

## 🐳 Infraestrutura e Governança de TI

* **Conteinerização com Docker:** Todo o core do back-end, o banco de dados vetorial ChromaDB e os microsserviços de IA rodam de forma totalmente isolada em contêineres Docker, assegurando portabilidade e um ambiente idêntico entre o desenvolvimento e a implantação em servidores on-premise.
* **Pipeline de Qualidade de Dados (BI & Big Data):** O projeto incorpora um pipeline de ETL automatizado encarregado de higienizar os logs de interações. As rotinas aplicam algoritmos de desduplicação de requisições causadas por instabilidades de rede na camada mobile, tratamento de valores ausentes e normalização sintática de nomenclaturas, otimizando a qualidade analítica para a geração de relatórios gerenciais e dashboards.
* **Segurança Transtecnológica:** Por rodar estritamente de forma local, o sistema blinda os segredos de negócio e dados de manufatura contra vazamentos na nuvem pública. As comunicações em formato JSON entre o aplicativo Android e o FastAPI contam com políticas rigorosas de validação de esquemas.

---

## 🚀 Como Executar o Projeto Localmente (Back-end)

### Pré-requisitos
* [Docker](https://www.docker.com/) e Docker Compose instalados.
* [Ollama](https://ollama.com/) instalado na máquina host (ou configurado para rodar via contêiner).

### Passos para inicialização

1. **Clone o repositório:**
```bash
git clone https://github.com/tseiiti/projeto_integrador_6.git
cd projeto_integrador_6
```

2. **Certifique-se de que o Ollama está ativo e baixe o modelo padrão:**
```bash
ollama run gemma3:1b
```

(Nota: O sistema aceita outros modelos configuráveis como `llama3.2:3b` ou `phi4-mini` de acordo com a capacidade do seu hardware).

3. **Anexe os manuais em pdf:**
Insira os manuais pdfs na pasta `embedding/docs`. Atualmente o sistema aceita arquivos pdf, txt, xls, csv e xlsx.

4. **Suba os contêineres da aplicação via Docker Compose:**
```bash
docker-compose up --build
```

Isso inicializará os microsserviços do back-end em **FastAPI**, o proxy **NGINX** e a instância do **ChromaDB**.
Para acessar `localhost` sem https prefira a branch **dell**

5. **Testar os End-points da API:**
Certifique-se que os end-points abaixo estão acessíveis:
- https://localhost:8000/
- https://localhost:11434/


6. **Acessar o assistente:**
Abra o seu navegador e acesse https://localhost/.


---

## ⚙️ Estrutura do Repositório

```text
├── .github/           # Workflows de CI/CD (se houver)
├── embedding/         # Código-fonte da API Python (FastAPI, LangChain)
│   ├── db/            # ChromaDB
│   └── docs           # Manuais, PDFs, XLS
├── nginx              # Configuração NGINX, Proxy Reverso, PEM private keys
├── ProjetoIntegrador6 # Android Kotlin project
│   ├── app            # Pastas android
│   └── gradle         # Pastas android
├── webpages           # Front-end, HTML, CSS, javascript
├── docker-compose.yml # Orquestração docker
├── python.dockerfile  # Configuração container python
└── README.md          # Documentação do projeto
```

---

## 👥 Autores e Desenvolvimento

Desenvolvido como parte do **Projeto Integrador VI** para validação prática de engenharia de software, arquiteturas de Big Data e Business Intelligence integradas à Inteligência Artificial na Indústria 4.0.
