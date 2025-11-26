from django.db import models
from django.conf import settings
from menu.models import MenuItem
from decimal import Decimal

TAX_RATE = Decimal("0.05")  # 5% tax
DELIVERY_FEE = Decimal("40.00")  # fixed delivery fee


class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def subtotal(self):
        return sum(item.subtotal for item in self.items.all())

    @property
    def tax_amount(self):
        return (self.subtotal * TAX_RATE).quantize(Decimal("0.01"))

    @property
    def total_amount(self):
        return (self.subtotal + self.tax_amount + DELIVERY_FEE).quantize(Decimal("0.01"))

    def __str__(self):
        return f"Cart - {self.user.name}"

    class Meta:
        db_table = "carts"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price_snapshot = models.DecimalField(max_digits=10, decimal_places=2)

    @property
    def subtotal(self):
        return (self.price_snapshot * self.quantity).quantize(Decimal("0.01"))

    def save(self, *args, **kwargs):
        if not self.price_snapshot:
            self.price_snapshot = self.menu_item.price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.menu_item.name} x {self.quantity}"

    class Meta:
        db_table = "cart_items"
        unique_together = ["cart", "menu_item"]
