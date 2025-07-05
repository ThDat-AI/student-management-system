#subjects/urls.py

from django.urls import path
from .views import danh_sach_monhoc

urlpatterns = [
    path('monhoc/', danh_sach_monhoc),
]
