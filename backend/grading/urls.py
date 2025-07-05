from django.urls import path
from grading.views import score_input, score_summary

urlpatterns = [
    # UC09-01: Nhập / Cập nhật điểm
    path("nhap/", score_input.nhap_diem, name="nhap_diem"),
    path("capnhat/", score_input.cap_nhat_diem, name="cap_nhat_diem"),
    path("diem/", score_input.diem_hien_tai, name="diem_hien_tai"),
    path("hocky/", score_input.danh_sach_hocky, name="danh_sach_hocky"),

    # UC09-02: Tổng hợp điểm học kỳ
    path("tonghop/", score_summary.tong_hop_diem_hoc_ky, name="tong_hop_diem_hoc_ky"),

    # UC09-03: Xuất báo cáo học kỳ ra Excel
    path("xuatbaocao/", score_summary.xuat_bao_cao_excel, name="xuat_bao_cao_excel"),
]
