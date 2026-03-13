from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.api.endpoints import expenses, budgets, investments, transactions, goals, ai, fraud, market

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for the AI-powered finance platform.",
    version="1.0.0",
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to the FinAI Platform API"}

app.include_router(expenses.router, prefix="/expenses", tags=["Expenses"])
app.include_router(budgets.router, prefix="/budgets", tags=["Budgets"])
app.include_router(investments.router, prefix="/investments", tags=["Investments"])
app.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
app.include_router(goals.router, prefix="/goals", tags=["Financial Goals"])
app.include_router(ai.router, prefix="/ai", tags=["AI Insights"])
app.include_router(fraud.router, prefix="/fraud", tags=["Fraud Detection"])
app.include_router(market.router, prefix="/market", tags=["Market Data"])
