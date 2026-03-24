from datetime import date as date_type
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Request
from sqlmodel import Session
from pydantic import BaseModel

from app.database import get_session
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.progress import ToggleResponse, StreakResponse, DashboardSummary
from app.services import auth_service, habit_service, progress_service
from app.dependencies.timezone import get_user_timezone, get_today_user
from app.dependencies.rate_limiter import limiter
from app.utils.websocket import manager

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.get("/summary", response_model=DashboardSummary)
def get_summary(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    tz: str = Depends(get_user_timezone),
):
    """Get all summary info for the dashboard at once."""
    local_today = date_type.fromisoformat(get_today_user(tz))
    return progress_service.get_dashboard_summary(session, current_user.id, local_today)


@router.post("/{habit_id}/toggle", response_model=ToggleResponse)
def toggle_habit(
    habit_id: int,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    tz: str = Depends(get_user_timezone),
):
    """Toggle completed state for a habit on today's local date. Awards/revokes XP."""
    habit = habit_service.get_habit_by_id(session, habit_id)
    if not habit or habit.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found",
        )

    local_today = date_type.fromisoformat(get_today_user(tz))
    progress = progress_service.toggle_complete(
        session, habit_id, current_user.id, local_today
    )

    # Award / revoke XP and auto-update level
    updated_user, leveled_up = auth_service.award_xp(
        session, current_user, progress.completed
    )
    xp_delta = auth_service.XP_PER_HABIT if progress.completed else -auth_service.XP_PER_HABIT

    background_tasks.add_task(manager.broadcast_to_user, current_user.id, {"type": "invalidate_habits"})

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
    tz: str = Depends(get_user_timezone),
):
    """Return {habit_id: completed} for all user habits today."""
    habits = habit_service.get_habits_by_user(session, current_user.id)
    habit_ids = [h.id for h in habits]
    if not habit_ids:
        return {}
    local_today = date_type.fromisoformat(get_today_user(tz))
    return progress_service.get_today_progress(session, current_user.id, habit_ids, local_today)


@router.get("/{habit_id}/streak", response_model=StreakResponse)
def get_streak(
    habit_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    tz: str = Depends(get_user_timezone),
):
    """Get the current streak for a habit."""
    habit = habit_service.get_habit_by_id(session, habit_id)
    if not habit or habit.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found",
        )

    local_today = date_type.fromisoformat(get_today_user(tz))
    streak_count, days_neglected = progress_service.calculate_streak(session, habit_id, current_user.id, local_today)
    return StreakResponse(habit_id=habit_id, streak=streak_count, days_neglected=days_neglected)


@router.get("/weekly", response_model=list)
def get_weekly(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    tz: str = Depends(get_user_timezone),
):
    """Get daily completion counts for the last 7 days (for dashboard)."""
    local_today = date_type.fromisoformat(get_today_user(tz))
    return progress_service.get_weekly_completions(session, current_user.id, local_today)


@router.get("/analytics", response_model=dict)
def get_analytics(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    tz: str = Depends(get_user_timezone),
):
    """Get advanced analytics for the user."""
    local_today = date_type.fromisoformat(get_today_user(tz))
    return progress_service.get_advanced_analytics(session, current_user.id, local_today)


class FocusSession(BaseModel):
    duration_minutes: int

class FocusRewardResponse(BaseModel):
    xp_gained: int
    user_xp: int
    new_level: int
    leveled_up: bool

@router.post("/focus/reward", response_model=FocusRewardResponse)
@limiter.limit("2/minute")
def focus_reward(
    request: Request,
    session_data: FocusSession,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    tz: str = Depends(get_user_timezone),
):
    """Reward user for completing a focus session (Pomodoro timer). Max 120 mins."""
    if session_data.duration_minutes <= 0 or session_data.duration_minutes > 120:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limíte de duración de enfoque superado (Mínimo 1 min, Máximo 120 min)"
        )

    xp_delta = session_data.duration_minutes * 2
    
    current_user.xp += xp_delta
    # Use existing rule for levels
    from app.services import auth_service
    new_level = auth_service.calculate_level(current_user.xp)
    leveled_up = new_level > current_user.level
    current_user.level = new_level
    
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    
    return FocusRewardResponse(
        xp_gained=xp_delta,
        leveled_up=leveled_up,
        user_xp=current_user.xp,
        new_level=current_user.level
    )
