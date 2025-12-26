from fastapi import FastAPI
from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1 import auth, scans

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["authentication"])
app.include_router(scans.router, prefix=f"{settings.API_V1_STR}/scans", tags=["scans"])

@app.get("/")
def read_root():
    return {"message": "Welcome to CyberSentinel Vulnerability Scanner API"}
