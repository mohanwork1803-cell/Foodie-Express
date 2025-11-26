from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RestaurantViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r'', RestaurantViewSet, basename='restaurant')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
]
