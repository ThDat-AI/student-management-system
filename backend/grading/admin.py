from django.contrib import admin
from .models import HocKy, DiemSo

@admin.register(HocKy)
class HocKyAdmin(admin.ModelAdmin):
    search_fields = ['TenHocKy']

@admin.register(DiemSo)
class DiemSoAdmin(admin.ModelAdmin):
    pass