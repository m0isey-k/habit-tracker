from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Habit, DailyLog, Trigger
from .serializers import HabitSerializer, DailyLogSerializer, TriggerSerializer


class HabitViewSet(viewsets.ModelViewSet):
    serializer_class = HabitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Habit.objects.filter(owner=self.request.user).order_by("-is_active", "-created_at", "-id")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=["get"])
    def active(self, request):
        habits = Habit.objects.filter(owner=request.user, is_active=True).order_by("-created_at", "-id")
        return Response(HabitSerializer(habits, many=True).data)

    @action(detail=True, methods=["get"])
    def stats(self, request, pk=None):
        habit = self.get_object()
        logs = DailyLog.objects.filter(owner=request.user, habit=habit).order_by("date")

        total_success_days = logs.filter(status="success").count()
        total_relapse_count = logs.filter(status="relapse").count()

        streak = 0
        for log in reversed(list(logs)):
            if log.status != "success":
                break
            streak += 1

        goal_days = habit.goal_days
        progress_percentage = 0
        if goal_days and goal_days > 0:
            progress_percentage = min(100, round((total_success_days / goal_days) * 100))

        return Response(
            {
                "streak": streak,
                "total_success_days": total_success_days,
                "total_relapse_count": total_relapse_count,
                "goal_days": goal_days,
                "progress_percentage": progress_percentage,
            }
        )


class TriggerViewSet(viewsets.ModelViewSet):
    serializer_class = TriggerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Trigger.objects.filter(owner=self.request.user).order_by("-id")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class DailyLogViewSet(viewsets.ModelViewSet):
    serializer_class = DailyLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = DailyLog.objects.filter(owner=self.request.user).order_by("-date", "-id")
        habit_id = self.request.query_params.get("habit_id")
        if habit_id:
            return qs.filter(habit_id=habit_id)
        return qs

    def perform_create(self, serializer):
        habit = serializer.validated_data.get("habit")
        if habit.owner_id != self.request.user.id:
            raise PermissionError("Habit does not belong to the current user.")
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        habit = serializer.validated_data.get("habit", serializer.instance.habit)
        if habit.owner_id != self.request.user.id:
            raise PermissionError("Habit does not belong to the current user.")
        serializer.save()
