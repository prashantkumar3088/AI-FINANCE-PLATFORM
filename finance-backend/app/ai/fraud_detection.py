import pandas as pd
from sklearn.ensemble import IsolationForest
from google.cloud.firestore import Client
from datetime import datetime

def detect_fraud(user_id: str, db: Client):
    """Detects anomalies in a user's transactions using Isolation Forest."""
    
    transactions_ref = db.collection('transactions')
    # Fetch recent transactions
    docs = transactions_ref.where('user_id', '==', user_id).stream()
    
    transactions = []
    for doc in docs:
        d = doc.to_dict()
        transactions.append({
            "id": doc.id,
            "amount": float(d.get("amount", 0)),
            # In a real scenario we might have location latitude/longitude
            # Here we mock it by encoding category strings to numerical if needed or just using amount 
            "category": d.get("category", "Other")
        })
        
    if len(transactions) < 10:
        return [] # Not enough data to spot anomalies effectively
        
    df = pd.DataFrame(transactions)
    
    # For a simple Isolation Forest, we'll train just on the 'amount' dimension.
    # High-value outliers relative to normal spending will be flagged.
    X = df[['amount']]
    
    # contamination=0.05 means we expect ~5% of transactions to be anomalies (adjust per use case)
    clf = IsolationForest(contamination=0.05, random_state=42)
    df['anomaly_score'] = clf.fit_predict(X)
    
    # anomaly_score == -1 indicates an anomaly
    anomalies = df[df['anomaly_score'] == -1]
    
    alerts = []
    for _, row in anomalies.iterrows():
        # Determine risk level by sheer amount size natively mapped to user's max
        # A crude mocked logic
        ratio = row['amount'] / df['amount'].mean()
        risk_level = "critical" if ratio > 5 else "medium"
        
        alerts.append({
            "transaction_id": row['id'],
            "risk_level": risk_level,
            "amount": row['amount'],
            "reason": "Unusually high transaction amount detected."
        })
        
    return alerts
