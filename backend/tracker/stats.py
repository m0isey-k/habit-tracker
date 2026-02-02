from dataclasses import dataclass

@dataclass
class HabitStats:
    streak: int
    total_success_days: int
    total_relapse_count: int
    goal_days: int
    progress_percentage: int
