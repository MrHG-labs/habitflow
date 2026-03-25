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


# ── Gamification ── #

XP_PER_HABIT = 10

# Level thresholds: XP needed to reach each level.
# Level 1 = 0, Level 2 = 500, Level 3 = 1250, Level 4 = 2250, Level 5 = 3500, ...
LEVEL_THRESHOLDS = [0, 500, 1250, 2250, 3500, 5000, 6750, 8750, 11000, 13500, 16250]



def calculate_level(xp: int) -> int:
    """Return the level corresponding to a given XP total."""
    level = 1
    for idx, threshold in enumerate(LEVEL_THRESHOLDS):
        if xp >= threshold:
            level = idx + 1
        else:
            break
    return level


def award_xp(session: Session, user: User, completed: bool) -> tuple[User, bool]:
    """
    Award or revoke XP when a habit is toggled.
    Returns (updated_user, leveled_up).
    """
    old_level = user.level

    if completed:
        user.xp = max(0, user.xp + XP_PER_HABIT)
    else:
        user.xp = max(0, user.xp - XP_PER_HABIT)

    user.level = calculate_level(user.xp)
    leveled_up = user.level > old_level

    session.add(user)
    session.commit()
    session.refresh(user)
    return user, leveled_up