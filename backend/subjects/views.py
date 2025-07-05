#subjects/views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from subjects.models import MonHoc

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def danh_sach_monhoc(request):
    monhoc = MonHoc.objects.all()
    data = [{"id": m.id, "TenMonHoc": m.TenMonHoc} for m in monhoc]
    return Response(data)
