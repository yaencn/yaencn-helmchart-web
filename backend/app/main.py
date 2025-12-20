from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .api import charts, login
from .models.base import engine, Base, SessionLocal
from .core.config import settings
from .models.user import User
from .core.security import get_password_hash
import os

def _get_sqlite_path_from_url(url: str) -> str | None:
    # handle sqlite:///relative/path or sqlite:////absolute/path
    if url.startswith("sqlite:////"):
        return url.replace("sqlite:////", "/")
    if url.startswith("sqlite:///"):
        return url.replace("sqlite:///", "")
    return None


# Create database tables and initial admin if DB file does not exist
db_file = None
try:
    db_file = _get_sqlite_path_from_url(settings.SQLALCHEMY_DATABASE_URL)
except Exception:
    db_file = None

if db_file:
    db_path = os.path.abspath(db_file)
    db_dir = os.path.dirname(db_path) or "."
    # Ensure parent directory exists
    if not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)

    # If DB file does not exist, create tables and insert default admin
    if not os.path.exists(db_path):
        Base.metadata.create_all(bind=engine)
        try:
            db = SessionLocal()
            # Allow initial admin credentials to be provided via environment variables
            initial_user = os.environ.get('INITIAL_ADMIN_USER', 'admin')
            initial_pass = os.environ.get('INITIAL_ADMIN_PASS', 'admin123')
            hashed = get_password_hash(initial_pass)
            admin = db.query(User).filter(User.username == initial_user).first()
            if admin:
                admin.hashed_password = hashed
                admin.is_superuser = True
                admin.is_active = True
                db.add(admin)
            else:
                admin = User(username=initial_user, hashed_password=hashed, is_superuser=True, is_active=True)
                db.add(admin)
            db.commit()
        finally:
            db.close()
    else:
        # DB already exists; do not auto-generate database file or overwrite users
        pass
else:
    # Not using sqlite file DB or cannot determine path: ensure tables exist
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
app.include_router(login.router, prefix=f"{settings.API_V1_STR}", tags=["login"])

# Expose the charts storage as a static directory so files like
# /charts/index.yaml and /charts/<name>.tgz can be served directly.
app.mount("/charts", StaticFiles(directory=settings.STORAGE_PATH), name="charts")

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
