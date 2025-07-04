# subjects/views.py
from rest_framework import generics, permissions
from subjects.models import MonHoc
from subjects.serializers import MonHocSerializer

class MonHocListView(generics.ListAPIView):
    queryset = MonHoc.objects.all()
    serializer_class = MonHocSerializer
    permission_classes = [permissions.IsAuthenticated]
 