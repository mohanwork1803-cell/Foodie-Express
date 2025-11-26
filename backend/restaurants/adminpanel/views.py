from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from restaurants.models import Restaurant
from orders.models import Order
from users.serializers import UserSerializer
from restaurants.serializers import RestaurantSerializer
from orders.serializers import OrderSerializer

User = get_user_model()


class IsAdmin(IsAuthenticated):
    """Custom permission for admin only"""
    
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == 'admin'


class AdminUserViewSet(viewsets.ReadOnlyModelViewSet):
    """Admin User Management ViewSet"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]


class AdminRestaurantViewSet(viewsets.ModelViewSet):
    """Admin Restaurant Management ViewSet"""
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAdmin]


class AdminOrderViewSet(viewsets.ReadOnlyModelViewSet):
    """Admin Order Management ViewSet"""
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdmin]
