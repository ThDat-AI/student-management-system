# your_project/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),

    # Điều hướng đến các app tương ứng
    path("api/auth/", include("authentication.urls")),
    path("api/accounts/", include("accounts.urls")),
]