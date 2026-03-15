from google.cloud.firestore import Client

def generate_advice(user_id: str, db: Client):
    """Provides high-quality financial suggestions using the 50/30/20 rule and pattern analysis."""
    
    # 1. Fetch data
    expenses_docs = db.collection('transactions').where('user_id', '==', user_id).where('type', '==', 'expense').stream()
    expenses = [d.to_dict() for d in expenses_docs]
    total_expenses = sum([e.get("amount", 0) for e in expenses])
    
    income_docs = db.collection('transactions').where('user_id', '==', user_id).where('type', '==', 'income').stream()
    total_income = sum([d.to_dict().get("amount", 0) for d in income_docs])
    
    budgets_docs = db.collection('budgets').where('user_id', '==', user_id).stream()
    total_budget_limit = sum([d.to_dict().get("monthly_limit", 0) for d in budgets_docs])
    
    advice = []
    
    # 2. Categorization for 50/30/20 Rule
    NEEDS_CATS = ['Bills', 'Utilities', 'Rent', 'Health', 'Transportation', 'Insurance']
    WANTS_CATS = ['Shopping', 'Entertainment', 'Food & Dining', 'Others', 'Travel']
    
    needs_spend = sum([e.get("amount", 0) for e in expenses if e.get("category") in NEEDS_CATS])
    wants_spend = sum([e.get("amount", 0) for e in expenses if e.get("category") in WANTS_CATS])
    savings = total_income - total_expenses
    
    # 3. Structural Advice
    if total_income > 0:
        needs_ratio = (needs_spend / total_income) * 100
        wants_ratio = (wants_spend / total_income) * 100
        savings_ratio = (savings / total_income) * 100
        
        if needs_ratio > 55:
            advice.append(f"Your 'Needs' (fixed costs) are at {needs_ratio:.0f}% of income, slightly above the recommended 50%. Look for ways to optimize utility bills or recurring subscriptions.")
        
        if wants_ratio > 35:
            advice.append(f"Spending on 'Wants' (discretionary) is at {wants_ratio:.0f}%. To accelerate your goals, try to keep this closer to 30%.")
            
        if savings_ratio < 15:
            advice.append("Prioritize building your emergency fund. Aim to save at least 20% of your income for long-term security.")
        elif savings_ratio > 35:
            advice.append("You have an impressive savings rate! You might want to consider diversified investments like Index Funds or SIPs to beat inflation.")

    # 4. Behavioral Advice
    food_spend = sum([e.get("amount", 0) for e in expenses if e.get("category") == 'Food & Dining'])
    if food_spend > (total_income * 0.15) and total_income > 0:
        advice.append("Your 'Food & Dining' spend is significant. Meal prepping even 3 days a week could save you nearly ₹2,000 this month.")
        
    if total_budget_limit > 0 and total_expenses > total_budget_limit:
        advice.append(f"Urgent: You've exceeded your combined monthly budget by ₹{total_expenses - total_budget_limit:,.0f}. Stop all non-essential spending for the week.")

    if not advice:
        advice.append("Your financial flight path is looking stable. Optimize your portfolio by reviewing your asset allocation annually.")
        
    return {"suggestions": advice}
