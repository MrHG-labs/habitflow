from datetime import datetime
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    """User model for authentication and profile."""

    __tablename__ = "users"

    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    username: str
    password_hash: str
    xp: int = Field(default=0)
    level: int = Field(default=1)
    created_at: datetime = Field(default_factory=datetime.utcnow)