from django.db import models
from django.conf import settings


class Restaurant(models.Model):
    """Restaurant Model"""
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='restaurants')
    name = models.CharField(max_length=255)
    address = models.TextField()
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'restaurants'
        ordering = ['-created_at']


class Review(models.Model):
    """Review Model"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.name} - {self.restaurant.name} ({self.rating}★)"
    
    class Meta:
        db_table = 'reviews'
        ordering = ['-created_at']
        unique_together = ['user', 'restaurant']
