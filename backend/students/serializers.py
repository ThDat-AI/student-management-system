from rest_framework import serializers
from .models import HocSinh
from datetime import date
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from configurations.models import NienKhoa

User = get_user_model()

class HocSinhSerializer(serializers.ModelSerializer):
    HoTen = serializers.SerializerMethodField()
    Tuoi = serializers.SerializerMethodField()
    NienKhoaDisplay = serializers.CharField(source='IDNienKhoaTiepNhan.TenNienKhoa', read_only=True)
    NguoiTaoUsername = serializers.CharField(source='NguoiTao.username', read_only=True)
    NguoiCapNhatUsername = serializers.CharField(source='NguoiCapNhat.username', read_only=True)
    
    class Meta:
        model = HocSinh
        fields = [
            'id',
            'Ho',
            'Ten',
            'HoTen',
            'GioiTinh',
            'NgaySinh',
            'Tuoi',
            'DiaChi',
            'Email',
            'IDNienKhoaTiepNhan',
            'NienKhoaDisplay',
            'TrangThai',
            'NgayTao',
            'NgayCapNhat',
            'NguoiTao',
            'NguoiTaoUsername',
            'NguoiCapNhat',
            'NguoiCapNhatUsername',
        ]
        extra_kwargs = {
            'IDNienKhoaTiepNhan': {'required': True},
            'Ho': {'required': True, 'allow_blank': False},
            'Ten': {'required': True, 'allow_blank': False},
            'NgaySinh': {'required': True},
            'NguoiTao': {'read_only': True},
            'NguoiCapNhat': {'read_only': True},
            'NgayTao': {'read_only': True},
            'NgayCapNhat': {'read_only': True},
        }

    def get_HoTen(self, obj):
        return f"{obj.Ho} {obj.Ten}"

    def get_Tuoi(self, obj):
        today = date.today()
        return today.year - obj.NgaySinh.year - ((today.month, today.day) < (obj.NgaySinh.month, obj.NgaySinh.day))

    def validate_NgaySinh(self, value):
        """Validate student age between 15-20 years old"""
        today = date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        
        if age < 15 or age > 20:
            raise serializers.ValidationError("Tuổi học sinh phải từ 15 đến 20 tuổi.")
        return value

    def validate_IDNienKhoaTiepNhan(self, value):
        """Validate academic year format and existence"""
        if not value:
            raise serializers.ValidationError("Niên khóa tiếp nhận là bắt buộc.")
        return value

    def validate(self, data):
        """Validate age against academic year"""
        ngay_sinh = data.get('NgaySinh', self.instance.NgaySinh if self.instance else None)
        nien_khoa = data.get('IDNienKhoaTiepNhan', self.instance.IDNienKhoaTiepNhan if self.instance else None)
        
        if ngay_sinh and nien_khoa:
            try:
                nam_nhap_hoc = int(nien_khoa.TenNienKhoa.split('-')[0])
                tuoi_nhap_hoc = nam_nhap_hoc - ngay_sinh.year
                
                if tuoi_nhap_hoc < 15 or tuoi_nhap_hoc > 20:
                    raise serializers.ValidationError(
                        f"Tuổi học sinh khi nhập học phải từ 15-20. "
                        f"Niên khóa {nien_khoa.TenNienKhoa}, tuổi nhập học: {tuoi_nhap_hoc}"
                    )
            except (AttributeError, ValueError, IndexError):
                raise serializers.ValidationError("Định dạng niên khóa không hợp lệ.")
        
        return data

    def create(self, validated_data):
        """Set the creator when creating a new student"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['NguoiTao'] = request.user
            validated_data['NguoiCapNhat'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Set the updater when updating a student"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['NguoiCapNhat'] = request.user
        return super().update(instance, validated_data)


class HocSinhCreateSerializer(HocSinhSerializer):
    """Special serializer for creation with additional validations"""
    class Meta(HocSinhSerializer.Meta):
        extra_kwargs = {
            **HocSinhSerializer.Meta.extra_kwargs,
            'Email': {'required': True},  # Make email required for creation
        }

    def validate_Email(self, value):
        """Validate email uniqueness"""
        if HocSinh.objects.filter(Email__iexact=value).exists():
            raise serializers.ValidationError("Email đã tồn tại trong hệ thống.")
        return value


class HocSinhSimpleSerializer(serializers.ModelSerializer):
    """Simplified serializer for dropdowns and lists"""
    HoTen = serializers.SerializerMethodField()
    
    class Meta:
        model = HocSinh
        fields = ['id', 'HoTen', 'GioiTinh', 'IDNienKhoaTiepNhan']
    
    def get_HoTen(self, obj):
        return f"{obj.Ho} {obj.Ten}"