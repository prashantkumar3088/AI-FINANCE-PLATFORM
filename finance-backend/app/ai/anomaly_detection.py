import pandas as pd
import numpy as np
from datetime import datetime
from google.cloud.firestore import Client

def detect_anomalies(user_id: str, db: Client) -> list:
    """
    Detects unusual transactions using Z-score per category.
    A transaction is flagged if its amount is more than 2 std deviations above the category mean.
    Runs purely on Pandas/NumPy — no heavy models, instant response.
    """
    docs = db.collection('transactions').where('user_id', '==', user_id).where('type', '==', 'expense').stream()
    data = []
    for doc in docs:
        d = doc.to_dict()
        data.append({
            "amount": d.get("amount", 0),
            "category": d.get("category", "Uncategorized"),
            "description": d.get("description", "Transaction"),
            "date": d.get("date"),
        })

    if len(data) < 3:
        return []

    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'], utc=True, errors='coerce')

    anomalies = []

    for cat, group in df.groupby('category'):
        if len(group) < 3:
            continue
        mean = group['amount'].mean()
        std = group['amount'].std()
        if std == 0:
            continue
        for _, row in group.iterrows():
            z = (row['amount'] - mean) / std
            if z > 2.0:  # More than 2 standard deviations above average
                anomalies.append({
                    "category": cat,
                    "amount": float(row['amount']),
                    "average": round(float(mean), 2),
                    "description": row['description'],
                    "z_score": round(float(z), 2),
                    "message": f"Unusual spend of ₹{row['amount']:,.0f} in '{cat}'. Your average is ₹{mean:,.0f}. This is {z:.1f}x above normal."
                })

    # Return top 5 most anomalous
    anomalies.sort(key=lambda x: x['z_score'], reverse=True)
    return anomalies[:5]
