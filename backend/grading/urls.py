from django.urls import path
from grading.views import score_input, score_summary, report_export
from grading.views.hocky import HocKyListView


urlpatterns = [
    path('nhap/', score_input.nhap_diem, name='nhap_diem'),
    path('capnhat/<int:diem_id>/', score_input.cap_nhat_diem, name='cap_nhat_diem'),
    path('diem/', score_input.lay_diem, name='lay_diem'),

    path('tonghop/', score_summary.tong_hop_diem_hoc_ky, name='tong_hop_diem'),
    path('baocao/', report_export.xuat_bao_cao_excel, name='xuat_bao_cao'),

    path('hocky/', HocKyListView.as_view(), name='danh_sach_hoc_ky'),
]
