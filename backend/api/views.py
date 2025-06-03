from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import TaiKhoan
from .serializers import TaiKhoanSerializer

class CreateTaiKhoanView(generics.CreateAPIView):
    queryset = TaiKhoan.objects.all()
    serializer_class = TaiKhoanSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Lấy User hiện tại từ JWT token
        nguoi_dung = self.request.user
        try:
            nguoi_hien_tai = TaiKhoan.objects.get(user=nguoi_dung)
        except TaiKhoan.DoesNotExist:
            raise PermissionDenied("Không tìm thấy thông tin người dùng.")

        if nguoi_hien_tai.IDVaiTro.TenVaiTro != 'BGH':
            raise PermissionDenied("Chỉ người có vai trò BGH mới được tạo tài khoản.")

        serializer.save()
