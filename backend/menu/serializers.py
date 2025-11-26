from rest_framework import serializers
from .models import Category, MenuItem


class CategorySerializer(serializers.ModelSerializer):
    """Category Serializer"""
    
    class Meta:
        model = Category
        fields = ['id', 'name']


class MenuItemSerializer(serializers.ModelSerializer):
    """Menu Item Serializer"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    
    class Meta:
        model = MenuItem
        fields = [
            'id', 'restaurant', 'restaurant_name', 'category', 'category_name',
            'name', 'price', 'description', 'image', 'is_available', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
