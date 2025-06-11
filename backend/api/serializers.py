#api/serializers.py
from rest_framework import serializers
from .models import TaiKhoan, VaiTro
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

# --- CHỈNH SỬA DUY NHẤT Ở ĐÂY ---
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {
            'password': {
                'write_only': True, 
                'required': False # Mật khẩu không bắt buộc khi cập nhật
            },
            'username': {
                # Username chỉ được yêu cầu khi tạo mới, không yêu cầu khi cập nhật.
                # 'validators': [] để bỏ qua UniqueValidator khi username không thay đổi.
                'required': False
            }
        }


class TaiKhoanSerializer(serializers.ModelSerializer):
    # Giữ nguyên cấu trúc lồng nhau để frontend có thể thấy username
    user = UserSerializer()

    class Meta:
        model = TaiKhoan
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')

        # Kiểm tra xem username có được cung cấp không
        if 'username' not in user_data:
            raise serializers.ValidationError({'user': {'username': 'This field is required.'}})
        
        # Hash password
        user_data['password'] = make_password(user_data['password'])
        
        # Tạo User
        user = User.objects.create(**user_data)
        
        # Tạo TaiKhoan
        tai_khoan = TaiKhoan.objects.create(user=user, **validated_data)
        return tai_khoan
    
    def update(self, instance, validated_data):
        # Lấy dữ liệu user nếu có
        user_data = validated_data.pop('user', None)
        
        if user_data:
            user = instance.user
            
            # --- Quan trọng: KHÔNG cho phép cập nhật username ---
            # Dòng này sẽ loại bỏ username nếu client có gửi lên, tránh lỗi "already exists"
            user_data.pop('username', None)

            # Chỉ cập nhật password nếu nó được cung cấp
            if 'password' in user_data and user_data['password']:
                user.set_password(user_data['password'])
                user.save()
        
        # Cập nhật các trường còn lại của TaiKhoan
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance
    
class VaiTroSerializer(serializers.ModelSerializer):
    class Meta:
        model = VaiTro
        fields = ['MaVaiTro', 'TenVaiTro']


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer này được thiết kế riêng cho người dùng tự xem và cập nhật
    thông tin cá nhân. Nó KHÔNG cho phép thay đổi vai trò.
    """
    # Lấy username từ model User và chỉ cho phép đọc
    username = serializers.CharField(source='user.username', read_only=True)
    
    # Hiển thị thông tin vai trò lồng nhau, chỉ cho phép đọc
    MaVaiTro = VaiTroSerializer(read_only=True)

    class Meta:
        model = TaiKhoan
        # Liệt kê các trường người dùng được phép xem và sửa
        fields = [
            'id', 'username', 'Ho', 'Ten', 'GioiTinh', 'NgaySinh', 
            'DiaChi', 'SoDienThoai', 'Email', 'MaVaiTro'
        ]
        # Đảm bảo các trường nhạy cảm này chỉ được đọc, không thể sửa
        read_only_fields = ['id', 'username', 'MaVaiTro']

    def update(self, instance, validated_data):
        # Lấy user liên quan đến TaiKhoan instance
        user = instance.user
        
        # --- Xử lý cập nhật mật khẩu ---
        # Chúng ta cần lấy password từ request.data trực tiếp
        # vì nó không nằm trong validated_data do không được định nghĩa trong fields
        password = self.context['request'].data.get('password')
        if password:
            user.set_password(password)
            user.save()

        # Cập nhật các trường còn lại của TaiKhoan
        # Gọi hàm update của lớp cha để xử lý các trường trong 'fields'
        return super().update(instance, validated_data)