from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from orders.models import Order
from orders.serializers import OrderSerializer


class DeliveryAgentViewSet(viewsets.ViewSet):
    """Delivery Agent ViewSet"""
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """Get all orders assigned to the agent"""
        if request.user.role != 'agent':
            return Response(
                {'error': 'Only delivery agents can access this endpoint'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        orders = Order.objects.filter(assigned_agent=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def available_orders(self, request):
        """Get orders that need delivery (not assigned to any agent)"""
        if request.user.role != 'agent':
            return Response(
                {'error': 'Only delivery agents can access this endpoint'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        orders = Order.objects.filter(
            status__in=['accepted', 'cooking', 'out_for_delivery'],
            assigned_agent__isnull=True
        )
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def accept_order(self, request, pk=None):
        """Accept a delivery order"""
        if request.user.role != 'agent':
            return Response(
                {'error': 'Only delivery agents can accept orders'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if order.assigned_agent:
            return Response(
                {'error': 'Order already assigned to another agent'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.assigned_agent = request.user
        order.save()
        
        return Response(OrderSerializer(order).data)
    
    @action(detail=True, methods=['post'])
    def update_delivery_status(self, request, pk=None):
        """Update delivery status"""
        if request.user.role != 'agent':
            return Response(
                {'error': 'Only delivery agents can update delivery status'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            order = Order.objects.get(pk=pk, assigned_agent=request.user)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found or not assigned to you'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        new_status = request.data.get('status')
        
        if not new_status:
            return Response(
                {'error': 'Status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Delivery agents can only update to out_for_delivery or delivered
        if new_status not in ['out_for_delivery', 'delivered']:
            return Response(
                {'error': 'Invalid status. Agents can only set: out_for_delivery, delivered'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        order.save()
        
        return Response(OrderSerializer(order).data)
