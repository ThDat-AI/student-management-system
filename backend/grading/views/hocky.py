# grading/views/hocky.py

from rest_framework import generics, permissions
from grading.models import HocKy
from grading.serializers import HocKySerializer

class HocKyListView(generics.ListAPIView):
    queryset = HocKy.objects.all()
    serializer_class = HocKySerializer
    permission_classes = [permissions.IsAuthenticated]
