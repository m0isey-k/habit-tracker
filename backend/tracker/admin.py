from django.contrib import admin
from .models import Habit, Trigger, DailyLog

@admin.register(Habit)
class HabitAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "start_date", "goal_days", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name",)

@admin.register(Trigger)
class TriggerAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_at")
    search_fields = ("name",)

@admin.register(DailyLog)
class DailyLogAdmin(admin.ModelAdmin):
    list_display = ("id", "habit", "date", "status", "trigger", "created_at")
    list_filter = ("status", "date")
    search_fields = ("habit__name", "note")
