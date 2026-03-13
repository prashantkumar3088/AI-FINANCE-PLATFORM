import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime
from google.cloud.firestore import Client

def predict_next_month_expenses(user_id: str, db: Client) -> float:
    """Predicts next month's total expenses using simple linear regression on monthly aggregates."""
    
    transactions_ref = db.collection('transactions')
    # Fetch user's expenses
    docs = transactions_ref.where('user_id', '==', user_id).where('type', '==', 'expense').stream()
    
    data = []
    for doc in docs:
        d = doc.to_dict()
        data.append({
            "amount": d.get("amount", 0),
            "date": d.get("date")
        })
        
    if not data:
        return 0.0
        
    df = pd.DataFrame(data)
    
    # Handle localized/naive datetime issues
    df['date'] = pd.to_datetime(df['date'], utc=True)
    
    # Extract year-month period for aggregation
    df['month_period'] = df['date'].dt.to_period('M')
    
    # Aggregate sums by month
    monthly_expenses = df.groupby('month_period')['amount'].sum().reset_index()
    monthly_expenses = monthly_expenses.sort_values('month_period')
    
    # If we have less than 2 months of data, we can't do a meaningful trend line
    if len(monthly_expenses) < 2:
        return float(monthly_expenses['amount'].iloc[-1]) if not monthly_expenses.empty else 0.0
        
    # Convert month_period to an integer index representing time (0, 1, 2, ...)
    # X = time index, y = total expenses
    monthly_expenses['time_index'] = np.arange(len(monthly_expenses))
    
    X = monthly_expenses[['time_index']]
    y = monthly_expenses['amount']
    
    model = LinearRegression()
    model.fit(X, y)
    
    # Predict for the next index
    next_index = [[len(monthly_expenses)]]
    predicted_expense = model.predict(next_index)[0]
    
    return max(0.0, float(predicted_expense)) # Expenses shouldn't be negative in this context
