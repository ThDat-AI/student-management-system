from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import HttpResponse
from reporting.models import BaoCaoMonHoc
from django.db.models import F
import pandas as pd
import io

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def xuat_bao_cao_excel(request):
    """
    Xuất báo cáo điểm theo lớp - môn - học kỳ (Excel)
    """
    try:
        id_nienkhoa = request.data.get("IDNienKhoa")
        id_hocky = request.data.get("IDHocKy")
        id_lop = request.data.get("IDLopHoc")  # có thể không chọn
        id_mon = request.data.get("IDMonHoc")  # có thể không chọn

        queryset = BaoCaoMonHoc.objects.select_related(
            "IDMonHoc", "IDLopHoc", "IDHocKy", "IDNienKhoa"
        ).filter(IDNienKhoa_id=id_nienkhoa, IDHocKy_id=id_hocky)

        if id_lop:
            queryset = queryset.filter(IDLopHoc_id=id_lop)
        if id_mon:
            queryset = queryset.filter(IDMonHoc_id=id_mon)

        data = [{
            "Lớp": item.IDLopHoc.TenLop,
            "Môn học": item.IDMonHoc.TenMonHoc,
            "Sĩ số": item.SiSo,
            "Số lượng đạt": item.SoLuongDat,
            "Tỉ lệ %": round(item.TiLe * 100, 2),
        } for item in queryset]

        if not data:
            return Response({"detail": "Không có dữ liệu báo cáo."}, status=404)

        df = pd.DataFrame(data)
        buffer = io.BytesIO()
        df.to_excel(buffer, index=False)
        buffer.seek(0)

        response = HttpResponse(
            buffer,
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response["Content-Disposition"] = 'attachment; filename="bao_cao_mon_hoc.xlsx"'
        return response

    except Exception as e:
        return Response({"detail": f"Lỗi khi tạo báo cáo: {str(e)}"}, status=500)
