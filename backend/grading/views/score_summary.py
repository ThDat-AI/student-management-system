from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from grading.models import DiemSo
from students.models import HocSinh

from django.db.models import Avg, Q
from django.http import HttpResponse

import pandas as pd
import io


def phan_loai_hoc_luc(diem_tb):
    if diem_tb >= 8.0:
        return "Giỏi"
    elif diem_tb >= 6.5:
        return "Khá"
    elif diem_tb >= 5.0:
        return "Trung bình"
    else:
        return "Yếu"


def lay_diem_tong_hop(id_lop=None, id_khoi=None, id_hocky=None):
    """
    Trả về danh sách điểm trung bình + xếp loại cho học sinh theo lớp hoặc khối.
    """
    if not id_hocky:
        raise ValueError("Thiếu ID học kỳ.")

    # Lấy danh sách học sinh theo điều kiện
    if id_lop:
        hoc_sinh_qs = HocSinh.objects.filter(
            lophoc_hocsinh__IDLopHoc=id_lop
        ).distinct()
    elif id_khoi:
        hoc_sinh_qs = HocSinh.objects.filter(
            lophoc_hocsinh__IDLopHoc__IDKhoi=id_khoi
        ).distinct()
    else:
        hoc_sinh_qs = HocSinh.objects.all()

    ket_qua = []

    for hs in hoc_sinh_qs:
        diem_qs = DiemSo.objects.filter(IDHocSinh=hs, IDHocKy=id_hocky)

        if not diem_qs.exists():
            continue

        so_mon = diem_qs.count()
        so_mon_day_du = diem_qs.filter(~Q(Diem15=None), ~Q(Diem1Tiet=None)).count()

        diem_tb = diem_qs.filter(~Q(DiemTB=None)).aggregate(tb=Avg('DiemTB'))['tb']
        if diem_tb is None:
            continue

        xep_loai = phan_loai_hoc_luc(diem_tb)

        ket_qua.append({
            "id": hs.id,
            "HoTen": f"{hs.Ho} {hs.Ten}",
            "DiemTB": round(diem_tb, 2),
            "XepLoai": xep_loai,
            "ThieuDiem": so_mon != so_mon_day_du
        })

    return ket_qua


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def tong_hop_diem_hoc_ky(request):
    """
    Tổng hợp điểm trung bình học kỳ (không lưu DB).
    """
    try:
        id_lop = request.data.get("IDLopHoc")
        id_khoi = request.data.get("IDKhoi")
        id_hocky = request.data.get("IDHocKy")

        if not id_hocky:
            return Response({"detail": "Thiếu học kỳ."}, status=400)

        ket_qua = lay_diem_tong_hop(id_lop=id_lop, id_khoi=id_khoi, id_hocky=id_hocky)
        return Response(ket_qua)

    except ValueError as ve:
        return Response({"detail": str(ve)}, status=400)
    except Exception as e:
        return Response({"detail": f"Lỗi xử lý: {str(e)}"}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def xuat_bao_cao_excel(request):
    """
    Xuất báo cáo Excel từ dữ liệu tổng hợp điểm học kỳ (không lưu DB).
    """
    try:
        id_lop = request.data.get("IDLopHoc")
        id_hocky = request.data.get("IDHocKy")

        if not id_lop or not id_hocky:
            return Response({"detail": "Thiếu lớp hoặc học kỳ."}, status=400)

        ket_qua = lay_diem_tong_hop(id_lop=id_lop, id_hocky=id_hocky)

        if not ket_qua:
            return Response({"detail": "Không có dữ liệu để xuất."}, status=400)

        # Tạo file Excel
        df = pd.DataFrame(ket_qua)
        df["Thiếu điểm"] = df["ThieuDiem"].apply(lambda x: "Có thiếu!" if x else "Không thiếu!")
        df = df.drop(columns=["id", "ThieuDiem"])
        df.columns = ["Họ tên", "Điểm TB", "Xếp loại", "Thiếu điểm"]

        output = io.BytesIO()
        with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
            df.to_excel(writer, index=False, sheet_name="BaoCao")

        output.seek(0)
        response = HttpResponse(
            output,
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response['Content-Disposition'] = 'attachment; filename="BaoCaoDiem.xlsx"'
        return response

    except ValueError as ve:
        return Response({"detail": str(ve)}, status=400)
    except Exception as e:
        return Response({"detail": f"Lỗi xuất báo cáo: {str(e)}"}, status=500)
