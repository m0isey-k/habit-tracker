from django.conf import settings
from django.db import models


class Habit(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="habits",
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=200)
    start_date = models.DateField()
    goal_days = models.PositiveIntegerField(default=30)
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "-id"]

    def __str__(self):
        return self.name


class Trigger(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="triggers",
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        return self.name


class DailyLog(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="logs",
        null=True,
        blank=True,
    )
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name="logs")
    date = models.DateField()
    status = models.CharField(max_length=20, choices=[("success", "success"), ("relapse", "relapse")])
    note = models.TextField(blank=True, null=True)
    trigger = models.ForeignKey(Trigger, on_delete=models.SET_NULL, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["habit", "date"], name="unique_habit_date")
        ]
        ordering = ["-date", "-id"]

    def __str__(self):
        return f"{self.habit.name} {self.date} {self.status}"
