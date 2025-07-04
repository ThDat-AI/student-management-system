# subjects/serializers.py

from rest_framework import serializers
from subjects.models import MonHoc

class MonHocSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonHoc
        fields = ['id', 'TenMonHoc']  # <-- tên đúng của trường

