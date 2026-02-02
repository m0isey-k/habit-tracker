from rest_framework import serializers
from .models import Habit, Trigger, DailyLog


class HabitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = ["id", "name", "start_date", "goal_days", "is_active", "created_at"]


class TriggerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trigger
        fields = ["id", "name", "created_at"]


class DailyLogSerializer(serializers.ModelSerializer):
    habit_id = serializers.IntegerField(source="habit.id", read_only=True)
    trigger_id = serializers.IntegerField(source="trigger.id", read_only=True)

    class Meta:
        model = DailyLog
        fields = [
            "id",
            "habit",
            "habit_id",
            "date",
            "status",
            "note",
            "trigger",
            "trigger_id",
            "created_at",
        ]


class HabitStatsSerializer(serializers.Serializer):
    streak = serializers.IntegerField()
    total_success_days = serializers.IntegerField()
    total_relapse_count = serializers.IntegerField()
    goal_days = serializers.IntegerField()
    progress_percentage = serializers.IntegerField()
