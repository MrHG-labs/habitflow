from datetime import datetime
from sqlmodel import Field, SQLModel


class Habit(SQLModel, table=True):
    """Habit model."""

    __tablename__ = "habits"

    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    name: str
    description: str | None = None
    icon: str = Field(default="📌")
    color: str = Field(default="#6366f1")
    frequency: str = Field(default="daily")  # daily, weekly
    order: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
