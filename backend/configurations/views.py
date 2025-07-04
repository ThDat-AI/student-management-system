# configurations/views.py

from rest_framework import generics, views, status, filters, permissions
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsBGH
from .models import NienKhoa, ThamSo
from .serializers import ThamSoSerializer, CreateQuyDinhVaNienKhoaSerializer
from students.models import HocSinh
from classes.models import LopHoc
from .models import NienKhoa
from .serializers import NienKhoaSerializer

class NienKhoaDropdownView(generics.ListAPIView):
    queryset = NienKhoa.objects.all()
    serializer_class = NienKhoaSerializer
    permission_classes = [permissions.IsAuthenticated]

class ListCreateQuyDinhView(generics.ListCreateAPIView):
    # Sắp xếp mặc định theo TenNienKhoa giảm dần
    queryset = ThamSo.objects.select_related('IDNienKhoa').order_by('-IDNienKhoa__TenNienKhoa')
    permission_classes = [IsAuthenticated, IsBGH]
    
    # Kích hoạt tính năng tìm kiếm
    filter_backends = [filters.SearchFilter]
    search_fields = ['IDNienKhoa__TenNienKhoa']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateQuyDinhVaNienKhoaSerializer
        return ThamSoSerializer

class QuyDinhDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ThamSo.objects.select_related('IDNienKhoa').all()
    serializer_class = ThamSoSerializer
    permission_classes = [IsAuthenticated, IsBGH]
    lookup_field = 'IDNienKhoa'

    def _check_related_data(self, nien_khoa_id):
        has_students = HocSinh.objects.filter(IDNienKhoaTiepNhan_id=nien_khoa_id).exists()
        has_classes = LopHoc.objects.filter(IDNienKhoa_id=nien_khoa_id).exists()
        return has_students or has_classes

    def perform_update(self, serializer):
        if self._check_related_data(self.kwargs['IDNienKhoa']):
            raise ValidationError("Không thể sửa quy định vì đã có dữ liệu (học sinh, lớp học,...) trong niên khóa này.")
        super().perform_update(serializer)

    def perform_destroy(self, instance):
        if self._check_related_data(instance.IDNienKhoa_id):
            raise ValidationError("Không thể xóa quy định vì đã có dữ liệu (học sinh, lớp học,...) trong niên khóa này.")
        nien_khoa = instance.IDNienKhoa
        instance.delete()
        nien_khoa.delete()

class LatestQuyDinhView(views.APIView):
    permission_classes = [IsAuthenticated, IsBGH]
    def get(self, request, *args, **kwargs):
        latest_thamso = ThamSo.objects.order_by('-IDNienKhoa__TenNienKhoa').first()
        if not latest_thamso:
            return Response({}, status=status.HTTP_200_OK)
        serializer = ThamSoSerializer(latest_thamso)
        return Response(serializer.data)