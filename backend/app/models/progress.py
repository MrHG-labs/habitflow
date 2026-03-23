from datetime import date, datetime
from sqlmodel import Field, SQLModel


class HabitProgress(SQLModel, table=True):
    """Habit progress tracking model."""

    __tablename__ = "habit_progress"

    id: int | None = Field(default=None, primary_key=True)
    habit_id: int = Field(foreign_key="habits.id")
    user_id: int = Field(foreign_key="users.id")
    completed: bool = Field(default=False)
    completed_at: datetime | None = None
    date: date  # Fecha del registro (único por habit+date)
