#grading\views\score_input.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from grading.models import DiemSo, HocKy
from students.models import HocSinh
from classes.models import LopHoc
from subjects.models import MonHoc

# ----------------------------------------
# Tiện ích
# ----------------------------------------

def tinh_diem_tb(diem15, diem1tiet):
    if diem15 is not None and diem1tiet is not None:
        return round((diem15 + diem1tiet * 2) / 3, 2)
    return None

# ----------------------------------------
# API: Lấy danh sách học kỳ
# ----------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def danh_sach_hocky(request):
    hockys = HocKy.objects.all()
    data = [{"id": hk.id, "TenHocKy": hk.TenHocKy} for hk in hockys]
    return Response(data)

# ----------------------------------------
# API: Nhập điểm
# ----------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def nhap_diem(request):
    data = request.data
    try:
        id_hocsinh = data['IDHocSinh']
        id_lop = data['IDLopHoc']
        id_mon = data['IDMonHoc']
        id_hocky = data['IDHocKy']
        diem15 = float(data.get('Diem15', 0))
        diem1tiet = float(data.get('Diem1Tiet', 0))
    except KeyError:
        return Response({'detail': 'Thiếu dữ liệu bắt buộc.'}, status=status.HTTP_400_BAD_REQUEST)

    for diem in [diem15, diem1tiet]:
        if diem < 0 or diem > 10:
            return Response({'detail': 'Điểm phải nằm trong khoảng từ 0 đến 10.'}, status=status.HTTP_400_BAD_REQUEST)

    if DiemSo.objects.filter(IDHocSinh=id_hocsinh, IDLopHoc=id_lop, IDMonHoc=id_mon, IDHocKy=id_hocky).exists():
        return Response({'detail': 'Điểm đã tồn tại. Vui lòng dùng API cập nhật.'}, status=status.HTTP_409_CONFLICT)

    diem_tb = tinh_diem_tb(diem15, diem1tiet)

    DiemSo.objects.create(
        IDHocSinh_id=id_hocsinh,
        IDLopHoc_id=id_lop,
        IDMonHoc_id=id_mon,
        IDHocKy_id=id_hocky,
        Diem15=diem15,
        Diem1Tiet=diem1tiet,
        DiemTB=diem_tb
    )
    return Response({'detail': 'Nhập điểm thành công.'}, status=status.HTTP_201_CREATED)

# ----------------------------------------
# API: Cập nhật điểm
# ----------------------------------------

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cap_nhat_diem(request):
    data = request.data
    try:
        id_hocsinh = data['IDHocSinh']
        id_lop = data['IDLopHoc']
        id_mon = data['IDMonHoc']
        id_hocky = data['IDHocKy']
        diem15 = float(data.get('Diem15', 0))
        diem1tiet = float(data.get('Diem1Tiet', 0))
    except KeyError:
        return Response({'detail': 'Thiếu dữ liệu bắt buộc.'}, status=status.HTTP_400_BAD_REQUEST)

    for diem in [diem15, diem1tiet]:
        if diem < 0 or diem > 10:
            return Response({'detail': 'Điểm phải nằm trong khoảng từ 0 đến 10.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        diem_obj = DiemSo.objects.get(
            IDHocSinh=id_hocsinh,
            IDLopHoc=id_lop,
            IDMonHoc=id_mon,
            IDHocKy=id_hocky
        )
    except DiemSo.DoesNotExist:
        return Response({'detail': 'Chưa có điểm để cập nhật.'}, status=status.HTTP_404_NOT_FOUND)

    diem_obj.Diem15 = diem15
    diem_obj.Diem1Tiet = diem1tiet
    diem_obj.DiemTB = tinh_diem_tb(diem15, diem1tiet)
    diem_obj.save()

    return Response({'detail': 'Cập nhật điểm thành công.'}, status=status.HTTP_200_OK)

# ----------------------------------------
# API: Lấy danh sách điểm hiện tại theo lớp + môn + học kỳ
# ----------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def diem_hien_tai(request):
    id_lop = request.GET.get('IDLopHoc')
    id_mon = request.GET.get('IDMonHoc')
    id_hocky = request.GET.get('IDHocKy')

    if not all([id_lop, id_mon, id_hocky]):
        return Response({'detail': 'Thiếu tham số.'}, status=status.HTTP_400_BAD_REQUEST)

    hoc_sinh_list = HocSinh.objects.filter(lophoc_hocsinh__IDLopHoc=id_lop).distinct()
    result = []

    for hs in hoc_sinh_list:
        diem = DiemSo.objects.filter(
            IDHocSinh=hs,
            IDLopHoc=id_lop,
            IDMonHoc=id_mon,
            IDHocKy=id_hocky
        ).first()

        result.append({
            "id": hs.id,
            "HoTen": f"{hs.Ho} {hs.Ten}",
            "Diem15": diem.Diem15 if diem else "",
            "Diem1Tiet": diem.Diem1Tiet if diem else "",
        })

    return Response(result)
