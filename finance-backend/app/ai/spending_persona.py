import pandas as pd
from datetime import datetime
from google.cloud.firestore import Client

PERSONAS = [
    {
        "name": "The Foodie",
        "emoji": "🍜",
        "trigger_category": "Food & Dining",
        "threshold": 0.30,
        "description": "You live to eat! Food & Dining is your top priority this month.",
        "tip": "Try meal prepping 3 days a week — it could save you ₹2,000+ without compromising on taste."
    },
    {
        "name": "The Shopaholic",
        "emoji": "🛍️",
        "trigger_category": "Shopping",
        "threshold": 0.30,
        "description": "Retail therapy is your go-to! Shopping takes the lion's share of your budget.",
        "tip": "Implement a 24-hour rule: wait a day before buying anything above ₹1,000."
    },
    {
        "name": "The Entertainment King",
        "emoji": "🎬",
        "trigger_category": "Entertainment",
        "threshold": 0.25,
        "description": "You love experiences — movies, games, and subscriptions are your jam.",
        "tip": "Audit your subscriptions. Cancelling 2 unused ones could free up ₹1,500/month."
    },
    {
        "name": "The Traveller",
        "emoji": "✈️",
        "trigger_category": "Travel",
        "threshold": 0.25,
        "description": "The world is your oyster! You spend significantly on travel and experiences.",
        "tip": "Book flights and hotels 3-4 weeks in advance to save up to 30% on the same trip."
    },
    {
        "name": "The Responsible Spender",
        "emoji": "🏠",
        "trigger_category": "Bills",
        "threshold": 0.40,
        "description": "Bills and necessities take up most of your budget — you're keeping the lights on.",
        "tip": "Review all recurring subscriptions and bills annually. You might find cheaper alternatives."
    },
    {
        "name": "The Well-Rounded Saver",
        "emoji": "💰",
        "trigger_category": None,
        "threshold": 0,
        "description": "Your spending is well-distributed across categories — no single category dominates.",
        "tip": "You're doing great! Consider channelling your surplus into a diversified index fund."
    },
]

def get_spending_persona(user_id: str, db: Client) -> dict:
    """
    Determines user spending persona based on this month's category distribution.
    Pure heuristics — zero ML overhead, instant.
    """
    docs = db.collection('transactions').where('user_id', '==', user_id).where('type', '==', 'expense').stream()
    data = []
    for doc in docs:
        d = doc.to_dict()
        data.append({
            "amount": d.get("amount", 0),
            "category": d.get("category", "Uncategorized"),
            "date": d.get("date"),
        })

    if not data:
        return PERSONAS[-1]  # Default: Well-Rounded Saver

    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'], utc=True, errors='coerce')

    # Filter to current month
    now = datetime.utcnow()
    current_month_start = pd.Timestamp(year=now.year, month=now.month, day=1, tz='UTC')
    df_current = df[df['date'] >= current_month_start]

    if df_current.empty:
        df_current = df  # Fallback to all-time if nothing this month

    total = df_current['amount'].sum()
    if total == 0:
        return PERSONAS[-1]

    cat_pct = (df_current.groupby('category')['amount'].sum() / total).to_dict()

    # Check each persona in order
    for persona in PERSONAS[:-1]:
        cat = persona['trigger_category']
        if cat and cat_pct.get(cat, 0) >= persona['threshold']:
            return persona

    # Also check top category even if below threshold
    top_cat = max(cat_pct, key=cat_pct.get)
    top_pct = cat_pct[top_cat]

    return {
        **PERSONAS[-1],
        "description": f"Your spending is balanced. Your top category is '{top_cat}' at {top_pct*100:.0f}% of total expenses.",
    }
