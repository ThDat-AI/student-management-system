from django.shortcuts import render
from rest_framework import generics, permissions, status, views
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .models import LopHoc, Khoi, LopHoc_HocSinh
from configurations.models import NienKhoa, ThamSo
from subjects.models import ToHop
from students.models import HocSinh

from openpyxl import Workbook
from django.http import HttpResponse
from students.models import HocSinh
from .models import LopHoc, LopHoc_HocSinh


from .serializers import (
    LopHocSerializer,
    KhoiSerializer,
    NienKhoaSerializer,
    ToHopSerializer
)

# ---------------------------
# UC06-01 & UC06-04: Thêm và hiển thị danh sách lớp
class LopHocListCreateView(generics.ListCreateAPIView):
    queryset = LopHoc.objects.all().select_related('IDKhoi', 'IDNienKhoa', 'IDToHop')
    serializer_class = LopHocSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Kiểm tra sĩ số nhập vào có >= sĩ số tối thiểu không
        tham_so = ThamSo.objects.first()
        si_so_toi_thieu = tham_so.SiSoToiThieu if tham_so else 0

        si_so_lop = serializer.validated_data.get("SiSo", 0)
        if si_so_lop < si_so_toi_thieu:
            raise ValidationError(f"Sĩ số lớp phải ≥ sĩ số tối thiểu ({si_so_toi_thieu}).")

        serializer.save()

# ---------------------------
# UC06-02: Xoá lớp học
class LopHocDeleteView(generics.DestroyAPIView):
    queryset = LopHoc.objects.all()
    serializer_class = LopHocSerializer
    permission_classes = [permissions.IsAuthenticated]

# ---------------------------
# UC06-03: Cập nhật lớp học
class LopHocUpdateView(generics.RetrieveUpdateAPIView):
    queryset = LopHoc.objects.all()
    serializer_class = LopHocSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        # Optional: Kiểm tra lại sĩ số tối thiểu khi cập nhật
        tham_so = ThamSo.objects.first()
        si_so_toi_thieu = tham_so.SiSoToiThieu if tham_so else 0

        si_so_lop = serializer.validated_data.get("SiSo", 0)
        if si_so_lop < si_so_toi_thieu:
            raise ValidationError(f"Sĩ số lớp phải ≥ sĩ số tối thiểu ({si_so_toi_thieu}).")

        serializer.save()

# ---------------------------
# UC06-05: Dropdown khối
class KhoiDropdownView(generics.ListAPIView):
    queryset = Khoi.objects.all()
    serializer_class = KhoiSerializer
    permission_classes = [permissions.IsAuthenticated]

# UC06-06: Dropdown niên khóa
class NienKhoaDropdownView(generics.ListAPIView):
    queryset = NienKhoa.objects.all()
    serializer_class = NienKhoaSerializer
    permission_classes = [permissions.IsAuthenticated]

# UC06-07: Dropdown tổ hợp (nếu có)
class ToHopDropdownView(generics.ListAPIView):
    queryset = ToHop.objects.all()
    serializer_class = ToHopSerializer
    permission_classes = [permissions.IsAuthenticated]

# ---------------------------
# UC06-08: Thêm học sinh vào lớp
# ---------------------------
# UC06-08: Thêm học sinh vào lớp
class ThemHocSinhVaoLopView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            lop = LopHoc.objects.get(pk=pk)
        except LopHoc.DoesNotExist:
            return Response({"error": "Lớp học không tồn tại."}, status=404)

        hoc_sinh_ids = request.data.get("hoc_sinh_ids", [])
        da_trung = []
        da_them = []

        for hs_id in hoc_sinh_ids:
            try:
                hs = HocSinh.objects.get(id=hs_id)
            except HocSinh.DoesNotExist:
                continue

            da_co_lop = LopHoc_HocSinh.objects.filter(
                IDHocSinh=hs,
                IDLopHoc__IDNienKhoa=lop.IDNienKhoa
            ).exists()

            if da_co_lop:
                da_trung.append(f"{hs.Ho} {hs.Ten}")
                continue

            LopHoc_HocSinh.objects.create(IDLopHoc=lop, IDHocSinh=hs)
            da_them.append(f"{hs.Ho} {hs.Ten}")

        return Response({
            "them_thanh_cong": da_them,
            "bi_trung_lop": da_trung
        }, status=200)

# ---------------------------
# UC06-09: Xuất danh sách học sinh lớp
class XuatDanhSachLopView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            lop = LopHoc.objects.get(pk=pk)
        except LopHoc.DoesNotExist:
            return Response({"error": "Lớp không tồn tại."}, status=404)

        hoc_sinh_qs = HocSinh.objects.filter(lophoc_list=lop)

        wb = Workbook()
        ws = wb.active
        ws.title = "Danh sách lớp"

        ws.append(["STT", "Họ và tên", "Giới tính", "Ngày sinh", "Địa chỉ", "Email"])

        for i, hs in enumerate(hoc_sinh_qs, start=1):
            ws.append([
                i,
                f"{hs.Ho} {hs.Ten}",
                hs.GioiTinh,
                hs.NgaySinh.strftime("%d/%m/%Y"),
                hs.DiaChi,
                hs.Email or "",
            ])

        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename=\"Lop_{lop.TenLop}.xlsx\"'
        wb.save(response)
        return response

    