from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Category, MenuItem
from .serializers import CategorySerializer, MenuItemSerializer
from restaurants.permissions import IsRestaurantOwner


class CategoryViewSet(viewsets.ModelViewSet):
    """Category ViewSet"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated(), IsRestaurantOwner()]


class MenuItemViewSet(viewsets.ModelViewSet):
    """Menu Item ViewSet"""
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated(), IsRestaurantOwner()]
    
    def get_queryset(self):
        queryset = MenuItem.objects.all()
        restaurant_id = self.request.query_params.get('restaurant', None)
        
        if restaurant_id:
            queryset = queryset.filter(restaurant_id=restaurant_id)
        
        return queryset
