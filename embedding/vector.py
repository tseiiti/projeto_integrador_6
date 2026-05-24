from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
import pandas as pd
import PyPDF2
import os
import re

from config import (
  EMBEDDING_MODEL, OLLAMA_BASE_URL, CHUNK_SIZE, CHUNK_OVERLAP, 
  CHROMA_DB_PATH, STORAGE_PATH
)

def load_and_split(docs):  
  splitter = RecursiveCharacterTextSplitter(
    chunk_size=CHUNK_SIZE,
    chunk_overlap=CHUNK_OVERLAP,
  )
  vector_store.add_documents(documents=splitter.split_documents(docs))

def load_pdf(path, file, cate):
  docs = []
  with open(path, "rb") as f:
    pdf = PyPDF2.PdfReader(f)
    for i, p in enumerate(pdf.pages):
      content = p.extract_text()
      content = re.sub(r'\n\s{2,}', "\n ", content)
      content = re.sub(r'\s{2,}', " ", content)
      docs.append(Document(
        page_content=content,
        metadata={
          "path": path,
          "cate": cate,
          "file": file,
          "page": i + 1,
          "file_type": "pdf",
        }))
  load_and_split(docs)

def load_csv(path, file, cate):
  docs = []
  df = pd.read_csv(path)
  for i, row in df.iterrows():
    docs.append(Document(
      page_content=row.content,
      metadata={
        "path": path,
        "cate": cate,
        "file": file,
        "page": i + 1,
        "file_type": "csv",
      }))
  load_and_split(docs)

def load_xls(path, file, cate):
  docs = []
  df = pd.read_excel(path)
  for i, row in df.iterrows():
    content = str(row)
    content = re.sub(r'\n\s{2,}', "\n ", content)
    content = re.sub(r'\s{2,}', " ", content)
    docs.append(Document(
      page_content=content,
      metadata={
        "path": path,
        "cate": cate,
        "file": file,
        "page": i + 1,
        "type": "xls",
      }))
  load_and_split(docs)
    
def load_txt(path, file, cate):
  docs = []
  with open(path, "r", encoding="utf-8") as f:
    content = f.read()
  docs.append(Document(
    page_content=content,
    metadata={
      "path": path,
      "cate": cate,
      "file": file,
      "page": 1,
      "type": "txt",
    }))
  load_and_split(docs)



embeddings = OllamaEmbeddings(model=EMBEDDING_MODEL, base_url=OLLAMA_BASE_URL)
is_add = not any(os.path.isdir(os.path.join(CHROMA_DB_PATH, fn)) for fn in os.listdir(CHROMA_DB_PATH))

vector_store = Chroma(
  collection_name="documents",
  embedding_function=embeddings,
  persist_directory=CHROMA_DB_PATH,
)

categories = [cat for cat in os.listdir(STORAGE_PATH)]

if is_add:
  loaders = {
    ".pdf": load_pdf,
    ".csv": load_csv,
    ".txt": load_txt,
    ".xls": load_xls,
    ".xlsx": load_xls,
  }
  for root, dirs, files in os.walk('./docs'):
    for file in files:
      cate = root.replace("./docs/", "")
      path = os.path.join(root, file)
      loader = loaders.get(os.path.splitext(path)[1])
      loader(path, file, cate)
      print("adicionado o arquivo:", cate)
