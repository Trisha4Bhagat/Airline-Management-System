from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from ...core.database import get_db
from ...core.config import settings
from ...core.security import create_access_token
from ...schemas.token import Token
from ...schemas.user import User, UserCreate
from ...services.auth_service import AuthService, get_current_user

router = APIRouter()

@router.post("/register", response_model=User)
async def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user
    """
    auth_service = AuthService(db)
    
    user = auth_service.create_user(
        email=user_in.email,
        username=user_in.username,
        password=user_in.password,
        full_name=user_in.full_name,
        is_admin=user_in.is_admin
    )
    
    return user

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    auth_service = AuthService(db)
    
    user = auth_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "id": user.id},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """
    Logout endpoint (JWT tokens are stateless, so this is just a placeholder)
    """
    # In a real-world app, you might blacklist the token in a Redis cache
    return {"detail": "Successfully logged out"}

@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: User = Depends(get_current_user)):
    """
    Refresh access token
    """
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": current_user.username, "id": current_user.id},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}