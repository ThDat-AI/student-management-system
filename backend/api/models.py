from django.db import models
from django.contrib.auth.models import User

class VaiTro(models.Model):
    IDVaiTro = models.AutoField(primary_key=True)
    TenVaiTro = models.CharField(max_length=50)

    def __str__(self):
        return self.TenVaiTro

    class Meta:
        db_table = 'VAITRO'


class TaiKhoan(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # 🔗 Liên kết với User mặc định
    Ho = models.CharField(max_length=50)
    Ten = models.CharField(max_length=50)
    IDVaiTro = models.ForeignKey(VaiTro, on_delete=models.CASCADE)
    GioiTinh = models.CharField(max_length=10)
    NgaySinh = models.DateField()
    DiaChi = models.CharField(max_length=255)
    SoDienThoai = models.CharField(max_length=20)
    Email = models.EmailField()

    class Meta:
        db_table = 'TAIKHOAN'
