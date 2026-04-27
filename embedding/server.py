from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from vector import vector_store, filenames

from config import (API_HOST, API_PORT)

app = FastAPI(
  title="Ollama RAG Chat API",
  description="API for RAG-based chat with documents using Ollama",
  version="1.0.0")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

class QueryRequest(BaseModel):
  query: str
  file: str
  score: float

@app.post("/context")
def post_context(request: QueryRequest):
  # print(request.query)
  # print(request.file)
  # print(request.score)

  filter = {"file_name": request.file} if request.file in filenames else None
  result = vector_store.similarity_search_with_score(
    request.query, 
    k=6, 
    filter=filter)
  # print(result)

  context = []
  size = 0
  for doc, score in result:
    if size + len(doc.page_content) > 2000: next
    if score > request.score: break
    context.append({ "content": doc.page_content, "score": score })
  
  return context

@app.get("/filenames")
def get_filenames():
  return filenames



if __name__ == "__main__":
  import uvicorn
  print(f"Starting API server on {API_HOST}:{API_PORT}")
  uvicorn.run(app, host=API_HOST, port=API_PORT)