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

@router.get("/list", response_model=List[dict])
def list_budgets(user_id: str, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")
        
    budgets_ref = db.collection('budgets')
    budget_docs = budgets_ref.where('user_id', '==', user_id).stream()
    
    # Get expenses to calculate spent
    from datetime import datetime
    now = datetime.utcnow()
    month_start = datetime(now.year, now.month, 1)
    
    transactions_ref = db.collection('transactions')
    expense_docs = transactions_ref.where('user_id', '==', user_id)\
                                 .where('type', '==', 'expense')\
                                 .stream()
    
    expenses = []
    for doc in expense_docs:
        d = doc.to_dict()
        if "date" in d:
             dt = d["date"]
             # Handle both ISO string and datetime object
             if isinstance(dt, str):
                 dt = datetime.fromisoformat(dt.replace("Z", "+00:00"))
             
             # Convert to naive or aware comparison
             if dt.tzinfo is not None:
                 dt = dt.replace(tzinfo=None)
                 
             if dt >= month_start:
                 expenses.append(d)

    results = []
    for doc in budget_docs:
        d = doc.to_dict()
        category = d.get("category")
        
        # Calculate spent for this category
        spent = sum(e.get("amount", 0) for e in expenses if e.get("category") == category)
        
        results.append({
            "id": doc.id,
            "user_id": user_id,
            "category": category,
            "limit": d.get("limit") or d.get("monthly_limit", 0),
            "spent": spent
        })
        
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
        "monthly_limit": budget_update.monthly_limit,
        "limit": budget_update.monthly_limit # Keep both for compatibility
    })
    
    # Return updated shape
    updated_doc = doc_ref.get().to_dict()
    updated_doc["id"] = doc_ref.id
    
    return updated_doc
