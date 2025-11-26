from rest_framework import serializers
from .models import Cart, CartItem
from menu.serializers import MenuItemSerializer


class CartItemSerializer(serializers.ModelSerializer):
    """Cart Item Serializer"""
    menu_item_details = MenuItemSerializer(source='menu_item', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'menu_item', 'menu_item_details', 'quantity', 'price_snapshot', 'subtotal']
        read_only_fields = ['id', 'price_snapshot']


class CartSerializer(serializers.ModelSerializer):
    """Cart Serializer"""
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_amount', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
