from fastapi import APIRouter
from app.services.market_data import fetch_stock_data, fetch_crypto_data
from app.ai.stock_prediction import predict_stock_trend

router = APIRouter()

@router.get("/stock/{symbol}")
def get_stock(symbol: str):
    """Retrieve current stock data."""
    return fetch_stock_data(symbol)

@router.get("/crypto/{symbol}")
def get_crypto(symbol: str):
    """Retrieve current crypto data."""
    return fetch_crypto_data(symbol)

@router.get("/stock/{symbol}/predict")
def predict_stock(symbol: str, days: int = 30):
    """Runs the Prophet model on stock symbol to predict 30-day forecast."""
    return predict_stock_trend(symbol, days=days)
