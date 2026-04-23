import os
from pathlib import Path

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "qwen3-embedding:0.6b")

API_HOST = os.getenv("API_HOST", "localhost")
API_PORT = int(os.getenv("API_PORT", "8000"))

CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "2100"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "300"))
TOP_K = int(os.getenv("TOP_K", "1"))

CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "./db")
STORAGE_PATH = os.getenv("STORAGE_PATH", "./docs")

Path(CHROMA_DB_PATH).mkdir(parents=True, exist_ok=True)
Path(STORAGE_PATH).mkdir(parents=True, exist_ok=True)
