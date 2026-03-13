from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FinAI Complete API"
    API_V1_STR: str = "/api/v1"
    
    # Firebase
    # E.g. path to service account key JSON file
    FIREBASE_CREDENTIALS_PATH: str = "serviceAccountKey.json" 
    
    # Redis
    REDIS_URL: str = "redis://redis:6379/0"

    class Config:
        env_file = ".env"

settings = Settings()
