from django.db import models
from restaurants.models import Restaurant


class Category(models.Model):
    """Category Model"""
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'Categories'


class MenuItem(models.Model):
    """Menu Item Model"""
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='menu_items')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='menu_items')
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='menu_items/', blank=True, null=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.restaurant.name}"
    
    class Meta:
        db_table = 'menu_items'
        ordering = ['-created_at']
