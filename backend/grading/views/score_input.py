from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from grading.models import DiemSo
from grading.serializers import DiemSoSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def nhap_diem(request):
    serializer = DiemSoSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cap_nhat_diem(request, diem_id):
    try:
        diem = DiemSo.objects.get(id=diem_id)
    except DiemSo.DoesNotExist:
        return Response({'error': 'Không tìm thấy bản ghi điểm.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = DiemSoSerializer(diem, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def lay_diem(request):
    hoc_sinh_id = request.GET.get('IDHocSinh')
    lop_id = request.GET.get('IDLopHoc')
    mon_id = request.GET.get('IDMonHoc')
    hocky_id = request.GET.get('IDHocKy')

    if not all([hoc_sinh_id, lop_id, mon_id, hocky_id]):
        return Response({'error': 'Thiếu tham số: IDHocSinh, IDLopHoc, IDMonHoc, IDHocKy là bắt buộc.'},
                        status=status.HTTP_400_BAD_REQUEST)

    queryset = DiemSo.objects.filter(
        IDHocSinh_id=hoc_sinh_id,
        IDLopHoc_id=lop_id,
        IDMonHoc_id=mon_id,
        IDHocKy_id=hocky_id
    )

    serializer = DiemSoSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
