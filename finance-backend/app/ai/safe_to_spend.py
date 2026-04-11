from datetime import datetime, timezone
from google.cloud.firestore import Client
from app.ai.expense_prediction import predict_next_month_expenses

def get_safe_to_spend(user_id: str, db: Client) -> dict:
    """
    Calculates a daily 'safe to spend' amount based on:
    current balance - predicted remaining expenses this month
    divided by days remaining in the month.
    Reuses the existing LinearRegression prediction — no extra overhead.
    """
    # Fetch total income
    income_docs = db.collection('transactions') \
        .where('user_id', '==', user_id) \
        .where('type', '==', 'income').stream()
    total_income = sum(d.to_dict().get('amount', 0) for d in income_docs)

    # Fetch total expenses this month
    expense_docs = db.collection('transactions') \
        .where('user_id', '==', user_id) \
        .where('type', '==', 'expense').stream()

    data = [d.to_dict() for d in expense_docs]

    now = datetime.now(timezone.utc)
    current_month_start = datetime(now.year, now.month, 1, tzinfo=timezone.utc)

    expenses_this_month = sum(
        d.get('amount', 0) for d in data
        if d.get('date') and _parse_date(d['date']) >= current_month_start
    )

    # Predict next month's total to estimate remaining burn rate
    predicted_total = predict_next_month_expenses(user_id, db)

    # Days remaining in the month
    if now.month == 12:
        next_month = datetime(now.year + 1, 1, 1, tzinfo=timezone.utc)
    else:
        next_month = datetime(now.year, now.month + 1, 1, tzinfo=timezone.utc)
    days_remaining = (next_month - now).days + 1

    # Current balance estimate = income - expenses so far this month
    balance_estimate = total_income - expenses_this_month

    # Predicted remaining spend = predicted_total - already spent
    predicted_remaining = max(0, predicted_total - expenses_this_month)

    safe_balance = balance_estimate - predicted_remaining
    daily_safe = round(safe_balance / days_remaining, 2) if days_remaining > 0 else 0

    return {
        "balance_estimate": round(balance_estimate, 2),
        "expenses_this_month": round(expenses_this_month, 2),
        "predicted_remaining": round(predicted_remaining, 2),
        "days_remaining": days_remaining,
        "daily_safe_to_spend": max(0.0, daily_safe),
        "status": "safe" if daily_safe > 0 else "caution"
    }

def _parse_date(date_val):
    """Safely parse a date value that may be a Firestore Timestamp or datetime."""
    if hasattr(date_val, 'timestamp'):  # Firestore Timestamp
        return datetime.fromtimestamp(date_val.timestamp(), tz=timezone.utc)
    if isinstance(date_val, datetime):
        return date_val.replace(tzinfo=timezone.utc) if date_val.tzinfo is None else date_val
    try:
        from dateutil import parser as dp
        return dp.parse(str(date_val)).replace(tzinfo=timezone.utc)
    except Exception:
        return datetime.min.replace(tzinfo=timezone.utc)
