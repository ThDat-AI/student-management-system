from rest_framework import serializers
from .models import DiemSo, DiemSoLichSu, HocKy


class HocKySerializer(serializers.ModelSerializer):
    class Meta:
        model = HocKy
        fields = ['id', 'TenHocKy']


class DiemSoSerializer(serializers.ModelSerializer):
    # Alias để frontend dùng tên quen thuộc
    Diem15Phut = serializers.FloatField(source='Diem15', allow_null=True, required=False)
    DiemHocKy = serializers.FloatField(source='DiemThi', allow_null=True, required=False)

    class Meta:
        model = DiemSo
        fields = [
            'id', 'IDHocSinh', 'IDLopHoc', 'IDMonHoc', 'IDHocKy',
            'DiemMieng', 'Diem15Phut', 'Diem1Tiet', 'DiemHocKy',
            'DiemTB', 'NguoiCapNhat', 'NgayCapNhat'
        ]
        read_only_fields = ['DiemTB', 'NguoiCapNhat', 'NgayCapNhat']

    def validate(self, data):
        # Kiểm tra các điểm trong khoảng 0 - 10 (sử dụng tên field gốc trong model)
        fields_to_check = {
            'DiemMieng': data.get('DiemMieng'),
            'Diem15': data.get('Diem15'),
            'Diem1Tiet': data.get('Diem1Tiet'),
            'DiemThi': data.get('DiemThi'),
        }

        for field, diem in fields_to_check.items():
            if diem is not None and (diem < 0 or diem > 10):
                raise serializers.ValidationError({field: f"{field} phải trong khoảng từ 0 đến 10"})

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['NguoiCapNhat'] = request.user

        validated_data['DiemTB'] = self.tinh_diem_tb(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Lưu dữ liệu cũ để kiểm tra thay đổi
        old_data = {
            'DiemMieng': instance.DiemMieng,
            'Diem15': instance.Diem15,
            'Diem1Tiet': instance.Diem1Tiet,
            'DiemThi': instance.DiemThi,
        }

        # Tính điểm trung bình mới
        diem_tb = self.tinh_diem_tb(validated_data, instance)
        validated_data['DiemTB'] = diem_tb

        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['NguoiCapNhat'] = request.user

        # Cập nhật
        instance = super().update(instance, validated_data)

        # So sánh và ghi lịch sử thay đổi
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
        # Lấy điểm từ validated_data hoặc từ instance
        diem_mieng = data.get('DiemMieng', getattr(instance, 'DiemMieng', None))
        diem_15 = data.get('Diem15', getattr(instance, 'Diem15', None))
        diem_1tiet = data.get('Diem1Tiet', getattr(instance, 'Diem1Tiet', None))
        diem_thi = data.get('DiemThi', getattr(instance, 'DiemThi', None))

        # Tính trung bình có trọng số
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
