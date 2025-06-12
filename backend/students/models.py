from django.db import models

class HocSinh(models.Model):
    Ho = models.CharField(max_length=50)
    Ten = models.CharField(max_length=50)
    GioiTinh = models.CharField(max_length=10)
    NgaySinh = models.DateField()
    DiaChi = models.CharField(max_length=255)
    Email = models.EmailField(unique=True, null=True, blank=True)
    IDNienKhoaTiepNhan = models.ForeignKey('configurations.NienKhoa', on_delete=models.PROTECT)
    def __str__(self): return f"{self.Ho} {self.Ten}"
    class Meta: db_table = 'HOCSINH'