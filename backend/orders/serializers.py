from rest_framework import serializers
from .models import Order, OrderItem
from menu.serializers import MenuItemSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    """Order Item Serializer"""
    menu_item_details = MenuItemSerializer(source='menu_item', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'menu_item_details', 'quantity', 'price', 'subtotal']
        read_only_fields = ['id']


class OrderSerializer(serializers.ModelSerializer):
    """Order Serializer"""
    items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    agent_name = serializers.CharField(source='assigned_agent.name', read_only=True, allow_null=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'user_name', 'restaurant', 'restaurant_name',
            'total_amount', 'payment_method', 'status', 'assigned_agent', 'agent_name',
            'delivery_address', 'notes', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class CreateOrderSerializer(serializers.Serializer):
    """Create Order Serializer"""
    payment_method = serializers.ChoiceField(choices=['cod', 'online'])
    delivery_address = serializers.CharField()
    notes = serializers.CharField(required=False, allow_blank=True)
