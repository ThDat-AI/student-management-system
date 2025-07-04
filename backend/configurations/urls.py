from django.urls import path
from . import views
from .views import NienKhoaDropdownView

urlpatterns = [
    path('quydinh/', views.ListCreateQuyDinhView.as_view(), name='list-create-quydinh'),
    path('quydinh/latest/', views.LatestQuyDinhView.as_view(), name='latest-quydinh'),
    path('quydinh/<int:IDNienKhoa>/', views.QuyDinhDetailView.as_view(), name='detail-quydinh'),
    
    path('nienkhoa/', NienKhoaDropdownView.as_view(), name='dropdown-nienkhoa'),

]
