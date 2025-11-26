from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from menu.models import MenuItem


class CartViewSet(viewsets.ModelViewSet):
    """Cart ViewSet"""
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def list(self, request):
        """Get or create cart for current user"""
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add(self, request):
        """Add item to cart"""
        menu_item_id = request.data.get('menu_item_id')
        quantity = int(request.data.get('quantity', 1))

        if not menu_item_id:
            return Response(
                {'error': 'menu_item_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            menu_item = MenuItem.objects.get(id=menu_item_id, is_available=True)
        except MenuItem.DoesNotExist:
            return Response(
                {'error': 'Menu item not found or unavailable'},
                status=status.HTTP_404_NOT_FOUND
            )

        cart, created = Cart.objects.get_or_create(user=request.user)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            menu_item=menu_item,
            defaults={'quantity': quantity, 'price_snapshot': menu_item.price}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        return Response(
            CartSerializer(cart).data,
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'])
    def remove(self, request):
        """Remove item from cart"""
        cart_item_id = request.data.get('cart_item_id')

        if not cart_item_id:
            return Response(
                {'error': 'cart_item_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cart = Cart.objects.get(user=request.user)
            cart_item = CartItem.objects.get(id=cart_item_id, cart=cart)
            cart_item.delete()

            return Response(
                CartSerializer(cart).data,
                status=status.HTTP_200_OK
            )
        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return Response(
                {'error': 'Cart item not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def update_quantity(self, request):
        """Update cart item quantity"""
        cart_item_id = request.data.get('cart_item_id')
        quantity = request.data.get('quantity')

        if not cart_item_id or quantity is None:
            return Response(
                {'error': 'cart_item_id and quantity are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cart = Cart.objects.get(user=request.user)
            cart_item = CartItem.objects.get(id=cart_item_id, cart=cart)
            cart_item.quantity = int(quantity)
            cart_item.save()

            return Response(
                CartSerializer(cart).data,
                status=status.HTTP_200_OK
            )
        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return Response(
                {'error': 'Cart item not found'},
                status=status.HTTP_404_NOT_FOUND
            )
