from datetime import date, datetime, timedelta
from sqlmodel import Session, select

from app.models.progress import HabitProgress


def get_or_create_progress(
    session: Session, habit_id: int, user_id: int, target_date: date
) -> HabitProgress:
    """Get progress entry for a habit on a given date, create if not exists."""
    progress = session.exec(
        select(HabitProgress).where(
            HabitProgress.habit_id == habit_id,
            HabitProgress.user_id == user_id,
            HabitProgress.date == target_date,
        )
    ).first()

    if not progress:
        progress = HabitProgress(
            habit_id=habit_id,
            user_id=user_id,
            date=target_date,
            completed=False,
            completed_at=None,
        )
        session.add(progress)
        session.commit()
        session.refresh(progress)

    return progress


def toggle_complete(
    session: Session, habit_id: int, user_id: int, target_date: date
) -> HabitProgress:
    """Toggle the completed state of a habit for a given date."""
    progress = get_or_create_progress(session, habit_id, user_id, target_date)

    progress.completed = not progress.completed
    progress.completed_at = datetime.utcnow() if progress.completed else None

    session.add(progress)
    session.commit()
    session.refresh(progress)
    return progress


def get_today_progress(
    session: Session, user_id: int, habit_ids: list[int]
) -> dict[int, bool]:
    """Return a dict of {habit_id: completed} for today."""
    today = date.today()
    rows = session.exec(
        select(HabitProgress).where(
            HabitProgress.user_id == user_id,
            HabitProgress.date == today,
            HabitProgress.habit_id.in_(habit_ids),  # type: ignore[attr-defined]
        )
    ).all()
    result = {h_id: False for h_id in habit_ids}
    for row in rows:
        result[row.habit_id] = row.completed
    return result


def calculate_streak(session: Session, habit_id: int, user_id: int) -> int:
    """
    Calculate the consecutive-days streak for a habit up to today.
    Walks backwards day by day from today. Stops as soon as a day is missing
    or not completed.
    """
    today = date.today()
    streak = 0
    current = today

    while True:
        progress = session.exec(
            select(HabitProgress).where(
                HabitProgress.habit_id == habit_id,
                HabitProgress.user_id == user_id,
                HabitProgress.date == current,
            )
        ).first()

        if progress and progress.completed:
            streak += 1
            current -= timedelta(days=1)
        else:
            break

    return streak


def get_weekly_completions(
    session: Session, user_id: int
) -> list[dict]:
    """
    Return daily completion counts for the last 7 days (for dashboard).
    Returns list of {date: str, completed: int}.
    """
    today = date.today()
    result = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        rows = session.exec(
            select(HabitProgress).where(
                HabitProgress.user_id == user_id,
                HabitProgress.date == day,
                HabitProgress.completed == True,  # noqa: E712
            )
        ).all()
        result.append({"date": day.isoformat(), "completed": len(rows)})
    return result
