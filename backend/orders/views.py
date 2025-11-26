from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer
from cart.models import Cart, CartItem


class OrderViewSet(viewsets.ModelViewSet):
    """Order ViewSet"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'customer':
            return Order.objects.filter(user=user)
        elif user.role == 'owner':
            return Order.objects.filter(restaurant__owner=user)
        elif user.role == 'agent':
            return Order.objects.filter(assigned_agent=user)
        elif user.role == 'admin':
            return Order.objects.all()
        
        return Order.objects.none()
    
    @action(detail=False, methods=['post'])
    def create_order(self, request):
        """Create order from cart"""
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response(
                {'error': 'Cart is empty'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cart_items = cart.items.all()
        if not cart_items:
            return Response(
                {'error': 'Cart is empty'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if all items are from the same restaurant
        restaurants = set(item.menu_item.restaurant for item in cart_items)
        if len(restaurants) > 1:
            return Response(
                {'error': 'All items must be from the same restaurant'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        restaurant = list(restaurants)[0]
        
        # Create order
        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                restaurant=restaurant,
                total_amount=cart.total_amount,  # THIS NOW INCLUDES TAX + DELIVERY
                payment_method=serializer.validated_data['payment_method'],
                delivery_address=serializer.validated_data['delivery_address'],
                notes=serializer.validated_data.get('notes', ''),
            )
            
            # Create order items
            for cart_item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    menu_item=cart_item.menu_item,
                    quantity=cart_item.quantity,
                    price=cart_item.price_snapshot
                )
            
            # Clear cart
            cart_items.delete()
        
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update order status"""
        order = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status:
            return Response(
                {'error': 'Status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate status
        valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response(
                {'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check permissions
        user = request.user
        if user.role == 'owner' and order.restaurant.owner != user:
            return Response(
                {'error': 'You do not have permission to update this order'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        order.status = new_status
        order.save()
        
        return Response(OrderSerializer(order).data)
