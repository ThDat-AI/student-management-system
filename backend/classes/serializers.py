#classes/serializers.py

from rest_framework import serializers
from .models import LopHoc

class LopHocSerializer(serializers.ModelSerializer):
    class Meta:
        model = LopHoc
        fields = ['id', 'TenLop']
