from datetime import datetime, timedelta
from jose import JWTError, jwt
from pwdlib import PasswordHash
from sqlmodel import Session, select

from app.config import settings
from app.models.user import User

password_hash = PasswordHash.recommended()


def create_access_token(data: dict) -> str:
    """Create JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: dict) -> str:
    """Create JWT refresh token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> dict | None:
    """Decode and verify JWT token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None


def hash_password(password: str) -> str:
    """Hash a password."""
    return password_hash.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash."""
    return password_hash.verify(password, hashed)


def get_user_by_email(session: Session, email: str) -> User | None:
    """Get user by email."""
    return session.exec(select(User).where(User.email == email)).first()


def get_user_by_id(session: Session, user_id: int) -> User | None:
    """Get user by ID."""
    return session.get(User, user_id)


def create_user(session: Session, email: str, username: str, password: str) -> User:
    """Create a new user."""
    user = User(
        email=email,
        username=username,
        password_hash=hash_password(password)
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user