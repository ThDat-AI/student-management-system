from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to Student Management System backend!")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),

    path("api/auth/", include("authentication.urls")),
    path("api/accounts/", include("accounts.urls")),
    path("api/configurations/", include("configurations.urls")),
    
    path('api/diem/', include('grading.urls')),
    path("api/classes/", include("classes.urls")),
    path("", home),  # Đảm bảo hàm home đã được định nghĩa phía trên
]
