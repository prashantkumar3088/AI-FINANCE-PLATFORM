import requests
import json

def test_api_add():
    url = "http://localhost:8000/expenses/add"
    data = {
        "user_id": "test_user_ai",
        "amount": 12.34,
        "category": "Food & Dining",
        "description": "Test via API",
        "date": "2026-03-14T14:00:00.000Z"
    }
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api_add()
