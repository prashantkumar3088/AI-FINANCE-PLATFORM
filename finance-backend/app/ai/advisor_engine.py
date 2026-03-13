from google.cloud.firestore import Client

def generate_advice(user_id: str, db: Client):
    """Provides financial suggestions based on spending and budget allocations."""
    
    # 1. Fetch expenses
    expenses_docs = db.collection('transactions').where('user_id', '==', user_id).where('type', '==', 'expense').stream()
    total_expenses = sum([d.to_dict().get("amount", 0) for d in expenses_docs])
    
    # 2. Fetch income
    income_docs = db.collection('transactions').where('user_id', '==', user_id).where('type', '==', 'income').stream()
    total_income = sum([d.to_dict().get("amount", 0) for d in income_docs])
    
    # 3. Fetch budgets
    budgets_docs = db.collection('budgets').where('user_id', '==', user_id).stream()
    total_budget = sum([d.to_dict().get("monthly_limit", 0) for d in budgets_docs])
    
    advice = []
    
    # Logic Checks
    if total_income > 0:
        savings_rate = ((total_income - total_expenses) / total_income) * 100
        
        if savings_rate < 10:
            advice.append("Your savings rate is below 10%. Consider reducing discretionary spending such as entertainment or dining out.")
        elif savings_rate > 30:
            advice.append("You have a high savings rate. Consider exploring investment strategies to grow your wealth.")
            
    if total_budget > 0 and total_expenses > total_budget:
        advice.append(f"Warning: Your total expenses (${total_expenses:.2f}) have exceeded your aggregate budget limits (${total_budget:.2f}).")
        
    if not advice:
        advice.append("Your finances are looking healthy. Keep tracking your budget!")
        
    return {"suggestions": advice}
