from datetime import datetime
from sqlmodel import Field, SQLModel


class UserSession(SQLModel, table=True):
    """User session for refresh tokens."""

    __tablename__ = "user_sessions"

    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    refresh_token: str = Field(unique=True, index=True)
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)