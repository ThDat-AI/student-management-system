#classes/views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from classes.models import LopHoc

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def danh_sach_lop(request):
    lops = LopHoc.objects.all()
    data = [{"id": lop.id, "TenLop": lop.TenLop} for lop in lops]
    return Response(data)
