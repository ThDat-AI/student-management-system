from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

# ✅ Trang gốc đơn giản để test server
def home(request):
    return HttpResponse("Welcome to Student Management System backend!")

urlpatterns = [
    # ✅ Trang quản trị Django admin
    path("admin/", admin.site.urls),

    # ✅ Cho phép login/logout trong giao diện duyệt API (Browsable API)
    path("api-auth/", include("rest_framework.urls")),

    # ✅ Các nhóm API chia theo module chức năng
    path("api/auth/", include("authentication.urls")),          # Đăng nhập, JWT
    path("api/accounts/", include("accounts.urls")),            # Người dùng, vai trò
    path("api/configurations/", include("configurations.urls")),# Niên khóa, tham số
    path("api/subjects/", include("subjects.urls")),            # Môn học, tổ hợp

    path("api/classes/", include("classes.urls")),              # Lớp học, khối
    path("api/students/", include("students.urls")),            # Học sinh
    path("api/grading/", include("grading.urls")),              # Điểm số, học kỳ, báo cáo

    #path("api/reporting/", include("reporting.urls")), khum cần nữa
    # ✅ Trang root
    path("", home),
]
