from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from grading.models import DiemSo, TongKetHocKy, HocKy
from students.models import HocSinh
from classes.models import LopHoc


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def tong_hop_diem_hoc_ky(request):
    id_lop = request.data.get('IDLopHoc')
    id_hocky = request.data.get('IDHocKy')

    if not id_lop or not id_hocky:
        return Response({'error': 'Thiếu IDLopHoc hoặc IDHocKy'}, status=400)

    try:
        hoc_ky = HocKy.objects.get(id=id_hocky)
    except HocKy.DoesNotExist:
        return Response({'error': 'Học kỳ không tồn tại'}, status=404)

    hoc_sinh_list = HocSinh.objects.filter(IDLopHoc=id_lop)
    ket_qua = []

    for hs in hoc_sinh_list:
        diem_mon = DiemSo.objects.filter(IDHocSinh=hs, IDHocKy=hoc_ky)

        diem_tb_list = [d.DiemTB for d in diem_mon if d.DiemTB is not None]

        if len(diem_tb_list) < 2:
            ket_qua.append({
                'HocSinh': str(hs),
                'CanhBao': 'Thiếu điểm môn học'
            })
            continue

        diem_tb_hk = round(sum(diem_tb_list) / len(diem_tb_list), 2)

        if diem_tb_hk >= 8.0:
            hoc_luc = 'Giỏi'
        elif diem_tb_hk >= 6.5:
            hoc_luc = 'Khá'
        elif diem_tb_hk >= 5.0:
            hoc_luc = 'Trung bình'
        else:
            hoc_luc = 'Yếu'

        TongKetHocKy.objects.update_or_create(
            IDHocSinh=hs,
            IDLopHoc_id=id_lop,
            IDHocKy=hoc_ky,
            defaults={
                'DiemTBHocKy': diem_tb_hk,
                'HocLuc': hoc_luc
            }
        )

        ket_qua.append({
            'HocSinh': str(hs),
            'DiemTBHocKy': diem_tb_hk,
            'HocLuc': hoc_luc
        })

    return Response(ket_qua)
