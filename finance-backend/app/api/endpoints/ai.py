from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.database.firebase import get_db
from google.cloud.firestore import Client

from app.ai.expense_prediction import predict_next_month_expenses
from app.ai.insight_generator import generate_insights
from app.ai.advisor_engine import generate_advice
from app.ai.anomaly_detection import detect_anomalies
from app.ai.spending_persona import get_spending_persona
from app.ai.safe_to_spend import get_safe_to_spend
from app.ai.auto_categorizer import auto_categorize

router = APIRouter()

# ──────────────────────────────────────────────
# Existing endpoints (unchanged)
# ──────────────────────────────────────────────

@router.get("/expenses/predict")
def get_expense_prediction(user_id: str, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not ready")
    pred = predict_next_month_expenses(user_id, db)
    return {"user_id": user_id, "predicted_next_month_expense": pred}

@router.get("/insights")
def get_insights(user_id: str, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not ready")
    insights = generate_insights(user_id, db)
    return {"insights": insights}

@router.get("/advisor")
def get_advice(user_id: str, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not ready")
    result = generate_advice(user_id, db)
    advice_text = " ".join(result.get("suggestions", []))
    return {"advice": advice_text, "status": "Optimizing", "user_id": user_id}

# ──────────────────────────────────────────────
# New AI Feature Endpoints
# ──────────────────────────────────────────────

@router.get("/anomalies")
def get_anomalies(user_id: str, db: Client = Depends(get_db)):
    """Feature 1: Spending Anomaly Detection using Z-Score."""
    if not db:
        raise HTTPException(status_code=500, detail="Database not ready")
    anomalies = detect_anomalies(user_id, db)
    return {"anomalies": anomalies}

@router.get("/persona")
def get_persona(user_id: str, db: Client = Depends(get_db)):
    """Feature 2: Spending Persona Assignment."""
    if not db:
        raise HTTPException(status_code=500, detail="Database not ready")
    persona = get_spending_persona(user_id, db)
    return {"persona": persona}

@router.get("/safe-to-spend")
def safe_to_spend(user_id: str, db: Client = Depends(get_db)):
    """Feature 3: Daily Safe-to-Spend Balance Predictor."""
    if not db:
        raise HTTPException(status_code=500, detail="Database not ready")
    result = get_safe_to_spend(user_id, db)
    return result

@router.get("/all-insights")
def get_all_insights(user_id: str, db: Client = Depends(get_db)):
    """
    Single aggregated endpoint — fetches ALL AI data in one call.
    The frontend calls this once and renders everything instantly.
    """
    if not db:
        raise HTTPException(status_code=500, detail="Database not ready")
    return {
        "insights": generate_insights(user_id, db),
        "anomalies": detect_anomalies(user_id, db),
        "persona": get_spending_persona(user_id, db),
        "safe_to_spend": get_safe_to_spend(user_id, db),
        "advice": " ".join(generate_advice(user_id, db).get("suggestions", [])),
        "predicted_next_month": predict_next_month_expenses(user_id, db),
    }

# ──────────────────────────────────────────────
# Auto-categorization (used during transaction add)
# ──────────────────────────────────────────────

class CategorizeRequest(BaseModel):
    description: str

@router.post("/categorize")
def categorize_transaction(body: CategorizeRequest):
    """Feature 4: Smart Auto-Categorization — zero DB call needed."""
    suggested = auto_categorize(body.description)
    return {"description": body.description, "suggested_category": suggested}
