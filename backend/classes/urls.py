from django.urls import path
from .views import (
    LopHocListCreateView,              # UC06-01, UC06-04
    LopHocDeleteView,                  # UC06-02
    LopHocUpdateView,                  # UC06-03
    KhoiDropdownView,                  # UC06-05
    NienKhoaDropdownView,              # UC06-06
    ToHopDropdownView,                 # UC06-07
    ThemHocSinhVaoLopView,             # UC06-08
    XuatDanhSachLopView                # UC06-09
)

urlpatterns = [
    path('', LopHocListCreateView.as_view()),                         
    path('<int:pk>/', LopHocUpdateView.as_view()),                    
    path('delete/<int:pk>/', LopHocDeleteView.as_view()),            

    path('dropdown/khoi/', KhoiDropdownView.as_view()),              
    path('dropdown/nienkhoa/', NienKhoaDropdownView.as_view()),      
    path('dropdown/tohop/', ToHopDropdownView.as_view()),            

    path('<int:pk>/them-hocsinh/', ThemHocSinhVaoLopView.as_view()),     
    path('<int:pk>/xuat-danh-sach/', XuatDanhSachLopView.as_view()),     
]
