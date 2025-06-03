from rest_framework import serializers
from .models import TaiKhoan, VaiTro
from django.contrib.auth.hashers import make_password

class TaiKhoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaiKhoan
        fields = "__all__"
        extra_kwargs = {"MatKhau": {"write_only": True}}

    def create(self, validated_data):
        # Tự động mã hóa mật khẩu
        validated_data["MatKhau"] = make_password(validated_data["MatKhau"])
        return super().create(validated_data)