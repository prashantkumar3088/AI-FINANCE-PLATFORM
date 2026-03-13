from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import enum

class TransactionType(str, enum.Enum):
    income = "income"
    expense = "expense"

class RiskLevel(str, enum.Enum):
    low = "low"
    medium = "medium"
    critical = "critical"

# ----------------- User -----------------
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: str # Firebase IDs are strings
    created_at: datetime

# ----------------- Transaction/Expense -----------------
class TransactionBase(BaseModel):
    user_id: str
    amount: float
    category: str
    type: TransactionType
    description: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: str
    date: datetime

class ExpenseBase(BaseModel):
    user_id: str
    amount: float
    category: str
    description: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseBase):
    id: str
    date: datetime

# ----------------- Budget -----------------
class BudgetBase(BaseModel):
    user_id: str
    category: str
    monthly_limit: float

class BudgetCreate(BudgetBase):
    pass

class BudgetUpdate(BaseModel):
    monthly_limit: float

class Budget(BudgetBase):
    id: str

# ----------------- Investment -----------------
class InvestmentBase(BaseModel):
    user_id: str
    asset_name: str
    asset_type: str
    quantity: float
    purchase_price: float
    current_price: float

class InvestmentCreate(InvestmentBase):
    pass

class Investment(InvestmentBase):
    id: str

# ----------------- Financial Goal -----------------
class FinancialGoalBase(BaseModel):
    user_id: str
    goal_name: str
    target_amount: float
    deadline: datetime

class FinancialGoalCreate(FinancialGoalBase):
    pass

class FinancialGoalUpdate(BaseModel):
    current_amount: float

class FinancialGoal(FinancialGoalBase):
    id: str
    current_amount: float

# ----------------- Insights & Alerts -----------------
class AIInsight(BaseModel):
    id: str
    user_id: str
    insight_text: str
    insight_type: str
    created_at: datetime

class FraudAlert(BaseModel):
    id: str
    user_id: str
    transaction_id: str
    risk_level: RiskLevel
    status: str
