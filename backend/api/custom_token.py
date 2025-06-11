# api/custom_token.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import TaiKhoan

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Lấy đối tượng tài khoản
        try:
            tai_khoan = TaiKhoan.objects.get(user=self.user)
            role = tai_khoan.MaVaiTro.MaVaiTro
        except TaiKhoan.DoesNotExist:
            role = None

        # Thêm vào response trả về
        data['role'] = role

        # ✅ Thêm role vào access token
        self.user.role = role  # Gán tạm để dùng trong get_token
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # ✅ Nếu user đã có role từ validate, thêm vào token
        if hasattr(user, 'role'):
            token['role'] = user.role
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
