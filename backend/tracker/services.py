from datetime import timedelta
from django.utils import timezone
from .models import DailyLog, Habit
from .stats import HabitStats

def compute_streak(habit: Habit) -> int:
    today = timezone.localdate()

    logs = (
        DailyLog.objects.filter(habit=habit)
        .only("date", "status")
    )
    log_by_date = {l.date: l.status for l in logs}

    streak = 0
    day = today
    while True:
        status = log_by_date.get(day)
        if status == "success":
            streak += 1
            day = day - timedelta(days=1)
            continue
        break

    return streak


def compute_habit_stats(habit: Habit) -> HabitStats:
    total_success = DailyLog.objects.filter(habit=habit, status="success").count()
    total_relapse = DailyLog.objects.filter(habit=habit, status="relapse").count()
    streak = compute_streak(habit)

    goal = habit.goal_days or 0
    progress = 0
    if goal > 0:
        progress = round(min(100, (total_success / goal) * 100))

    return HabitStats(
        streak=streak,
        total_success_days=total_success,
        total_relapse_count=total_relapse,
        goal_days=goal,
        progress_percentage=progress,
    )
