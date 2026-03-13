from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the FinAI Platform API"}

# Note: Testing Firebase/Redis endpoints natively requires mocking the respective clients
def test_expense_schema_validation():
    # Sending missing fields should return 422 Unprocessable Entity
    response = client.post(
        "/expenses/add",
        json={"amount": 50.0} # Missing user_id, category, type
    )
    assert response.status_code == 422
