from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database.firebase import get_db
from app.schemas.all import InvestmentCreate, Investment as InvestmentSchema
from google.cloud.firestore import Client

router = APIRouter()

@router.post("/add", response_model=InvestmentSchema)
def add_investment(investment: InvestmentCreate, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")
        
    investments_ref = db.collection('investments')
    doc_data = investment.dict()
    
    _, doc_ref = investments_ref.add(doc_data)
    
    return {
        **doc_data,
        "id": doc_ref.id
    }

@router.get("/portfolio", response_model=List[InvestmentSchema])
def get_portfolio(user_id: str, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")
        
    investments_ref = db.collection('investments')
    docs = investments_ref.where('user_id', '==', user_id).stream()
    
    results = []
    for doc in docs:
        d = doc.to_dict()
        d['id'] = doc.id
        results.append(d)
        
    return results
