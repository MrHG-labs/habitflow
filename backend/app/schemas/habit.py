from pydantic import BaseModel


class HabitBase(BaseModel):
    """Base habit schema."""
    name: str
    description: str | None = None
    icon: str = "📌"
    color: str = "#6366f1"
    frequency: str = "daily"


class HabitCreate(HabitBase):
    """Schema for creating a habit."""
    pass


class HabitUpdate(BaseModel):
    """Schema for updating a habit."""
    name: str | None = None
    description: str | None = None
    icon: str | None = None
    color: str | None = None
    frequency: str | None = None
    order: int | None = None


class HabitResponse(HabitBase):
    """Schema for habit response."""
    id: int
    user_id: int
    order: int
    created_at: str

    class Config:
        from_attributes = True
