from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ...core.database import get_db
from ...schemas.user import User, UserUpdate
from ...services.auth_service import get_current_user, get_current_admin_user
from ...models.user import User as UserModel

router = APIRouter()

@router.get("/profile", response_model=User)
async def get_user_profile(current_user: UserModel = Depends(get_current_user)):
    """
    Get current user profile
    """
    return current_user

@router.put("/profile", response_model=User)
async def update_user_profile(
    user_update: UserUpdate, 
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user profile
    """
    # Update user fields
    if user_update.email is not None:
        current_user.email = user_update.email
    
    if user_update.username is not None:
        current_user.username = user_update.username
    
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    
    # Update password if provided
    if user_update.password is not None:
        from ...core.security import get_password_hash
        current_user.hashed_password = get_password_hash(user_update.password)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.get("/", response_model=List[User])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    current_user: UserModel = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get all users (admin only)
    """
    users = db.query(UserModel).offset(skip).limit(limit).all()
    return users