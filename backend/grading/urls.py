from django.urls import path
from grading.views import score_input

urlpatterns = [
    path('nhap/', score_input.nhap_diem, name='nhap_diem'),
    path('capnhat/<int:diem_id>/', score_input.cap_nhat_diem, name='cap_nhat_diem'),
    # chuẩn bị cho UC09-02 và UC09-03
    # path('tonghop/', score_summary.tong_hop_diem, ...),
    # path('baocao/', report_export.xuat_bao_cao, ...),
]
