from django.urls import path
from .views import (
    LopHocListView,                   # Danh sách lớp (Bổ sung)
    LopHocListCreateView,            # UC06-01, UC06-04
    LopHocDeleteView,                # UC06-02
    LopHocUpdateView,                # UC06-03
    KhoiDropdownView,                # UC06-05
    NienKhoaDropdownView,            # UC06-06
    ToHopDropdownView,               # UC06-07
    ThemHocSinhVaoLopView,           # UC06-08
    XuatDanhSachLopView              # UC06-09
)

urlpatterns = [
    path('', LopHocListCreateView.as_view()),                          # Tạo + xem danh sách lớp
    path('<int:pk>/', LopHocUpdateView.as_view()),                     # Cập nhật lớp
    path('delete/<int:pk>/', LopHocDeleteView.as_view()),              # Xoá lớp

    # Dropdown APIs
    path('dropdown/khoi/', KhoiDropdownView.as_view()),               
    path('dropdown/nienkhoa/', NienKhoaDropdownView.as_view()),       
    path('dropdown/tohop/', ToHopDropdownView.as_view()),             

    # Các tính năng nâng cao
    path('<int:pk>/them-hocsinh/', ThemHocSinhVaoLopView.as_view()),  # Thêm học sinh vào lớp
    path('<int:pk>/xuat-danh-sach/', XuatDanhSachLopView.as_view()),  # Xuất danh sách lớp

    # Đường dẫn bổ sung
    path('lop/', LopHocListView.as_view()),                            # Danh sách lớp riêng biệt nếu cần
]
