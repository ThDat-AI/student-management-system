from django.urls import path
from . import views

urlpatterns = [
    # Quản lý tài khoản bởi BGH
    path("management/create/", views.CreateTaiKhoanView.as_view(), name="admin-create-taikhoan"),
    path("management/", views.ListTaiKhoanView.as_view(), name="admin-list-taikhoan"),
    path("management/<int:pk>/update/", views.UpdateTaiKhoanView.as_view(), name="admin-update-taikhoan"),
    path("management/<int:pk>/delete/", views.DeleteTaiKhoanView.as_view(), name="admin-delete-taikhoan"),
    
    # Hồ sơ cá nhân của người dùng
    path("me/", views.UserProfileView.as_view(), name="user-profile-me"),

    # Các API phụ trợ
    path('roles/', views.ListVaiTroView.as_view(), name='list-vaitro'),
    path('dashboard-stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
]