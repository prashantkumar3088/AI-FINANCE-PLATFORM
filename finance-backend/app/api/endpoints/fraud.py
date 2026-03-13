from fastapi import APIRouter, Depends, HTTPException
from app.database.firebase import get_db
from google.cloud.firestore import Client
from app.ai.fraud_detection import detect_fraud
from datetime import datetime
from uuid import uuid4

router = APIRouter()

@router.get("/alerts")
def get_fraud_alerts(user_id: str, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database not ready")
        
    # Execute AI model
    alerts = detect_fraud(user_id, db)
    
    # Save alerts back to the fraud_alerts collection for persistence
    fraud_ref = db.collection('fraud_alerts')
    
    persisted_alerts = []
    for alert in alerts:
        # Avoid creating duplicates by checking if an alert for this transaction exists
        existing = fraud_ref.where('transaction_id', '==', alert['transaction_id']).limit(1).stream()
        
        # If no result, save it
        if len(list(existing)) == 0:
            doc_data = {
                "user_id": user_id,
                "transaction_id": alert['transaction_id'],
                "risk_level": alert['risk_level'],
                "status": "pending",
                "reason": alert['reason'],
                "timestamp": datetime.utcnow()
            }
            _, doc_ref = fraud_ref.add(doc_data)
            
            doc_data['id'] = doc_ref.id
            persisted_alerts.append(doc_data)
            
    # Also fetch existing unresolved alerts to return
    active_alerts = fraud_ref.where('user_id', '==', user_id).where('status', '==', 'pending').stream()
    all_returned_alerts = persisted_alerts.copy()
    
    for doc in active_alerts:
        data = doc.to_dict()
        data['id'] = doc.id
        # We don't want to double count the ones we just added in this request context
        if data['id'] not in [a.get('id') for a in all_returned_alerts]:
            all_returned_alerts.append(data)

    return {"user_id": user_id, "alerts": all_returned_alerts}
