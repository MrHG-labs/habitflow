from datetime import datetime
from sqlmodel import Field, SQLModel


class Achievement(SQLModel, table=True):
    """Achievement (Souvenir) model."""

    __tablename__ = "achievements"

    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    
    # Snapshot of the habit's state at the moment of achievement
    habit_id: int | None = Field(default=None, index=True)
    habit_name_snapshot: str
    habit_icon_snapshot: str = Field(default="📌")
    
    milestone_days: int # 3, 10, 21, 50, 100
    medal_type: str    # "Bronze", "Silver", etc.
    
    granted_at: datetime = Field(default_factory=datetime.utcnow)
