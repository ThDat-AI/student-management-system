from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from students.models import HocSinh
from classes.models import LopHoc, LopHoc_HocSinh
from rest_framework import status

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def danh_sach_hoc_sinh_theo_lop(request):
    id_lop = request.GET.get("IDLopHoc")
    if not id_lop:
        return Response({"error": "Thiếu IDLopHoc"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        lop = LopHoc.objects.get(id=id_lop)
    except LopHoc.DoesNotExist:
        return Response({"error": "Lớp học không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

    hoc_sinh_qs = HocSinh.objects.filter(lophoc_list=lop)
    data = [
        {
            "id": hs.id,
            "HoTen": f"{hs.Ho} {hs.Ten}"
        }
        for hs in hoc_sinh_qs
    ]
    return Response(data)
