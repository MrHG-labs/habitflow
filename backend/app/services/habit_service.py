from sqlmodel import Session, select

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
    )
    session.add(habit)
    session.commit()
    session.refresh(habit)
    return habit


def update_habit(session: Session, habit: Habit, data: HabitUpdate) -> Habit:
    """Update an existing habit."""
    update_data = data.model_dump(exclude_unset=True)
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
