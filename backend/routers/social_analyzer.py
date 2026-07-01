from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class TextRequest(BaseModel):
    text: str

URGENCY  = ["urgent","immediately","act now","limited time",
            "expires","hurry","last chance","don't wait"]
THREATS  = ["suspended","blocked","terminated","closed",
            "deleted","banned","locked","restricted"]
REWARDS  = ["winner","won","prize","free","gift",
            "congratulations","selected","lucky"]
PERSONAL = ["password","credit card","bank account",
            "verify","confirm","click here","update your"]

@router.post("/analyze/social")
def analyze_social(req: TextRequest):
    t = req.text.lower()
    breakdown = {
        "urgency":  sum(1 for w in URGENCY  if w in t),
        "threats":  sum(1 for w in THREATS  if w in t),
        "rewards":  sum(1 for w in REWARDS  if w in t),
        "personal": sum(1 for w in PERSONAL if w in t),
    }
    score = min(sum(breakdown.values()) * 12, 100)
    found = [w for w in URGENCY+THREATS+REWARDS+PERSONAL if w in t]
    level = "HIGH" if score>=60 else "MEDIUM" if score>=30 else "LOW"
    return {
        "risk_level": level,
        "score": score,
        "triggers": found,
        "breakdown": breakdown,
        "safe": score < 30
    }