from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database.firebase import get_db
from app.schemas.all import FinancialGoalCreate, FinancialGoalUpdate, FinancialGoal as FinancialGoalSchema
from google.cloud.firestore import Client

router = APIRouter()

@router.post("/create", response_model=FinancialGoalSchema)
def create_goal(goal: FinancialGoalCreate, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")
        
    goals_ref = db.collection('financial_goals')
    
    # Add base fields + current_amount = 0.0
    doc_data = goal.dict()
    doc_data["current_amount"] = 0.0
    
    _, doc_ref = goals_ref.add(doc_data)
    
    return {
        **doc_data,
        "id": doc_ref.id
    }

@router.get("/list", response_model=List[FinancialGoalSchema])
def list_goals(user_id: str, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")
        
    goals_ref = db.collection('financial_goals')
    docs = goals_ref.where('user_id', '==', user_id).stream()
    
    results = []
    for doc in docs:
        d = doc.to_dict()
        d['id'] = doc.id
        results.append(d)
        
    return results

@router.put("/update/{goal_id}", response_model=FinancialGoalSchema)
def update_goal(goal_id: str, goal_update: FinancialGoalUpdate, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")
        
    doc_ref = db.collection('financial_goals').document(goal_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Goal not found")
        
    doc_ref.update({
        "current_amount": goal_update.current_amount
    })
    
    updated_doc = doc_ref.get().to_dict()
    updated_doc["id"] = doc_ref.id
    
    return updated_doc
