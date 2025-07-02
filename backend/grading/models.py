from django.db import models
from django.contrib.auth.models import User

class HocKy(models.Model):
    TenHocKy = models.CharField(max_length=50, unique=True)  # VD: "Học kỳ 1", "Học kỳ 2"

    def __str__(self):
        return self.TenHocKy

    class Meta:
        db_table = 'HOCKY'


class DiemSo(models.Model):
    IDHocSinh = models.ForeignKey('students.HocSinh', on_delete=models.CASCADE)
    IDLopHoc = models.ForeignKey('classes.LopHoc', on_delete=models.CASCADE)
    IDMonHoc = models.ForeignKey('subjects.MonHoc', on_delete=models.CASCADE)
    IDHocKy = models.ForeignKey(HocKy, on_delete=models.PROTECT)

    # Các loại điểm
    DiemMieng = models.FloatField(null=True, blank=True)
    Diem15 = models.FloatField(null=True, blank=True)
    Diem1Tiet = models.FloatField(null=True, blank=True)
    DiemThi = models.FloatField(null=True, blank=True)

    # Điểm trung bình (tự tính)
    DiemTB = models.FloatField(null=True, blank=True)

    # Thông tin người nhập/sửa
    NguoiCapNhat = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    NgayCapNhat = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.IDHocSinh} - {self.IDMonHoc} ({self.IDHocKy})'

    class Meta:
        db_table = 'DIEMSO'
        unique_together = ('IDHocSinh', 'IDMonHoc', 'IDHocKy')


class DiemSoLichSu(models.Model):
    DiemGoc = models.ForeignKey(DiemSo, on_delete=models.CASCADE)
    NguoiThayDoi = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    ThoiGian = models.DateTimeField(auto_now_add=True)
    NoiDungThayDoi = models.TextField()

    def __str__(self):
        return f'Lịch sử: {self.DiemGoc} - {self.ThoiGian.strftime("%d/%m/%Y %H:%M")}'

    class Meta:
        db_table = 'DIEMSO_LICHSU'
