from django.contrib import admin
from . import models

@admin.register(models.ListingCategory)
class ListingCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'id']

@admin.register(models.MainCategory)
class MainCategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']

@admin.register(models.Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'description', 
                    'is_active', 'price', 'location', 'owner', 'creation']
    list_filter = ['category', 'is_active', 'location']


@admin.register(models.ListingLocation)
class ListingLocationAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'district', 'city', 'state', 'country']


@admin.register(models.ListingImage)
class ListingImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'listing', 'url', 'is_main']