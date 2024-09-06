from rest_framework import serializers
from .models import Jobs

class JobsSerializers(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(required=True)
    teaser = serializers.CharField(required=True)
    companyName = serializers.CharField(required=True)
    location = serializers.CharField(required=True)
    workType = serializers.CharField(required=True)
    role = serializers.CharField(required=True)
    salary = serializers.CharField(required=True)
    keyword = serializers.CharField(required=True)
    bulletPoints = serializers.JSONField(required=True)
    class Meta:
        model = Jobs
        fields = '__all__'