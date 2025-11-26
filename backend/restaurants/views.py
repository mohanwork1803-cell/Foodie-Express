from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Restaurant, Review
from .serializers import RestaurantSerializer, ReviewSerializer
from .permissions import IsOwnerOrReadOnly


class RestaurantViewSet(viewsets.ModelViewSet):
    """Restaurant ViewSet"""
    queryset = Restaurant.objects.filter(is_active=True)
    serializer_class = RestaurantSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated(), IsOwnerOrReadOnly()]
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def menu(self, request, pk=None):
        """Get menu items for a restaurant"""
        restaurant = self.get_object()
        from menu.models import MenuItem
        from menu.serializers import MenuItemSerializer
        
        menu_items = MenuItem.objects.filter(restaurant=restaurant, is_available=True)
        serializer = MenuItemSerializer(menu_items, many=True)
        return Response(serializer.data)


class ReviewViewSet(viewsets.ModelViewSet):
    """Review ViewSet"""
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        review = serializer.save(user=self.request.user)
        
        # Update restaurant rating
        restaurant = review.restaurant
        reviews = Review.objects.filter(restaurant=restaurant)
        avg_rating = sum(r.rating for r in reviews) / reviews.count()
        restaurant.rating = round(avg_rating, 2)
        restaurant.save()
