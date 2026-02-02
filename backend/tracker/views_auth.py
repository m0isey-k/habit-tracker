from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = (request.data.get("username") or "").strip()
        password = request.data.get("password") or ""

        errors = {}

        if not username:
            errors["username"] = ["This field is required."]
        elif User.objects.filter(username=username).exists():
            errors["username"] = ["A user with that username already exists."]

        if not password:
            errors["password"] = ["This field is required."]
        elif len(password) < 6:
            errors["password"] = ["Password must be at least 6 characters long."]

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        User.objects.create_user(username=username, password=password)
        return Response({"detail": "registered"}, status=status.HTTP_201_CREATED)
