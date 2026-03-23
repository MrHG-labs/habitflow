from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.database import get_session
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.schemas.token import Token, TokenRefresh
from app.services import auth_service, session_service
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, session: Session = Depends(get_session)):
    """Register a new user."""
    # Check if user already exists
    existing_user = auth_service.get_user_by_email(session, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    user = auth_service.create_user(
        session,
        email=user_data.email,
        username=user_data.username,
        password=user_data.password
    )

    return UserResponse(
        id=user.id,
        email=user.email,
        username=user.username,
        xp=user.xp,
        level=user.level,
        created_at=user.created_at.isoformat()
    )


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, session: Session = Depends(get_session)):
    """Login user and return tokens."""
    # Find user
    user = auth_service.get_user_by_email(session, credentials.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not auth_service.verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Create tokens
    token_data = {"sub": str(user.id)}
    access_token = auth_service.create_access_token(token_data)
    refresh_token = auth_service.create_refresh_token(token_data)

    # Create session for refresh token
    expires_at = datetime.utcnow() + timedelta(days=7)
    session_service.create_session(session, user.id, refresh_token, expires_at)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token
    )


@router.post("/refresh", response_model=Token)
def refresh_token(refresh_data: TokenRefresh, session: Session = Depends(get_session)):
    """Refresh access token using refresh token."""
    # Verify refresh token
    session_obj = session_service.get_session_by_token(session, refresh_data.refresh_token)
    if not session_obj:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    if not session_service.is_session_valid(session_obj):
        session_service.delete_session(session, refresh_data.refresh_token)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired"
        )

    # Verify the refresh token is valid
    payload = auth_service.decode_token(refresh_data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    user_id = payload.get("sub")
    user = auth_service.get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    # Create new tokens
    token_data = {"sub": str(user.id)}
    new_access_token = auth_service.create_access_token(token_data)
    new_refresh_token = auth_service.create_refresh_token(token_data)

    # Delete old session and create new one
    session_service.delete_session(session, refresh_data.refresh_token)
    expires_at = datetime.utcnow() + timedelta(days=7)
    session_service.create_session(session, user.id, new_refresh_token, expires_at)

    return Token(
        access_token=new_access_token,
        refresh_token=new_refresh_token
    )


@router.post("/logout")
def logout(
    refresh_data: TokenRefresh,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Logout user by invalidating refresh token."""
    session_service.delete_session(session, refresh_data.refresh_token)
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current user info."""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        xp=current_user.xp,
        level=current_user.level,
        created_at=current_user.created_at.isoformat()
    )

