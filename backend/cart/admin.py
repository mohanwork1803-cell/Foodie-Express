from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ["price_snapshot", "subtotal"]


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ["user", "created_at", "updated_at", "subtotal", "tax_amount", "total_amount"]
    inlines = [CartItemInline]


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ["cart", "menu_item", "quantity", "price_snapshot", "subtotal"]
