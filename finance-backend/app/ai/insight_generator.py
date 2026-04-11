import pandas as pd
from datetime import datetime
from google.cloud.firestore import Client

def generate_insights(user_id: str, db: Client) -> list:
    """Analyzes spending patterns to generate high-quality financial insights."""
    
    # 1. Fetch transactions (expenses only)
    docs = db.collection('transactions').where('user_id', '==', user_id).where('type', '==', 'expense').stream()
    data = []
    for doc in docs:
        d = doc.to_dict()
        data.append({
            "amount": d.get("amount", 0),
            "category": d.get("category", "Uncategorized"),
            "date": d.get("date")
        })
        
    # 2. Fetch budgets
    budget_docs = db.collection('budgets').where('user_id', '==', user_id).stream()
    budgets = {}
    for b in budget_docs:
        d = b.to_dict()
        # Handle both 'limit' and 'monthly_limit' for frontend compatibility
        limit_val = d.get('limit') or d.get('monthly_limit') or 0
        budgets[d.get('category', 'Uncategorized')] = limit_val
        
    if not data:
        return [{"message": "I'm still learning your habits. Add some transactions to get started!", "type": "info", "category": "General"}]
        
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'], utc=True)
    
    now = datetime.utcnow().replace(tzinfo=None)
    current_month_start = datetime(now.year, now.month, 1)
    
    # Insights list
    insights = []
    
    # Calculate Spent this month
    df_current = df[df['date'].dt.tz_localize(None) >= current_month_start]
    current_cat_totals = df_current.groupby('category')['amount'].sum().to_dict()
    
    # Insight 1: Budget Proximity
    for cat, spent in current_cat_totals.items():
        if cat in budgets:
            limit = budgets[cat]
            usage = (spent / limit) * 100
            if usage >= 90:
                insights.append({
                    "message": f"Critical: You've used {usage:.0f}% of your '{cat}' budget (₹{spent:,.0f}/₹{limit:,.0f}).",
                    "type": "alert",
                    "category": cat
                })
            elif usage >= 70:
                insights.append({
                    "message": f"Caution: You are approaching your limit for '{cat}'. Still have ₹{limit-spent:,.0f} left.",
                    "type": "info",
                    "category": cat
                })

    # Insight 2: Top Spending Category
    if not df_current.empty:
        top_cat = df_current.groupby('category')['amount'].sum().idxmax()
        top_amt = df_current.groupby('category')['amount'].sum().max()
        insights.append({
            "message": f"Your highest spend so far is in '{top_cat}' at ₹{top_amt:,.0f}.",
            "type": "info",
            "category": top_cat
        })

    # Insight 3: Comparative Analysis (Current vs Last Month)
    last_month_start = (current_month_start - pd.DateOffset(months=1))
    df_last = df[(df['date'].dt.tz_localize(None) >= last_month_start) & (df['date'].dt.tz_localize(None) < current_month_start)]
    
    if not df_last.empty:
        last_cat_totals = df_last.groupby('category')['amount'].sum().to_dict()
        for cat, curr_val in current_cat_totals.items():
            prev_val = last_cat_totals.get(cat, 0)
            if prev_val > 0:
                diff = ((curr_val - prev_val) / prev_val) * 100
                if diff > 25:
                    insights.append({
                        "message": f"Spending in '{cat}' is up by {diff:.0f}% compared to last month. Any unexpected costs?",
                        "type": "alert",
                        "category": cat
                    })
                elif diff < -15:
                    insights.append({
                        "message": f"Fantastic! You've reduced your '{cat}' spending by {abs(diff):.0f}% compared to last month.",
                        "type": "success",
                        "category": cat
                    })

    if not insights:
        insights.append({"message": "You're doing great! Your spending is well-distributed and within limits.", "type": "success", "category": "General"})
        
    return insights[:5] # Keep it punchy
