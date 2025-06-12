from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from .models import TaiKhoan

class IsBGH(BasePermission):
    """
    Custom permission để chỉ cho phép người dùng có vai trò BGH.
    """
    message = "Chỉ người có vai trò BGH mới có quyền thực hiện thao tác này."

    def has_permission(self, request, view):
        try:
            # request.user là đối tượng User đã được xác thực
            return request.user.taikhoan.MaVaiTro.MaVaiTro == 'BGH'
        except TaiKhoan.DoesNotExist:
            # Nếu không tìm thấy TaiKhoan, từ chối quyền
            return False