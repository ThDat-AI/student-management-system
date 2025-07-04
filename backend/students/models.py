from django.db import models
from django.core.exceptions import ValidationError
from datetime import date
from django.contrib.auth import get_user_model
from classes.models import LopHoc
from configurations.models import NienKhoa

User = get_user_model()

def validate_student_age(birth_date):
    today = date.today()
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    
    if age < 15 or age > 20:
        raise ValidationError(f"Tuổi học sinh phải từ 15 đến 20. Hiện tại là {age} tuổi.")

class HocSinh(models.Model):
    GIOI_TINH_CHOICES = [
        ('Nam', 'Nam'),
        ('Nữ', 'Nữ'),
        ('Khác', 'Khác'),
    ]
    
    TRANG_THAI_CHOICES = [
        ('dang_hoc', 'Đang học'),
        ('chuyen_truong', 'Chuyển trường'),
        ('tot_nghiep', 'Đã tốt nghiệp'),
        ('thoi_hoc', 'Thôi học'),
    ]

    Ho = models.CharField(max_length=50, verbose_name="Họ")
    Ten = models.CharField(max_length=50, verbose_name="Tên")
    GioiTinh = models.CharField(max_length=10, choices=GIOI_TINH_CHOICES, verbose_name="Giới tính")
    NgaySinh = models.DateField(verbose_name="Ngày sinh", validators=[validate_student_age])
    DiaChi = models.CharField(max_length=255, verbose_name="Địa chỉ")
    Email = models.EmailField(unique=True, null=True, blank=True, verbose_name="Email")
    IDNienKhoaTiepNhan = models.ForeignKey(NienKhoa, on_delete=models.PROTECT, verbose_name="Niên khóa tiếp nhận")
    TrangThai = models.CharField(max_length=20, choices=TRANG_THAI_CHOICES, default='dang_hoc', verbose_name="Trạng thái")

    # ➕ Thêm liên kết lớp học
    LopHoc = models.ForeignKey(LopHoc, on_delete=models.SET_NULL, null=True, blank=True, related_name='hoc_sinh', verbose_name="Lớp học")

    NgayTao = models.DateTimeField(auto_now_add=True, verbose_name="Ngày tạo")
    NgayCapNhat = models.DateTimeField(auto_now=True, verbose_name="Ngày cập nhật")
    NguoiTao = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='hoc_sinh_tao', verbose_name="Người tạo")
    NguoiCapNhat = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='hoc_sinh_cap_nhat', verbose_name="Người cập nhật")

    def clean(self):
        if self.IDNienKhoaTiepNhan:
            nam_nien_khoa = int(self.IDNienKhoaTiepNhan.TenNienKhoa.split('-')[0])
            tuoi_nam_nhap_hoc = nam_nien_khoa - self.NgaySinh.year
            if tuoi_nam_nhap_hoc < 15 or tuoi_nam_nhap_hoc > 20:
                raise ValidationError(
                    f"Tuổi học sinh khi nhập học phải từ 15 đến 20. "
                    f"Niên khóa {self.IDNienKhoaTiepNhan.TenNienKhoa}, "
                    f"tuổi khi nhập học: {tuoi_nam_nhap_hoc}"
                )

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    @property
    def HoTen(self):
        return f"{self.Ho} {self.Ten}"

    @property
    def Tuoi(self):
        today = date.today()
        return today.year - self.NgaySinh.year - ((today.month, today.day) < (self.NgaySinh.month, self.NgaySinh.day))

    def __str__(self):
        return f"{self.Ho} {self.Ten} - {self.IDNienKhoaTiepNhan.TenNienKhoa}"

    class Meta:
        db_table = 'HOCSINH'
        verbose_name = 'Học sinh'
        verbose_name_plural = 'Quản lý học sinh'
        ordering = ['-NgayTao']
