#classes/urls.py

from django.urls import path
from .views import danh_sach_lop

urlpatterns = [
    path('lop/', danh_sach_lop),
]
