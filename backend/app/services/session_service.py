from datetime import datetime
from sqlmodel import Session, select, delete

from app.models.session import UserSession


def create_session(session: Session, user_id: int, refresh_token: str, expires_at: datetime) -> UserSession:
    """Create a new user session."""
    user_session = UserSession(
        user_id=user_id,
        refresh_token=refresh_token,
        expires_at=expires_at
    )
    session.add(user_session)
    session.commit()
    return user_session


def get_session_by_token(session: Session, token: str) -> UserSession | None:
    """Get session by refresh token."""
    return session.exec(select(UserSession).where(UserSession.refresh_token == token)).first()


def delete_session(session: Session, token: str) -> None:
    """Delete a session by refresh token."""
    session.exec(delete(UserSession).where(UserSession.refresh_token == token))
    session.commit()


def delete_all_user_sessions(session: Session, user_id: int) -> None:
    """Delete all sessions for a user."""
    session.exec(delete(UserSession).where(UserSession.user_id == user_id))
    session.commit()


def is_session_valid(session: UserSession) -> bool:
    """Check if session is still valid."""
    return session.expires_at > datetime.utcnow()