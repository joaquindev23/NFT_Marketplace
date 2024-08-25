from rest_framework import serializers
from .models import *

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            'id',
            'user',
            'rating',
            'comment',
            'date_created',
        ]