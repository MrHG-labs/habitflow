from datetime import date, datetime, timedelta
from sqlmodel import Session, select

from app.models.progress import HabitProgress
from app.models.habit import Habit
from app.models.achievement import Achievement
from app.dependencies.timezone import get_today_user



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

    # Si se completó, verificar si alcanzó algún hito de medalla
    if progress.completed:
        check_and_grant_achievement(session, habit_id, user_id, date)

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


def calculate_streak(session: Session, habit_id: int, user_id: int, target_date: date) -> tuple[int, int]:
    """
    Calculate the consecutive-days streak for a habit up to today.
    Uses interval gaps to support flexible frequencies (every_other_day, weekly, etc).
    """
    habit = session.get(Habit, habit_id)
    if not habit:
        return 0, 0

    freq_map = {
        "daily": 1,
        "every_other_day": 2,
        "weekly": 7,
        "biweekly": 14,
        "monthly": 31
    }
    max_gap = freq_map.get(habit.frequency, 1)

    completed_progress = session.exec(
        select(HabitProgress)
        .where(
            HabitProgress.habit_id == habit_id,
            HabitProgress.user_id == user_id,
            HabitProgress.completed == True,  # noqa: E712
            HabitProgress.date <= target_date
        )
        .order_by(HabitProgress.date.desc())
    ).all()

    if not completed_progress:
        days_total = (target_date - habit.created_at.date()).days
        # Solo consideramos abandono si supera la periodicidad base
        return 0, max(0, days_total - max_gap + 1)

    days_since_last = (target_date - completed_progress[0].date).days

    # Solo hay "Abandono" si excedemos el gap de la periodicidad (max_gap)
    effective_neglect = max(0, days_since_last - max_gap)

    # Check if the streak is already broken up to target_date
    if days_since_last > max_gap:
        return 0, effective_neglect

    streak = 0
    last_date = None
    for p in completed_progress:
        if last_date is None:
            streak = 1
            last_date = p.date
        else:
            gap = (last_date - p.date).days
            if gap <= max_gap:
                streak += 1
                last_date = p.date
            else:
                break

    return streak, effective_neglect


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


def get_dashboard_summary(session: Session, user_id: int, target_date: date) -> dict:
    """Get all summary info for the dashboard at once."""
    from app.models.habit import Habit
    from sqlmodel import select
    habits = session.exec(select(Habit).where(Habit.user_id == user_id)).all()
    
    # 0. Base case
    if not habits:
        return {
            "completed_today": 0,
            "total_habits": 0,
            "momentum_pct": 100,
            "streak_count": 0,
            "weekly_progress": get_weekly_completions(session, user_id, target_date)
        }

    # 1. Today's progress
    habit_ids = [h.id for h in habits]
    today_progress_map = get_today_progress(session, user_id, habit_ids, target_date)
    completed_today = sum(1 for v in today_progress_map.values() if v)

    # 2. Streaks and Neglect
    streaks_data = [calculate_streak(session, h.id, user_id, target_date) for h in habits]
    max_streak = max((s[0] for s in streaks_data), default=0)
    
    # 3. Momentum: penalized by neglect 
    # Momentum = 100% - (ratio of neglected habits * 100)
    neglected_count = sum(1 for s in streaks_data if s[1] >= 1)
    momentum = 100 - int((neglected_count / len(habits)) * 100)

    return {
        "completed_today": completed_today,
        "total_habits": len(habits),
        "momentum_pct": max(0, momentum),
        "streak_count": max_streak,
        "weekly_progress": get_weekly_completions(session, user_id, target_date)
    }


def check_and_grant_achievement(session: Session, habit_id: int, user_id: int, target_date: date):
    """Check if the current streak reached a milestone and grant a permanent achievement."""
    streak, _ = calculate_streak(session, habit_id, user_id, target_date)
    
    milestones = {
        3: "Flame",
        10: "Bronze",
        21: "Silver",
        50: "Gold",
        100: "Diamond"
    }
    
    if streak in milestones:
        # Check if already granted for this habit and milestone
        existing = session.exec(
            select(Achievement).where(
                Achievement.user_id == user_id,
                Achievement.habit_id == habit_id,
                Achievement.milestone_days == streak
            )
        ).first()
        
        if not existing:
            habit = session.get(Habit, habit_id)
            if not habit: return

            new_achievement = Achievement(
                user_id=user_id,
                habit_id=habit_id,
                habit_name_snapshot=habit.name,
                habit_icon_snapshot=habit.icon,
                milestone_days=streak,
                medal_type=milestones[streak]
            )
            session.add(new_achievement)
            session.commit()

