from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from vector import retriever

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

@app.post("/context")
def post_context(request: QueryRequest):
  context = [ doc.page_content for doc in retriever.invoke(request.query) ]
  return context

if __name__ == "__main__":
  import uvicorn
  print(f"Starting API server on {API_HOST}:{API_PORT}")
  uvicorn.run(app, host=API_HOST, port=API_PORT)