from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from students.models import HocSinh
from grading.models import DiemSo
from classes.models import LopHoc
from classes.models import LopHoc_HocSinh

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def tong_hop_diem_hoc_ky(request):
    id_lop = request.data.get("IDLopHoc")
    id_mon = request.data.get("IDMonHoc")
    id_hocky = request.data.get("IDHocKy")

    if not all([id_lop, id_mon, id_hocky]):
        return Response(
            {"error": "Thiếu tham số: IDLopHoc, IDMonHoc, IDHocKy là bắt buộc."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        lop = LopHoc.objects.get(id=id_lop)
    except LopHoc.DoesNotExist:
        return Response({"error": "Lớp không tồn tại."}, status=status.HTTP_404_NOT_FOUND)

    hoc_sinh_ids = LopHoc_HocSinh.objects.filter(IDLopHoc=lop).values_list('IDHocSinh', flat=True)
    hoc_sinh_list = HocSinh.objects.filter(id__in=hoc_sinh_ids)


    results = []

    for hs in hoc_sinh_list:
        try:
            diem = DiemSo.objects.get(
                IDHocSinh=hs,
                IDLopHoc_id=id_lop,
                IDMonHoc_id=id_mon,
                IDHocKy_id=id_hocky
            )
        except DiemSo.DoesNotExist:
            continue  # Không có điểm thì bỏ qua

        # Kiểm tra có đủ điểm để tính không
        if any([
            diem.DiemMieng is None,
            diem.Diem15 is None,
            diem.Diem1Tiet is None,
            diem.DiemThi is None
        ]):
            continue

        # Tính điểm trung bình học kỳ theo đúng serializer
        diem_tb = (
            diem.DiemMieng +
            diem.Diem15 +
            2 * diem.Diem1Tiet +
            3 * diem.DiemThi
        ) / 7
        diem_tb = round(diem_tb, 2)

        # Phân loại học lực
        if diem_tb >= 8:
            xeploai = "Giỏi"
        elif diem_tb >= 6.5:
            xeploai = "Khá"
        elif diem_tb >= 5:
            xeploai = "Trung bình"
        else:
            xeploai = "Yếu"

        results.append({
            "id": hs.id,
            "HoTen": hs.HoTen,
            "DiemTBHocKy": diem_tb,
            "XepLoai": xeploai
        })

    return Response(results, status=status.HTTP_200_OK)
