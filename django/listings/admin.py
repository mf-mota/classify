from typing import Any
from django.contrib import admin
from django.db.models.query import QuerySet
from django.db.models import Count, Sum, expressions
from . import models


class ReportedListingFlt(admin.SimpleListFilter, admin.ModelAdmin):
    title = 'Report Count'
    parameter_name = 'reports_count'

    def lookups(self, request: Any, model_admin: Any) -> list[tuple[Any, str]]:
        return ([
            ('Max5', 'Up to 5 times'),
            ('6Max10', '6 to 10 times'),
            ('MoreThan10', 'More than 10 times')
        ])
    
    def queryset(self, request: Any, queryset: QuerySet[Any]) -> QuerySet[Any] | None:
        if self.value() == 'Max5':
            ids = []
            for value in queryset.values('listing').annotate(dcount=Count('listing')):
                print("val", value['dcount'])
                if value['dcount'] <= 5:
                    ids.append(value['listing'])
            return queryset.filter(listing__in=ids)
        elif self.value() == '6Max10':
            ids = []
            for value in queryset.values('listing').annotate(dcount=Count('listing')):
                print("val", value['dcount'])
                if value['dcount'] > 5 and value['dcount'] <= 10:
                    ids.append(value['listing'])
            return queryset.filter(listing__in=ids)
        elif self.value() == 'MoreThan10':
            ids = []
            for value in queryset.values('listing').annotate(dcount=Count('listing')):
                print("val", value)
                if value['dcount'] > 10:
                    ids.append(value['listing'])
            return queryset.filter(listing__in=ids)
        return queryset
    
    
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

@admin.register(models.Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ['id', 'listing', 'time', '__str__']
    list_filter = ['time', ReportedListingFlt]