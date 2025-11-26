from django.contrib import admin
from .models import Restaurant, Review


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'rating', 'is_active', 'created_at']
    list_filter = ['is_active', 'rating']
    search_fields = ['name', 'address', 'owner__name']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'restaurant', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['user__name', 'restaurant__name', 'comment']
