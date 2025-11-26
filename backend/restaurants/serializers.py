from rest_framework import serializers
from .models import Restaurant, Review


class RestaurantSerializer(serializers.ModelSerializer):
    """Restaurant Serializer"""
    owner_name = serializers.CharField(source='owner.name', read_only=True)
    
    class Meta:
        model = Restaurant
        fields = ['id', 'owner', 'owner_name', 'name', 'address', 'rating', 'is_active', 'created_at']
        read_only_fields = ['id', 'rating', 'created_at', 'owner_name']


class ReviewSerializer(serializers.ModelSerializer):
    """Review Serializer"""
    user_name = serializers.CharField(source='user.name', read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'user_name', 'restaurant', 'restaurant_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
