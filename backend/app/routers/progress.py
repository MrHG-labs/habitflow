from datetime import date as date_type
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.database import get_session
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.progress import ToggleResponse, StreakResponse
from app.services import auth_service, habit_service, progress_service

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.post("/{habit_id}/toggle", response_model=ToggleResponse)
def toggle_habit(
    habit_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Toggle completed state for a habit on today's date. Awards/revokes XP."""
    habit = habit_service.get_habit_by_id(session, habit_id)
    if not habit or habit.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found",
        )

    progress = progress_service.toggle_complete(
        session, habit_id, current_user.id, date_type.today()
    )

    # Award / revoke XP and auto-update level
    updated_user, leveled_up = auth_service.award_xp(
        session, current_user, progress.completed
    )
    xp_delta = auth_service.XP_PER_HABIT if progress.completed else -auth_service.XP_PER_HABIT

    return ToggleResponse(
        id=progress.id,
        habit_id=progress.habit_id,
        user_id=progress.user_id,
        completed=progress.completed,
        completed_at=progress.completed_at.isoformat() if progress.completed_at else None,
        date=progress.date.isoformat(),
        xp_gained=xp_delta,
        user_xp=updated_user.xp,
        user_level=updated_user.level,
        leveled_up=leveled_up,
    )



@router.get("/today", response_model=dict)
def get_today(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Return {habit_id: completed} for all user habits today."""
    habits = habit_service.get_habits_by_user(session, current_user.id)
    habit_ids = [h.id for h in habits]
    if not habit_ids:
        return {}
    return progress_service.get_today_progress(session, current_user.id, habit_ids)


@router.get("/{habit_id}/streak", response_model=StreakResponse)
def get_streak(
    habit_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Get the current streak for a habit."""
    habit = habit_service.get_habit_by_id(session, habit_id)
    if not habit or habit.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found",
        )

    streak = progress_service.calculate_streak(session, habit_id, current_user.id)
    return StreakResponse(habit_id=habit_id, streak=streak)


@router.get("/weekly", response_model=list)
def get_weekly(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Get daily completion counts for the last 7 days (for dashboard)."""
    return progress_service.get_weekly_completions(session, current_user.id)
