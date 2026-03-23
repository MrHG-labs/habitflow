from fastapi import Header
from typing import Optional
from datetime import datetime
import zoneinfo

def get_user_timezone(x_timezone: Optional[str] = Header(None, alias="X-Timezone")) -> str:
    """
    Extract timezone from X-Timezone header.
    Defaults to UTC if not provided or invalid.
    """
    if not x_timezone:
        return "UTC"
    
    try:
        # Validate timezone name
        zoneinfo.ZoneInfo(x_timezone)
        return x_timezone
    except Exception:
        return "UTC"

def get_now_user(tz_name: str) -> datetime:
    """Get current datetime in the user's timezone."""
    return datetime.now(zoneinfo.ZoneInfo(tz_name))

def get_today_user(tz_name: str) -> str:
    """Get ISO date string for TODAY in user's timezone."""
    return get_now_user(tz_name).date().isoformat()
