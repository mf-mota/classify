from django.contrib import admin
from . import models

@admin.register(models.ListingCategory)
class ListingCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'id']

@admin.register(models.Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'description', 
                    'is_active', 'price', 'location', 'owner']


@admin.register(models.ListingLocation)
class ListingLocationAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'district', 'city', 'state', 'country']