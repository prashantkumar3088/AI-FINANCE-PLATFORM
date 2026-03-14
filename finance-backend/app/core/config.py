from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FinAI Complete API"
    API_V1_STR: str = "/api/v1"
    
    # Firebase
    FIREBASE_PROJECT_ID: str = ""
    FIREBASE_CREDENTIALS_PATH: str = "serviceAccountKey.json" 
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_URL: str = "redis://localhost:6379/0"

    # Market Data
    MARKET_DATA_API_KEY: str = "demo"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
