from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..core import security
from ..core.config import settings
from ..api import deps
from ..models.user import User

router = APIRouter()

@router.post("/login/access-token")
async def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.get("/login/test-token")
async def test_token(current_user: User = Depends(deps.get_current_user)) -> Any:
    """
    Test access token
    """
    # return a JSON-serializable representation instead of the SQLAlchemy model
    return {
        "id": current_user.id,
        "username": current_user.username,
        "is_active": bool(current_user.is_active),
        "is_superuser": bool(current_user.is_superuser),
    }
