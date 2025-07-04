from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

# Trang chào mừng (home)
def home(request):
    return HttpResponse("Welcome to Student Management System backend!")

urlpatterns = [
    # Trang quản trị Django
    path("admin/", admin.site.urls),

    # Đăng nhập cho giao diện browsable API của DRF
    path("api-auth/", include("rest_framework.urls")),

    # Các app nội bộ của hệ thống
    path("api/auth/", include("authentication.urls")),       # Xác thực
    path("api/accounts/", include("accounts.urls")),          # Quản lý tài khoản
    path("api/configurations/", include("configurations.urls")),  # Cấu hình hệ thống
    path("api/diem/", include("grading.urls")),               # Quản lý điểm
    path("api/classes/", include("classes.urls")),            # Quản lý lớp học

    # Trang root test
    path("", home),  # GET http://localhost:8000 → sẽ thấy dòng Welcome
]
