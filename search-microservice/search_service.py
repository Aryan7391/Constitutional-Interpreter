from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from ddgs import DDGS
import requests
from bs4 import BeautifulSoup
from readability import Document

app = FastAPI()

MAX_CONTENT_LENGTH = 4000
REQUEST_TIMEOUT = 10


# -------------------------
# Request Model
# -------------------------

class SearchRequest(BaseModel):
    query: str
    max_results: int = 5


# -------------------------
# Health Check
# -------------------------

@app.get("/")
def health_check():
    return {"status": "Search microservice running"}


# -------------------------
# Clean Text Utility
# -------------------------

def clean_text(text: str) -> str:
    return " ".join(text.split())


# -------------------------
# MODULE 1 — INTERNET SEARCH
# -------------------------

def perform_search(query: str, max_results: int):
    results = []
    try:
        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=max_results):
                results.append({
                    "title": r.get("title"),
                    "url": r.get("href")
                })
        return results
    except Exception as e:
        print("Search error:", e)
        return []


# -------------------------
# MODULE 2 — CONTENT EXTRACTION
# -------------------------

def extract_content(url: str):
    try:
        response = requests.get(
            url,
            timeout=REQUEST_TIMEOUT,
            headers={"User-Agent": "Mozilla/5.0"}
        )

        doc = Document(response.text)
        html = doc.summary()

        soup = BeautifulSoup(html, "html.parser")
        text = soup.get_text()

        cleaned = clean_text(text)

        return cleaned[:MAX_CONTENT_LENGTH]

    except Exception:
        return ""


# -------------------------
# Main Endpoint
# -------------------------

@app.post("/search")
def search(request: SearchRequest):

    search_results = perform_search(request.query, request.max_results)
    print("Search results:", search_results)

    structured_sources = []

    for result in search_results:
        content = extract_content(result["url"])

        if content:
            structured_sources.append({
                "title": result["title"],
                "url": result["url"],
                "content": content
            })

    return {"sources": structured_sources}