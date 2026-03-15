from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime
from app.database.firebase import get_db
from app.schemas.all import Transaction as TransactionSchema, ExpenseCreate, TransactionType
from google.cloud.firestore import Client

router = APIRouter()

@router.post("/add", response_model=TransactionSchema)
def add_expense(expense: ExpenseCreate, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")
        
    transactions_ref = db.collection('transactions')
    
    # Create the document dictionary
    doc_data = {
        "user_id": expense.user_id,
        "amount": expense.amount,
        "category": expense.category,
        "type": TransactionType.expense.value,
        "description": expense.description,
        "date": datetime.utcnow()
    }
    
    # Add to Firestore
    _, doc_ref = transactions_ref.add(doc_data)
    
    # Update doc_data for response
    doc_data["id"] = doc_ref.id
    if isinstance(doc_data["date"], datetime):
        doc_data["date"] = doc_data["date"].isoformat()
    
    return doc_data

@router.get("/list", response_model=List[TransactionSchema])
def list_expenses(user_id: str, limit: int = 100, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")
        
    transactions_ref = db.collection('transactions')
    query = transactions_ref.where('user_id', '==', user_id).where('type', '==', TransactionType.expense.value).limit(limit)
    docs = query.stream()
    
    results = []
    for doc in docs:
        d = doc.to_dict()
        d["id"] = doc.id
        results.append(d)
        
    return results

@router.delete("/delete/{expense_id}")
def delete_expense(expense_id: str, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")
        
    doc_ref = db.collection('transactions').document(expense_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Expense not found")
        
    # Verify it is an expense before deleting
    if doc.to_dict().get('type') != TransactionType.expense.value:
        raise HTTPException(status_code=400, detail="Document is not an expense")
        
    doc_ref.delete()
    return {"message": "Expense deleted successfully"}
