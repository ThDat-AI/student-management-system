import io
import pandas as pd
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from grading.models import TongKetHocKy, HocKy
from students.models import HocSinh
from classes.models import LopHoc


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def xuat_bao_cao_excel(request):
    id_lop = request.data.get('IDLopHoc')
    id_hocky = request.data.get('IDHocKy')

    if not id_lop or not id_hocky:
        return Response({'error': 'Thiếu IDLopHoc hoặc IDHocKy'}, status=400)

    lop = LopHoc.objects.get(id=id_lop)
    hocky = HocKy.objects.get(id=id_hocky)

    danh_sach = TongKetHocKy.objects.filter(IDLopHoc=lop, IDHocKy=hocky)

    if not danh_sach.exists():
        return Response({'error': 'Chưa có dữ liệu tổng kết học kỳ'}, status=404)

    # Tạo dữ liệu DataFrame
    data = []
    for item in danh_sach:
        data.append({
            'Họ tên': str(item.IDHocSinh),
            'Điểm TB học kỳ': item.DiemTBHocKy,
            'Học lực': item.HocLuc,
        })

    df = pd.DataFrame(data)

    # Xuất ra file Excel
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='BaoCao')
        writer.save()

    output.seek(0)
    response = HttpResponse(output.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = f'attachment; filename=BaoCao_{lop.TenLop}_{hocky.TenHocKy}.xlsx'
    return response
