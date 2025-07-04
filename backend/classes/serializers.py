from rest_framework import serializers
from .models import LopHoc, Khoi
from configurations.models import NienKhoa
from subjects.models import ToHop

# ---------- Dropdown serializers ----------
class KhoiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Khoi
        fields = ['id', 'TenKhoi']


class NienKhoaSerializer(serializers.ModelSerializer):
    class Meta:
        model = NienKhoa
        fields = ['id', 'TenNienKhoa']


class ToHopSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToHop
        fields = ['id', 'TenToHop']


# ---------- Chính: Serializer lớp học ----------
class LopHocSerializer(serializers.ModelSerializer):
    IDKhoi_display = serializers.CharField(source='IDKhoi.TenKhoi', read_only=True)
    IDNienKhoa_display = serializers.CharField(source='IDNienKhoa.TenNienKhoa', read_only=True)
    IDToHop_display = serializers.SerializerMethodField()

    class Meta:
        model = LopHoc
        fields = [
            'id', 'TenLop', 'SiSo',
            'IDKhoi', 'IDKhoi_display',
            'IDNienKhoa', 'IDNienKhoa_display',
            'IDToHop', 'IDToHop_display'
        ]

    def get_IDToHop_display(self, obj):
        return obj.IDToHop.TenToHop if obj.IDToHop else None
