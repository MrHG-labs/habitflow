from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.database import get_session
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.habit import HabitCreate, HabitUpdate, HabitResponse
from app.services import habit_service

router = APIRouter(prefix="/habits", tags=["Habits"])


@router.get("/", response_model=list[HabitResponse])
def get_habits(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Get all habits for the current user."""
    habits = habit_service.get_habits_by_user(session, current_user.id)
    return [
        HabitResponse(
            id=h.id,
            user_id=h.user_id,
            name=h.name,
            description=h.description,
            icon=h.icon,
            color=h.color,
            frequency=h.frequency,
            order=h.order,
            created_at=h.created_at.isoformat(),
        )
        for h in habits
    ]


@router.post("/", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
def create_habit(
    data: HabitCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Create a new habit."""
    habit = habit_service.create_habit(session, current_user.id, data)
    return HabitResponse(
        id=habit.id,
        user_id=habit.user_id,
        name=habit.name,
        description=habit.description,
        icon=habit.icon,
        color=habit.color,
        frequency=habit.frequency,
        order=habit.order,
        created_at=habit.created_at.isoformat(),
    )


@router.put("/{habit_id}", response_model=HabitResponse)
def update_habit(
    habit_id: int,
    data: HabitUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Update an existing habit."""
    habit = habit_service.get_habit_by_id(session, habit_id)
    if not habit or habit.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found",
        )

    updated = habit_service.update_habit(session, habit, data)
    return HabitResponse(
        id=updated.id,
        user_id=updated.user_id,
        name=updated.name,
        description=updated.description,
        icon=updated.icon,
        color=updated.color,
        frequency=updated.frequency,
        order=updated.order,
        created_at=updated.created_at.isoformat(),
    )


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_habit(
    habit_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Delete a habit."""
    habit = habit_service.get_habit_by_id(session, habit_id)
    if not habit or habit.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found",
        )

    habit_service.delete_habit(session, habit)
