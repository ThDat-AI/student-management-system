from rest_framework import serializers
from .models import DiemSo

class DiemSoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiemSo
        fields = '__all__'

    def validate(self, data):
        # Kiểm tra tất cả các điểm nếu có
        for field in ['DiemMieng', 'Diem15', 'Diem1Tiet', 'DiemThi']:
            diem = data.get(field)
            if diem is not None and (diem < 0 or diem > 10):
                raise serializers.ValidationError({field: f"{field} phải trong khoảng 0 - 10"})

        return data

    def create(self, validated_data):
        # Tự động tính điểm trung bình khi tạo mới
        diem_tb = self.tinh_diem_tb(validated_data)
        validated_data['DiemTB'] = diem_tb
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Tự động tính lại điểm TB khi cập nhật
        diem_tb = self.tinh_diem_tb(validated_data, instance)
        validated_data['DiemTB'] = diem_tb
        return super().update(instance, validated_data)

    def tinh_diem_tb(self, data, instance=None):
        # Lấy điểm từ validated_data hoặc từ instance nếu không có
        diem_mieng = data.get('DiemMieng', getattr(instance, 'DiemMieng', None))
        diem_15 = data.get('Diem15', getattr(instance, 'Diem15', None))
        diem_1tiet = data.get('Diem1Tiet', getattr(instance, 'Diem1Tiet', None))
        diem_thi = data.get('DiemThi', getattr(instance, 'DiemThi', None))

        # Hệ số mẫu: miệng(1), 15p(1), 1 tiết(2), thi(3)
        thanh_phan = [
            (diem_mieng, 1),
            (diem_15, 1),
            (diem_1tiet, 2),
            (diem_thi, 3),
        ]
        diem_co = [(d, hs) for d, hs in thanh_phan if d is not None]

        if not diem_co:
            return None

        tong_diem = sum(d * hs for d, hs in diem_co)
        tong_he_so = sum(hs for _, hs in diem_co)
        return round(tong_diem / tong_he_so, 2)
