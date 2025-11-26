from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DeliveryAgentViewSet

router = DefaultRouter()
router.register(r'orders', DeliveryAgentViewSet, basename='delivery')

urlpatterns = [
    path('', include(router.urls)),
]
