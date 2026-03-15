from fastapi import APIRouter, Depends, HTTPException
from app.database.firebase import get_db
from google.cloud.firestore import Client

from app.ai.expense_prediction import predict_next_month_expenses
from app.ai.insight_generator import generate_insights
from app.ai.advisor_engine import generate_advice

router = APIRouter()

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
    # The frontend expects 'advice' field 
    advice_text = " ".join(result.get("suggestions", []))
    return {"advice": advice_text, "status": "Optimizing", "user_id": user_id}
