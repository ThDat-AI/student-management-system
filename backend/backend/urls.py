# backend/urls.py

from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to Student Management System backend!")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),

    # Nhóm API theo chuẩn RESTful, đặt chung dưới /api/
    path("api/auth/", include("authentication.urls")),
    path("api/accounts/", include("accounts.urls")),
    path("api/configurations/", include("configurations.urls")),
    path("api/subjects/", include("subjects.urls")),     # 👈 Thêm /api/
    path("api/classes/", include("classes.urls")),
    path("api/students/", include("students.urls")),     # 👈 Thêm /api/
    path("api/grading/", include("grading.urls")),       # 👈 Thống nhất grading ở đây

    path("", home),
]
