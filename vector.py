from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
import pandas as pd
import PyPDF2
import os

from config import (
  EMBEDDING_MODEL, OLLAMA_BASE_URL, CHUNK_SIZE, CHUNK_OVERLAP, 
  CHROMA_DB_PATH, STORAGE_PATH, TOP_K
)

def load_and_split(docs):  
  splitter = RecursiveCharacterTextSplitter(
    chunk_size=CHUNK_SIZE,
    chunk_overlap=CHUNK_OVERLAP,
  )
  vector_store.add_documents(documents=splitter.split_documents(docs))

def load_pdf(path):
  docs = []
  with open(path, "rb") as f:
    pdf = PyPDF2.PdfReader(f)
    for i, p in enumerate(pdf.pages):
      content = p.extract_text()
      docs.append(Document(
        page_content=content,
        metadata={
          "source": path,
          "page": i + 1,
          "file_type": "pdf",
        }))
  load_and_split(docs)

def load_csv(path):
  docs = []
  df = pd.read_csv(path)
  for i, row in df.iterrows():
    docs.append(Document(
      page_content=row.content,
      metadata={
        "source": path,
        "page": i + 1,
        "file_type": "csv",
      }))
  load_and_split(docs)

def load_txt(path):
  docs = []
  with open(path, "r", encoding="utf-8") as f:
    content = f.read()
  docs.append(Document(
    page_content=content,
    metadata={
      "source": path,
      "page": 1,
      "file_type": "txt",
    }))
  load_and_split(docs)



embeddings = OllamaEmbeddings(model=EMBEDDING_MODEL, base_url=OLLAMA_BASE_URL)
# is_add = not os.path.isfile(os.path.join(CHROMA_DB_PATH, "chroma.sqlite3"))
is_add = not any(os.path.isdir(os.path.join(CHROMA_DB_PATH, fn)) for fn in os.listdir(CHROMA_DB_PATH))

vector_store = Chroma(
  collection_name="documents",
  embedding_function=embeddings,
  persist_directory=CHROMA_DB_PATH,
)

if is_add:
  loaders = {
    ".pdf": load_pdf,
    ".csv": load_csv,
    ".txt": load_txt,
  }
  for fn in os.listdir(STORAGE_PATH):
    path = os.path.join(STORAGE_PATH, fn)
    loader = loaders.get(os.path.splitext(path)[1])
    loader(path)
    print("adicionado o arquivo:", fn)

retriever = vector_store.as_retriever(
  search_kwargs={"k": TOP_K}
)
