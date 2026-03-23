from pydantic import BaseModel


class ProgressResponse(BaseModel):
    """Schema for a single habit progress entry."""
    id: int
    habit_id: int
    user_id: int
    completed: bool
    completed_at: str | None
    date: str

    class Config:
        from_attributes = True


class DayProgressResponse(BaseModel):
    """Schema for the progress state of a habit on a given day."""
    habit_id: int
    date: str
    completed: bool


class StreakResponse(BaseModel):
    """Schema for habit streak info."""
    habit_id: int
    streak: int          # consecutive days completed up to today
