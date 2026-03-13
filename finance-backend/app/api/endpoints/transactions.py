from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database.firebase import get_db
from app.schemas.all import Transaction as TransactionSchema
from google.cloud.firestore import Client, Query

router = APIRouter()

@router.get("/list", response_model=List[TransactionSchema])
def list_transactions(user_id: str, limit: int = 100, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")
        
    transactions_ref = db.collection('transactions')
    
    # Query all transactions for user, both income and expense
    docs = transactions_ref.where('user_id', '==', user_id).order_by('date', direction=Query.DESCENDING).limit(limit).stream()
    
    results = []
    for doc in docs:
        d = doc.to_dict()
        d['id'] = doc.id
        results.append(d)
        
    return results
