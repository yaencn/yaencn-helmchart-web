from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Yaencn HelmChart"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-here"  # In production, use a secure key
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    SQLALCHEMY_DATABASE_URL: str = "sqlite:///./sql_app.db"
    STORAGE_PATH: str = "./storage"

    class Config:
        case_sensitive = True

settings = Settings()
