from django.urls import path
from .views import danh_sach_hoc_sinh_theo_lop

urlpatterns = [
    path("danhsach/", danh_sach_hoc_sinh_theo_lop),
]
