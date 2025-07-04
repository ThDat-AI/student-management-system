from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.shortcuts import get_object_or_404
from datetime import date

from .models import HocSinh
from .serializers import (
    HocSinhSerializer,
    HocSinhCreateSerializer,
    HocSinhSimpleSerializer
)
from configurations.models import NienKhoa
from classes.models import LopHoc, LopHoc_HocSinh

class HocSinhViewSet(viewsets.ModelViewSet):
    queryset = HocSinh.objects.all().select_related(
        'IDNienKhoaTiepNhan',
        'NguoiTao',
        'NguoiCapNhat'
    ).order_by('-NgayTao')
    
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = {
        'IDNienKhoaTiepNhan': ['exact'],
        'GioiTinh': ['exact'],
        'TrangThai': ['exact'],
        'NgaySinh': ['gte', 'lte'],
    }
    search_fields = ['Ho', 'Ten', 'Email', 'DiaChi']

    def get_serializer_class(self):
        if self.action == 'create':
            return HocSinhCreateSerializer
        elif self.action == 'list' and self.request.query_params.get('simple') == 'true':
            return HocSinhSimpleSerializer
        return HocSinhSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Lọc theo lớp học nếu có tham số class_id
        class_id = self.request.query_params.get('class_id')
        if class_id:
            student_ids = LopHoc_HocSinh.objects.filter(
                IDLopHoc_id=class_id
            ).values_list('IDHocSinh_id', flat=True)
            queryset = queryset.filter(id__in=student_ids)
        
        # Lọc theo khoảng tuổi
        min_age = self.request.query_params.get('min_age')
        max_age = self.request.query_params.get('max_age')
        if min_age or max_age:
            today = date.today()
            if min_age:
                min_birth_year = today.year - int(min_age)
                queryset = queryset.filter(NgaySinh__lte=date(min_birth_year, 12, 31))
            if max_age:
                max_birth_year = today.year - int(max_age)
                queryset = queryset.filter(NgaySinh__gte=date(max_birth_year, 1, 1))
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(
            NguoiTao=self.request.user,
            NguoiCapNhat=self.request.user
        )

    def perform_update(self, serializer):
        serializer.save(NguoiCapNhat=self.request.user)

    @action(detail=True, methods=['GET'])
    def thong_tin_lop_hoc(self, request, pk=None):
        """Lấy thông tin lớp học hiện tại của học sinh"""
        hoc_sinh = self.get_object()
        lop_hoc = hoc_sinh.lophoc_hocsinh_set.filter(
            IDLopHoc__IDNienKhoa=hoc_sinh.IDNienKhoaTiepNhan
        ).first()
        
        if not lop_hoc:
            return Response(
                {"detail": "Học sinh chưa được phân lớp"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        data = {
            "lop_hoc_id": lop_hoc.IDLopHoc.id,
            "ten_lop": lop_hoc.IDLopHoc.TenLop,
            "khoi": lop_hoc.IDLopHoc.IDKhoi.TenKhoi,
            "nien_khoa": lop_hoc.IDLopHoc.IDNienKhoa.TenNienKhoa
        }
        return Response(data)

    @action(detail=False, methods=['GET'])
    def danh_sach_theo_nien_khoa(self, request):
        """Danh sách học sinh theo niên khóa (dành cho dropdown)"""
        nien_khoa_id = request.query_params.get('nien_khoa_id')
        if not nien_khoa_id:
            return Response(
                {"error": "Thiếu tham số nien_khoa_id"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        queryset = self.get_queryset().filter(
            IDNienKhoaTiepNhan_id=nien_khoa_id
        )
        serializer = HocSinhSimpleSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['POST'])
    def phan_lop(self, request, pk=None):
        """Phân lớp cho học sinh"""
        hoc_sinh = self.get_object()
        lop_hoc_id = request.data.get('lop_hoc_id')
        
        if not lop_hoc_id:
            return Response(
                {"error": "Thiếu tham số lop_hoc_id"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Kiểm tra lớp học có cùng niên khóa với học sinh
        try:
            lop_hoc = LopHoc.objects.get(
                id=lop_hoc_id,
                IDNienKhoa=hoc_sinh.IDNienKhoaTiepNhan
            )
        except LopHoc.DoesNotExist:
            return Response(
                {"error": "Lớp học không tồn tại hoặc khác niên khóa"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Kiểm tra học sinh đã ở trong lớp này chưa
        if LopHoc_HocSinh.objects.filter(
            IDHocSinh=hoc_sinh,
            IDLopHoc=lop_hoc
        ).exists():
            return Response(
                {"error": "Học sinh đã có trong lớp này"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Thực hiện phân lớp
        LopHoc_HocSinh.objects.create(
            IDHocSinh=hoc_sinh,
            IDLopHoc=lop_hoc
        )
        
        return Response(
            {"success": f"Đã phân học sinh vào lớp {lop_hoc.TenLop}"},
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['PATCH'])
    def cap_nhat_trang_thai(self, request, pk=None):
        """Cập nhật trạng thái học sinh"""
        hoc_sinh = self.get_object()
        trang_thai = request.data.get('trang_thai')
        
        if trang_thai not in dict(HocSinh.TRANG_THAI_CHOICES).keys():
            return Response(
                {"error": "Trạng thái không hợp lệ"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        hoc_sinh.TrangThai = trang_thai
        hoc_sinh.NguoiCapNhat = request.user
        hoc_sinh.save()
        
        return Response(
            {"success": f"Cập nhật trạng thái thành {hoc_sinh.get_TrangThai_display()}"}
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def danh_sach_hoc_sinh_theo_lop(request):
    """
    API cũ - Được giữ nguyên để đảm bảo tương thích ngược
    Lấy danh sách học sinh theo lớp (dạng rút gọn)
    """
    id_lop = request.GET.get("IDLopHoc")
    if not id_lop:
        return Response({"error": "Thiếu IDLopHoc"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        lop = LopHoc.objects.get(id=id_lop)
    except LopHoc.DoesNotExist:
        return Response({"error": "Lớp học không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

    hoc_sinh_qs = HocSinh.objects.filter(lophoc_hocsinh__IDLopHoc=lop)
    data = [
        {
            "id": hs.id,
            "HoTen": f"{hs.Ho} {hs.Ten}",
            "MaHocSinh": hs.id,  # Thêm trường ID nếu cần
            "GioiTinh": hs.GioiTinh,
            "NgaySinh": hs.NgaySinh.strftime("%d/%m/%Y") if hs.NgaySinh else None
        }
        for hs in hoc_sinh_qs
    ]
    return Response(data)