# /api/urls.py
from django.urls import path
from . import views

urlpatterns = [    
    # Tài khoản endpoints
    path("taikhoan/create/", views.CreateTaiKhoanView.as_view(), name="register"),
    path("taikhoan/", views.ListTaiKhoanView.as_view(), name="list-taikhoan"), # xem danh sach tai khoan
    path("taikhoan/<int:pk>/update/", views.UpdateTaiKhoanView.as_view(), name="update-taikhoan"), # sua tai khoan
    path("taikhoan/<int:pk>/delete/", views.DeleteTaiKhoanView.as_view(), name="delete-taikhoan"), # xoa tai khoan

    path('vaitro/', views.ListVaiTroView.as_view(), name='list-vaitro'),

    path('taikhoan/me/', views.UserProfileView.as_view(), name='user-profile-me'),

    path('thongke/dashboard/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
]