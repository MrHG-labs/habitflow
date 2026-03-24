from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlmodel import Session, select

from app.database import get_session
from app.models.user import User
from app.models.habit import Habit
from app.models.progress import HabitProgress
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.schemas.token import Token, TokenRefresh
from app.services import auth_service, session_service
from app.dependencies.auth import get_current_user
from app.dependencies.rate_limiter import limiter

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")
def register(request: Request, user_data: UserCreate, session: Session = Depends(get_session)):
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
@limiter.limit("5/minute")
def login(request: Request, credentials: UserLogin, session: Session = Depends(get_session)):
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


@router.get("/export")
def export_user_data(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Export all user data (profile, habits, progress) as JSON."""
    habits = session.exec(
        select(Habit).where(Habit.user_id == current_user.id)
    ).all()
    
    progress = session.exec(
        select(HabitProgress).where(HabitProgress.user_id == current_user.id)
    ).all()

    return {
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "username": current_user.username,
            "xp": current_user.xp,
            "level": current_user.level,
            "created_at": current_user.created_at.isoformat()
        },
        "habits": [
            {
                "id": h.id,
                "name": h.name,
                "description": h.description,
                "icon": h.icon,
                "color": h.color,
                "frequency": h.frequency,
                "category": h.category,
                "reminder_time": h.reminder_time,
                "order": h.order,
                "created_at": h.created_at.isoformat()
            } for h in habits
        ],
        "progress": [
            {
                "id": p.id,
                "habit_id": p.habit_id,
                "completed": p.completed,
                "date": p.date.isoformat(),
                "completed_at": p.completed_at.isoformat() if p.completed_at else None
            } for p in progress
        ]
    }

