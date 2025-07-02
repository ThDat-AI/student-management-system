from django.urls import path, include  # <- đã thêm include ở đây
from . import views

urlpatterns = [
    path('quydinh/', views.ListCreateQuyDinhView.as_view(), name='list-create-quydinh'),
    path('quydinh/latest/', views.LatestQuyDinhView.as_view(), name='latest-quydinh'),
    path('quydinh/<int:IDNienKhoa>/', views.QuyDinhDetailView.as_view(), name='detail-quydinh'),
    path('api/diem/', include('grading.urls')),  # <-- không lỗi nữa
]
