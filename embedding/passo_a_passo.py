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

# bibliotecas auxiliares para inserção
import PyPDF2
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

# arquivo
path = "./docs/Aplicacao_de_Caclulos_OEE.pdf"

with open(path, "rb") as f:
  pdf = PyPDF2.PdfReader(f)
  docs = []
  for p in pdf.pages:
    docs.append(Document(
      page_content=p.extract_text(),
      metadata={ "source": path }))
      
  splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=100,
  )

  vector_store.add_documents(documents=splitter.split_documents(docs))


# pergunta
query = "o que é o cálculo o.e.e?"

# lista de contextos de acordo com a similaridade
result = vector_store.similarity_search_with_score(
  query, 
  k=6, )

# exibição
for doc, score in result:
  print(f"content:  {doc.page_content[:100].replace("\n", " ")}...")
  print(f"metadata: {doc.metadata}", "\n")
