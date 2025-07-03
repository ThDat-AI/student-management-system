from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from grading.models import DiemSo, DiemSoLichSu
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
        return Response({'error': 'Không tìm thấy điểm'}, status=404)

    serializer = DiemSoSerializer(diem, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
