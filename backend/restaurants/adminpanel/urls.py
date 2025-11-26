from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminUserViewSet, AdminRestaurantViewSet, AdminOrderViewSet

router = DefaultRouter()
router.register(r'users', AdminUserViewSet, basename='admin-users')
router.register(r'restaurants', AdminRestaurantViewSet, basename='admin-restaurants')
router.register(r'orders', AdminOrderViewSet, basename='admin-orders')

urlpatterns = [
    path('', include(router.urls)),
]
