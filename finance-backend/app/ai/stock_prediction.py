import pandas as pd
from prophet import Prophet
import requests
from datetime import datetime
import os

def predict_stock_trend(symbol: str, days: int = 30):
    """
    Predicts stock trend using Prophet.
    Normally fetches from an API, we will simulate the fetch if API key not present,
    since we rely on Alpha Vantage / Yahoo.
    """
    api_key = os.getenv("ALPHA_VANTAGE_KEY")
    
    if not api_key:
        print(f"Warning: Alpha Vantage key missing. Generating mock forecast data for {symbol}.")
        # Generate mock dataframe for Prophet
        dates = pd.date_range(end=datetime.today(), periods=100)
        df = pd.DataFrame({
            "ds": dates,
            "y": [100 + i * 0.5 for i in range(100)] # simple upward trend
        })
    else:
        url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={api_key}"
        res = requests.get(url)
        data = res.json()
        
        if "Time Series (Daily)" not in data:
            return {"error": f"Could not fetch data for {symbol}"}
            
        time_series = data["Time Series (Daily)"]
        
        # Prepare Prophet dataframe
        df = pd.DataFrame([
            {"ds": date, "y": float(values["4. close"])}
            for date, values in time_series.items()
        ])
        
        # Prophet expects ascending dates usually, alphavantage might be descending
        df = df.sort_values(by="ds")
        
    # Fit the Prophet model
    m = Prophet(daily_seasonality=False, yearly_seasonality=True)
    m.fit(df)
    
    # Predict future
    future = m.make_future_dataframe(periods=days)
    forecast = m.predict(future)
    
    # Extract only future values
    future_forecast = forecast[['ds', 'yhat']].tail(days)
    
    result = []
    for _, row in future_forecast.iterrows():
        result.append({
            "date": row["ds"].strftime("%Y-%m-%d"),
            "predicted_price": round(row["yhat"], 2)
        })
        
    return {
        "symbol": symbol,
        "forecast_days": days,
        "predictions": result
    }
