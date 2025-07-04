from django.contrib import admin
from .models import NienKhoa

@admin.register(NienKhoa)
class NienKhoaAdmin(admin.ModelAdmin):
    search_fields = ['TenNienKhoa']
