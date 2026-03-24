from datetime import datetime, timezone
from sqlmodel import Session, select
from fastapi import HTTPException

from app.models.habit import Habit
from app.schemas.habit import HabitCreate, HabitUpdate


def get_habits_by_user(session: Session, user_id: int) -> list[Habit]:
    """Get all habits for a user."""
    return list(session.exec(
        select(Habit).where(Habit.user_id == user_id).order_by(Habit.order)
    ).all())


def get_habit_by_id(session: Session, habit_id: int) -> Habit | None:
    """Get a habit by ID."""
    return session.get(Habit, habit_id)


def create_habit(session: Session, user_id: int, data: HabitCreate) -> Habit:
    """Create a new habit."""
    habit = Habit(
        user_id=user_id,
        name=data.name,
        description=data.description,
        icon=data.icon,
        color=data.color,
        frequency=data.frequency,
        category=data.category,
        reminder_time=data.reminder_time,
    )
    session.add(habit)
    session.commit()
    session.refresh(habit)
    return habit


def update_habit(session: Session, habit: Habit, data: HabitUpdate) -> Habit:
    """Update an existing habit with integrity check."""
    now = datetime.now(timezone.utc)
    created_at = habit.created_at
    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)
        
    diff_days = (now - created_at).total_seconds() / (3600 * 24)
    update_data = data.model_dump(exclude_unset=True)
    
    if diff_days >= 7:
        # Lock fields: name, frequency, category, icon
        protected = ["name", "frequency", "category", "icon"]
        for field in protected:
            if field in update_data and update_data[field] != getattr(habit, field):
                raise HTTPException(
                    status_code=403, 
                    detail="Este hábito ha sido verificado por tu consistencia y ya no puede ser editado para mantener la integridad de tus logros. 🔒"
                )

    for key, value in update_data.items():
        setattr(habit, key, value)
    session.add(habit)
    session.commit()
    session.refresh(habit)
    return habit


def delete_habit(session: Session, habit: Habit) -> None:
    """Delete a habit."""
    session.delete(habit)
    session.commit()
