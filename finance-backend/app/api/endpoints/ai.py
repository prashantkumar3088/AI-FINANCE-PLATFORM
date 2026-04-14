from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.database.firebase import get_db
from google.cloud.firestore import Client

from app.ai.expense_prediction import predict_next_month_expenses
from app.ai.insight_generator import generate_insights
from app.ai.advisor_engine import generate_advice
from app.ai.auto_categorizer import auto_categorize

router = APIRouter()

@router.get("/all-insights")
def get_all_insights(user_id: str, db: Client = Depends(get_db)):
    """
    Single aggregated endpoint — returns ALL AI data in one call.
    The frontend (Insights page) calls this once and renders everything.
    """
    if not db:
        raise HTTPException(status_code=500, detail="Database not ready")
    return {
        "insights": generate_insights(user_id, db),
        "advice": " ".join(generate_advice(user_id, db).get("suggestions", [])),
        "predicted_next_month": predict_next_month_expenses(user_id, db),
    }

class CategorizeRequest(BaseModel):
    description: str

@router.post("/categorize")
def categorize_transaction(body: CategorizeRequest):
    """Smart Auto-Categorization — no DB call needed."""
    suggested = auto_categorize(body.description)
    return {"description": body.description, "suggested_category": suggested}
