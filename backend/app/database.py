from sqlmodel import SQLModel, create_engine, Session
from typing import Generator

from app.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    echo=True,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)


def init_db() -> None:
    """Initialize database tables."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Get database session."""
    with Session(engine) as session:
        yield session