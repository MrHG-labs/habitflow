from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List

from app.database import get_session
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.achievement import Achievement

router = APIRouter(prefix="/achievements", tags=["Achievements"])

@router.get("/", response_model=List[Achievement])
def get_user_achievements(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Get all achievements granted to the current user."""
    achievements = session.exec(
        select(Achievement)
        .where(Achievement.user_id == current_user.id)
        .order_by(Achievement.granted_at.desc())
    ).all()
    return achievements
