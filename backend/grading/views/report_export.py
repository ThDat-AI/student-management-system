from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def xuat_bao_cao_excel(request):
    return Response({"message": "API xuat_bao_cao_excel hoạt động"})
