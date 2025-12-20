from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import charts
from .models.base import engine, Base
from .core.config import settings
import os

# Create database tables
Base.metadata.create_all(bind=engine)

# Ensure storage directory exists
if not os.path.exists(settings.STORAGE_PATH):
    os.makedirs(settings.STORAGE_PATH)

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(charts.router, prefix=f"{settings.API_V1_STR}/charts", tags=["charts"])

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
