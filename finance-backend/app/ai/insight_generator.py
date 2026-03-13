import pandas as pd
from datetime import datetime
from google.cloud.firestore import Client

def generate_insights(user_id: str, db: Client) -> list:
    """Analyzes spending patterns to generate comparative insights."""
    
    transactions_ref = db.collection('transactions')
    docs = transactions_ref.where('user_id', '==', user_id).where('type', '==', 'expense').stream()
    
    data = []
    for doc in docs:
        d = doc.to_dict()
        data.append({
            "amount": d.get("amount", 0),
            "category": d.get("category", "Uncategorized"),
            "date": d.get("date")
        })
        
    if not data:
        return [{"message": "Not enough data to generate insights yet.", "type": "info"}]
        
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'], utc=True)
    
    now = datetime.utcnow()
    current_month_start = pd.Timestamp(year=now.year, month=now.month, day=1, tz='UTC')
    
    if now.month == 1:
        last_month_start = pd.Timestamp(year=now.year - 1, month=12, day=1, tz='UTC')
    else:
        last_month_start = pd.Timestamp(year=now.year, month=now.month - 1, day=1, tz='UTC')
        
    # Split into current month vs last month
    current_month_data = df[df['date'] >= current_month_start]
    last_month_data = df[(df['date'] >= last_month_start) & (df['date'] < current_month_start)]
    
    insights = []
    
    # Compare Category Spending
    current_cat_totals = current_month_data.groupby('category')['amount'].sum()
    last_cat_totals = last_month_data.groupby('category')['amount'].sum()
    
    for category in current_cat_totals.index:
        current_val = current_cat_totals[category]
        last_val = last_cat_totals.get(category, 0)
        
        if last_val > 0:
            pct_change = ((current_val - last_val) / last_val) * 100
            if pct_change > 20: # Trigger alert if spent > 20% more
                insights.append({
                    "message": f"You spent {pct_change:.0f}% more on {category} this month compared to last month.",
                    "type": "alert",
                    "category": category
                })
            elif pct_change < -15:
                insights.append({
                    "message": f"Great job! Your spending on {category} decreased by {abs(pct_change):.0f}% this month.",
                    "type": "success",
                    "category": category
                })
                
    if not insights:
        insights.append({"message": "Your spending patterns are consistent with recent history.", "type": "info"})
        
    return insights
