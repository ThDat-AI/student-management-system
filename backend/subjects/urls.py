from django.urls import path
from .views import MonHocListView

urlpatterns = [
    path('monhoc/', MonHocListView.as_view()),
]
