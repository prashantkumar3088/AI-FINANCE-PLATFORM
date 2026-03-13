import requests
import json
import redis
import os
from app.core.config import settings

# Initialize Redis client pool
redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)
CACHE_EXPIRATION = 3600 # 1 hour

def fetch_stock_data(symbol: str):
    """Fetches real-time stock data from cache or external API."""
    cache_key = f"market:stock:{symbol}"
    
    # 1. Check Cache
    try:
        cached_data = redis_client.get(cache_key)
        if cached_data:
            return json.loads(cached_data)
    except Exception as e:
        print(f"Redis cache error: {e}")
        
    # 2. Fetch from External API
    api_key = os.getenv("ALPHA_VANTAGE_KEY")
    if not api_key:
        # Mock payload if key not provided for development
        data = {
            "symbol": symbol,
            "price": 150.00,
            "change": "+1.25",
            "mock": True
        }
    else:
        url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={api_key}"
        res = requests.get(url)
        raw_data = res.json()
        if "Global Quote" in raw_data:
            quote = raw_data["Global Quote"]
            data = {
                "symbol": quote.get("01. symbol"),
                "price": float(quote.get("05. price", 0)),
                "change": quote.get("09. change"),
                "change_percent": quote.get("10. change percent")
            }
        else:
            return {"error": f"Failed to fetch real data for {symbol}"}

    # 3. Store in Cache
    try:
        redis_client.setex(cache_key, CACHE_EXPIRATION, json.dumps(data))
    except Exception as e:
        print(f"Failed to cache data: {e}")
        
    return data

def fetch_crypto_data(symbol: str):
    """Fetches crypto data (mocked structure)"""
    cache_key = f"market:crypto:{symbol}"
    
    try:
        cached_data = redis_client.get(cache_key)
        if cached_data:
            return json.loads(cached_data)
    except Exception:
        pass
        
    data = {
        "symbol": symbol,
        "price": 45000.0 if symbol == "BTC" else 2500.0,
        "mock": True
    }
    
    try:
        redis_client.setex(cache_key, CACHE_EXPIRATION, json.dumps(data))
    except Exception:
        pass
        
    return data
