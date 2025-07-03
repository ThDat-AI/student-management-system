from rest_framework import serializers
from .models import DiemSo, DiemSoLichSu

class DiemSoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiemSo
        fields = '__all__'
        read_only_fields = ['DiemTB', 'NgayCapNhat', 'NguoiCapNhat']

    def validate(self, data):
        for field in ['DiemMieng', 'Diem15', 'Diem1Tiet', 'DiemThi']:
            diem = data.get(field)
            if diem is not None and (diem < 0 or diem > 10):
                raise serializers.ValidationError({field: f"{field} phải trong khoảng 0 - 10"})
        return data

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['NguoiCapNhat'] = request.user

        validated_data['DiemTB'] = self.tinh_diem_tb(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Ghi lại điểm cũ để so sánh
        old_data = {
            'DiemMieng': instance.DiemMieng,
            'Diem15': instance.Diem15,
            'Diem1Tiet': instance.Diem1Tiet,
            'DiemThi': instance.DiemThi,
        }

        # Tính lại điểm TB
        diem_tb = self.tinh_diem_tb(validated_data, instance)
        validated_data['DiemTB'] = diem_tb

        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['NguoiCapNhat'] = request.user

        # Cập nhật điểm
        instance = super().update(instance, validated_data)

        # So sánh và ghi lịch sử nếu có thay đổi
        changes = []
        for field in old_data:
            old = old_data[field]
            new = getattr(instance, field)
            if old != new:
                changes.append(f"{field}: {old} → {new}")

        if changes and request:
            DiemSoLichSu.objects.create(
                DiemGoc=instance,
                NguoiThayDoi=request.user,
                NoiDungThayDoi=', '.join(changes)
            )

        return instance

    def tinh_diem_tb(self, data, instance=None):
        diem_mieng = data.get('DiemMieng', getattr(instance, 'DiemMieng', None))
        diem_15 = data.get('Diem15', getattr(instance, 'Diem15', None))
        diem_1tiet = data.get('Diem1Tiet', getattr(instance, 'Diem1Tiet', None))
        diem_thi = data.get('DiemThi', getattr(instance, 'DiemThi', None))

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
