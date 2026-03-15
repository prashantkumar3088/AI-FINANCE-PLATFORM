import requests
import json

BASE_URL = "http://127.0.0.1:8000"
USER_ID = "test_user_budgets"

def test_budgets():
    print("--- Testing Budgets API ---")
    
    # 1. Create a budget
    create_data = {
        "user_id": USER_ID,
        "category": "Food",
        "monthly_limit": 5000.0
    }
    resp = requests.post(f"{BASE_URL}/budgets/create", json=create_data)
    print(f"Create Budget: {resp.status_code}")
    budget = resp.json()
    print(json.dumps(budget, indent=2))
    
    # 2. Add an expense for Food
    expense_data = {
        "user_id": USER_ID,
        "amount": 1200.0,
        "category": "Food",
        "description": "Lunch with team"
    }
    resp = requests.post(f"{BASE_URL}/expenses/add", json=expense_data)
    print(f"Add Expense Status: {resp.status_code}")
    print(f"Add Expense Raw Text: '{resp.text}'")
    try:
        print(f"Add Expense Response: {resp.json()}")
    except Exception as e:
        print(f"Failed to decode response: {e}")
        return
    
    # 3. List budgets and verify 'spent'
    resp = requests.get(f"{BASE_URL}/budgets/list?user_id={USER_ID}")
    print(f"List Budgets: {resp.status_code}")
    budgets = resp.json()
    print(json.dumps(budgets, indent=2))
    
    for b in budgets:
        if b['category'] == 'Food':
            if b['spent'] == 1200.0:
                print("✅ Budget 'spent' calculation is CORRECT.")
            else:
                print(f"❌ Budget 'spent' calculation is INCORRECT. Expected 1200.0, got {b['spent']}")

if __name__ == "__main__":
    test_budgets()
