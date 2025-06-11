from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .models import TaiKhoan, VaiTro
from .serializers import TaiKhoanSerializer, VaiTroSerializer, UserProfileSerializer

#__________________________________Hàm tiện ích__________________________________
def kiem_tra_quyen_bgh(user):
    try:
        tai_khoan = TaiKhoan.objects.get(user=user)
    except TaiKhoan.DoesNotExist:
        raise PermissionDenied("Không tìm thấy thông tin người dùng.")

    if tai_khoan.MaVaiTro.MaVaiTro != 'BGH':
        raise PermissionDenied("Chỉ người có vai trò BGH mới có quyền thực hiện thao tác này.")

#__________________________________Tài khoản__________________________________
class CreateTaiKhoanView(generics.CreateAPIView):
    queryset = TaiKhoan.objects.all()
    serializer_class = TaiKhoanSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        kiem_tra_quyen_bgh(self.request.user)
        serializer.save()

class ListTaiKhoanView(generics.ListAPIView):
    queryset = TaiKhoan.objects.all()
    serializer_class = TaiKhoanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        kiem_tra_quyen_bgh(self.request.user)
        return TaiKhoan.objects.all()
    
class UpdateTaiKhoanView(generics.UpdateAPIView):
    queryset = TaiKhoan.objects.all()
    serializer_class = TaiKhoanSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        kiem_tra_quyen_bgh(self.request.user)
        serializer.save()

class DeleteTaiKhoanView(generics.DestroyAPIView):
    queryset = TaiKhoan.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        kiem_tra_quyen_bgh(self.request.user)
        instance.user.delete()
        instance.delete()


class ListVaiTroView(generics.ListAPIView):
    queryset = VaiTro.objects.all()
    serializer_class = VaiTroSerializer
    permission_classes = [IsAuthenticated]  # Yêu cầu đăng nhập

    def get_queryset(self):
        # Có thể thêm logic kiểm tra quyền nếu cần
        return VaiTro.objects.all()
    

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint cho phép người dùng xem (GET) và cập nhật (PATCH) 
    thông tin cá nhân của chính họ.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated] # Yêu cầu người dùng phải đăng nhập

    def get_object(self):
        """
        Đây là phần cốt lõi. Nó sẽ tự động trả về đối tượng TaiKhoan
        của người dùng đang thực hiện request mà không cần ID trong URL.
        """
        try:
            # self.request.user là đối tượng User đã được xác thực
            # .taikhoan là cách truy cập ngược từ User sang TaiKhoan
            return self.request.user.taikhoan
        except TaiKhoan.DoesNotExist:
            raise PermissionDenied("Không tìm thấy hồ sơ tài khoản cho người dùng này.")

    def get_serializer_context(self):
        """
        Gửi request vào context của serializer để nó có thể
        truy cập vào request.data (để lấy mật khẩu).
        """
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    
    # ... các import hiện tại ...
from rest_framework.views import APIView # Import thêm APIView
from rest_framework.response import Response
from .models import TaiKhoan # Import model TaiKhoan

# ... các class view hiện tại ...

# === BẮT ĐẦU THÊM VIEW MỚI TỪ ĐÂY ===

class DashboardStatsView(APIView):
    """
    API endpoint để lấy các số liệu thống kê cho Dashboard.
    Chỉ có BGH mới được phép truy cập.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Kiểm tra quyền BGH (tái sử dụng hàm tiện ích của bạn)
        kiem_tra_quyen_bgh(request.user)

        # Bắt đầu tính toán
        total_accounts = TaiKhoan.objects.count()
        teacher_accounts = TaiKhoan.objects.filter(MaVaiTro__MaVaiTro='GiaoVien').count()
        giaovu_accounts = TaiKhoan.objects.filter(MaVaiTro__MaVaiTro='GiaoVu').count()
        bgh_accounts = TaiKhoan.objects.filter(MaVaiTro__MaVaiTro='BGH').count()
        
        # Tạo dữ liệu trả về
        data = {
            'total_accounts': total_accounts,
            'teacher_accounts': teacher_accounts,
            'giaovu_accounts': giaovu_accounts,
            'bgh_accounts': bgh_accounts,
        }
        
        return Response(data, status=status.HTTP_200_OK)