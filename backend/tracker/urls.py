from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import HabitViewSet, TriggerViewSet, DailyLogViewSet
from .views_auth import RegisterView

router = DefaultRouter()
router.register("habits", HabitViewSet, basename="habits")
router.register("triggers", TriggerViewSet, basename="triggers")
router.register("logs", DailyLogViewSet, basename="logs")

urlpatterns = [
    path("auth/register/", RegisterView.as_view()),
]

urlpatterns += router.urls
