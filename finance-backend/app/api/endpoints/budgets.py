from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database.firebase import get_db
from app.schemas.all import BudgetCreate, BudgetUpdate, Budget as BudgetSchema
from google.cloud.firestore import Client

router = APIRouter()

@router.post("/create", response_model=BudgetSchema)
def create_budget(budget: BudgetCreate, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")
        
    budgets_ref = db.collection('budgets')
    doc_data = budget.dict()
    
    _, doc_ref = budgets_ref.add(doc_data)
    
    return {
        **doc_data,
        "id": doc_ref.id
    }

@router.get("/list", response_model=List[BudgetSchema])
def list_budgets(user_id: str, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")
        
    budgets_ref = db.collection('budgets')
    docs = budgets_ref.where('user_id', '==', user_id).stream()
    
    results = []
    for doc in docs:
        d = doc.to_dict()
        d['id'] = doc.id
        results.append(d)
        
    return results

@router.put("/update/{budget_id}", response_model=BudgetSchema)
def update_budget(budget_id: str, budget_update: BudgetUpdate, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")
        
    doc_ref = db.collection('budgets').document(budget_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Budget not found")
        
    # Update document in Firestore
    doc_ref.update({
        "monthly_limit": budget_update.monthly_limit
    })
    
    # Return updated shape
    updated_doc = doc_ref.get().to_dict()
    updated_doc["id"] = doc_ref.id
    
    return updated_doc
