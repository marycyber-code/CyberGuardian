from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, validator
from routers import social_analyzer, voice_detector
from services import virustotal
import time

app = FastAPI(title="Cyber Guardian API")

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ── Rate Limiting بسيط ──
RATE_LIMIT = {}

@app.middleware("http")
async def rate_limit(request: Request, call_next):
    ip = request.client.host
    now = time.time()
    hits = [t for t in RATE_LIMIT.get(ip, []) if now - t < 60]
    if len(hits) >= 30:
        return JSONResponse(
            status_code=429,
            content={"error": "Too many requests. Wait 1 minute."}
        )
    hits.append(now)
    RATE_LIMIT[ip] = hits
    return await call_next(request)

app.include_router(social_analyzer.router)
app.include_router(voice_detector.router)

class ScanRequest(BaseModel):
    url: str

    @validator('url')
    def validate_url(cls, v):
        v = v.strip()
        if len(v) > 2000:
            raise ValueError('URL too long')
        if not v.startswith(('http://', 'https://')):
            raise ValueError('Invalid URL format')
        return v

@app.get("/")
def root():
    return {"status": "Cyber Guardian API Running ✅"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/scan")
async def scan_url(req: ScanRequest):
    try:
        result = await virustotal.scan_url(req.url)
        if "error" in result:
            raise Exception(result["error"])
        return {
            "url":        req.url,
            "safe":       result["safe"],
            "risk_level": result["risk_level"],
            "score":      result["score"],
            "malicious":  result["malicious"],
            "suspicious": result["suspicious"],
            "harmless":   result["harmless"],
            "total":      result["total"],
            "message":    "✅ URL appears safe" if result["safe"]
                          else "⚠️ Suspicious URL detected!",
            "source":     "VirusTotal — Real Scan ✅"
        }
    except Exception:
        suspicious_words = [
            "phish","malware","fake","virus","hack",
            "free","prize","verify","suspended","urgent"
        ]
        is_bad = any(w in req.url.lower() for w in suspicious_words)
        return {
            "url":        req.url,
            "safe":       not is_bad,
            "risk_level": "HIGH" if is_bad else "LOW",
            "score":      85 if is_bad else 4,
            "message":    "⚠️ Suspicious URL detected!" if is_bad
                          else "✅ URL appears safe",
            "source":     "Local Analysis — Fallback"
        }