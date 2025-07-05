#grading/model.py

from django.db import models

class HocKy(models.Model):
    TenHocKy = models.CharField(max_length=50, unique=True) # VD: "Học kỳ 1", "Học kỳ 2"
    def __str__(self): return self.TenHocKy
    class Meta: db_table = 'HOCKY'

class DiemSo(models.Model):
    IDHocSinh = models.ForeignKey('students.HocSinh', on_delete=models.CASCADE)
    IDLopHoc = models.ForeignKey('classes.LopHoc', on_delete=models.CASCADE)
    IDMonHoc = models.ForeignKey('subjects.MonHoc', on_delete=models.CASCADE)
    IDHocKy = models.ForeignKey(HocKy, on_delete=models.PROTECT)
    Diem15 = models.FloatField(null=True, blank=True)
    Diem1Tiet = models.FloatField(null=True, blank=True)
    DiemTB = models.FloatField(null=True, blank=True)
    class Meta: db_table = 'DIEMSO'