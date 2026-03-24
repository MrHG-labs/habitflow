from datetime import date, datetime, timedelta
from sqlmodel import Session, select

from app.models.progress import HabitProgress
from app.models.habit import Habit


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
    session: Session, user_id: int, habit_ids: list[int], target_date: date
) -> dict[int, bool]:
    """Return a dict of {habit_id: completed} for today."""
    today = target_date
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


def calculate_streak(session: Session, habit_id: int, user_id: int, target_date: date) -> int:
    """
    Calculate the consecutive-days streak for a habit up to today.
    Walks backwards day by day from today. Stops as soon as a day is missing
    or not completed.
    """
    today = target_date
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
    session: Session, user_id: int, target_date: date
) -> list[dict]:
    """
    Return daily completion counts for the last 7 days (for dashboard).
    Returns list of {date: str, completed: int}.
    """
    today = target_date
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


def get_advanced_analytics(
    session: Session, user_id: int, target_date: date
) -> dict:
    """
    Returns data for advanced charts:
    - heatmap: last 365 days of completion counts.
    - categories: completion percentage per category.
    - days_of_week: average completion by day of week.
    """
    today = target_date
    start_date = today - timedelta(days=364)

    # 1. Heatmap Data
    heatmap_rows = session.exec(
        select(HabitProgress).where(
            HabitProgress.user_id == user_id,
            HabitProgress.date >= start_date,
            HabitProgress.date <= today,
            HabitProgress.completed == True  # noqa: E712
        )
    ).all()
    
    heatmap_counts = {}
    for r in heatmap_rows:
        dk = r.date.isoformat()
        heatmap_counts[dk] = heatmap_counts.get(dk, 0) + 1
        
    heatmap_data = [{"date": dk, "count": heatmap_counts[dk]} for dk in heatmap_counts]

    # 2. Categories breakdown
    user_habits = session.exec(
        select(Habit).where(Habit.user_id == user_id)
    ).all()
    
    category_data = []
    if user_habits:
        habit_dict = {h.id: h.category for h in user_habits}
        all_progress = session.exec(
            select(HabitProgress).where(
                HabitProgress.user_id == user_id,
                HabitProgress.habit_id.in_(list(habit_dict.keys())),
                HabitProgress.completed == True  # noqa: E712
            )
        ).all()
        
        cat_counts = {}
        for p in all_progress:
            cat = habit_dict.get(p.habit_id, 'other')
            cat_counts[cat] = cat_counts.get(cat, 0) + 1
            
        for cat, val in cat_counts.items():
            category_data.append({"category": cat, "value": val})

    # 3. Days of the week breakdown
    # Calculate for the last 90 days for relevant recent habit performance
    dow_start = today - timedelta(days=89)
    dow_rows = session.exec(
        select(HabitProgress).where(
            HabitProgress.user_id == user_id,
            HabitProgress.date >= dow_start,
            HabitProgress.date <= today,
            HabitProgress.completed == True  # noqa: E712
        )
    ).all()
    
    dow_counts = {i: 0 for i in range(7)}
    for r in dow_rows:
        dow = r.date.weekday() # Monday=0, Sunday=6
        dow_counts[dow] += 1
        
    days_of_week_data = [{"day": k, "count": v} for k, v in dow_counts.items()]

    return {
        "heatmap": heatmap_data,
        "categories": category_data,
        "days_of_week": days_of_week_data
    }
