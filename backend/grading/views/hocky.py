#grading/views/hocky.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from grading.models import HocKy

@api_view(['GET'])
def danh_sach_hocky(request):
    ds = HocKy.objects.all().values('id', 'TenHocKy')
    return Response(ds)
