from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma

# define o modelo de embedding
embeddings = OllamaEmbeddings(model="embeddinggemma:300m", base_url="http://ollama:11434")

# permite que o modelo acesse o banco de vetores
vector_store = Chroma(
  collection_name="documents",
  embedding_function=embeddings,
  persist_directory="./teste",
)



###############################################################################
# insere documento no banco
###############################################################################

# bibliotecas auxiliares para inserção de pdf
import PyPDF2
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

# arquivo
path = "./docs/OEE/Aplicação de Cáclulos O.E.E.pdf"

with open(path, "rb") as f:
  pdf = PyPDF2.PdfReader(f)
  docs = []
  # extrair
  for p in pdf.pages:
    docs.append(Document(
      page_content=p.extract_text(),
      metadata={ "source": path }))
  # dividir
  splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=100,
  )
  # adicionar
  vector_store.add_documents(documents=splitter.split_documents(docs))



###############################################################################
# recupera contexto
###############################################################################

# pergunta
query = "o que é o cálculo o.e.e?"

# lista de contextos de acordo com a similaridade
result = vector_store.similarity_search_with_score(query, k=5)

# exibição
for doc, score in result:
  print(f"content:  {doc.page_content.strip()[:100].replace("\n", " ")}...")
  print(f"metadata: {doc.metadata}", "\nscore:", score, "\n")



###############################################################################
# visualizando o vetor
###############################################################################

import ollama
client = ollama.Client(host="http://ollama:11434")
response = client.embed(model="embeddinggemma:300m", input=query)
vector = response["embeddings"][0]



###############################################################################
# acessar um modelo 1
###############################################################################

import ollama
client = ollama.Client(host="http://ollama:11434")

stream = client.chat("gemma3:1b", messages=[{ "role": "user", "content": "Por que o céu é azul?" }], stream=True)

for part in stream:
  print(part.message.content, end='', flush=True)



###############################################################################
# acessar um modelo 2
###############################################################################

import ollama

client = ollama.Client(host="http://ollama:11434")

messages = [{
  "role": "system",
  "content": "O usuário irá fornecer um contexto, e você é um especialista no assunto deste contexto. Você deve criar diversas perguntas para testar um Modelo Linguagem Natura (LLM) de acordo com o contexto fornecido. Crie a quantidade de perguntas solicitadas sempre em português. Não acrescente mais nada que não seja as perguntas solicidades."
},{
  "role": "user",
  "content": f"crie 5 perguntas EM PORTUGUÊS sobre o contexto abaixo: \n\n{"\n\n".join([d.page_content for d in docs])}",
},]

stream = client.chat("gemma3:1b", messages=messages, stream=True, think=False)

for part in stream:
  print(part.message.content, end='', flush=True)

print()




###############################################################################

import ollama
import PyPDF2
import os
import re
from datetime import datetime
print("ini:", datetime.now().strftime("%H:%M:%S"))

client = ollama.Client(host="http://ollama:11434")

for root, dirs, files in os.walk('./docs'):
  for file in files:
    path = os.path.join(root, file)
    if os.path.splitext(path)[1] == ".pdf":
      print(path, " - ", datetime.now().strftime("%H:%M:%S"))
      contexts = []
      context = ""
      with open(path, "rb") as f:
        pdf = PyPDF2.PdfReader(f)
        for p in pdf.pages:
          content = p.extract_text()
          content = re.sub(r'\n\s{2,}', "\n ", content)
          content = re.sub(r'\s{2,}', " ", content)
          context += content
          if len(context) > 10000:
            contexts.append(context)
            context = content[-300:]
      contexts.append(context)
      for context in contexts:
        print("\n", "-" * 120, "\n")
        # print(context)
        messages = [{
          "role": "system",
          "content": "O usuário irá fornecer um contexto, e você é um especialista no assunto deste contexto. Você deve criar diversas perguntas para testar um Modelo Linguagem Natura (LLM) de acordo com o contexto fornecido. Crie a quantidade de perguntas solicitadas sempre em português e sem formatação. Não acrescente mais nada que não seja as perguntas solicidades."
        },{
          "role": "user",
          "content": f"crie 2 perguntas EM PORTUGUÊS sobre o contexto abaixo: \n\n{context}",
        },]
        stream = client.chat("ssfdre38/gemma4-nano:e4b", messages=messages, stream=True, think=False)
        for part in stream:
          print(part.message.content, end='', flush=True)
        print()

print("fim:", datetime.now().strftime("%H:%M:%S"))



