from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from grading.models import DiemSo, DiemSoLichSu
from grading.serializers import DiemSoSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def nhap_diem(request):
    """
    Nhập điểm mới cho học sinh theo môn và học kỳ.
    Nếu đã tồn tại điểm cho học sinh đó, trả về lỗi.
    """
    serializer = DiemSoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(NguoiCapNhat=request.user)
        return Response({
            'message': 'Nhập điểm thành công',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cap_nhat_diem(request, diem_id):
    """
    Cập nhật điểm cho học sinh (có sẵn record).
    Lưu lịch sử điểm cũ vào bảng `DiemSoLichSu`.
    """
    try:
        diem = DiemSo.objects.get(id=diem_id)
    except DiemSo.DoesNotExist:
        return Response({'error': 'Không tìm thấy bản ghi điểm.'}, status=404)

    # Ghi lại dữ liệu cũ trước khi sửa
    old_data = {
        'DiemMieng': diem.DiemMieng,
        'Diem15': diem.Diem15,
        'Diem1Tiet': diem.Diem1Tiet,
        'DiemThi': diem.DiemThi,
        'DiemTB': diem.DiemTB,
    }

    serializer = DiemSoSerializer(diem, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save(NguoiCapNhat=request.user)

        DiemSoLichSu.objects.create(
            DiemGoc=diem,
            NguoiThayDoi=request.user,
            NoiDungThayDoi=f"Thay đổi điểm từ {old_data} → {serializer.validated_data}"
        )

        return Response({
            'message': 'Cập nhật điểm thành công',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
