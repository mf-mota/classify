from django_filters import rest_framework as flt
from listings.models import Listing, ListingCategory, MainCategory
from django.db.models import Q


class ListingFilter(flt.FilterSet):
    min_price = flt.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = flt.NumberFilter(field_name="price", lookup_expr="lte")
    ct1 = flt.CharFilter(field_name="cat_text_prop_1", lookup_expr="icontains")
    ct2 = flt.CharFilter(field_name="cat_text_prop_2", lookup_expr="icontains")
    ct3_min = flt.NumberFilter(field_name="cat_num_prop_3", lookup_expr="gte")
    ct3_max = flt.NumberFilter(field_name="cat_num_prop_3", lookup_expr="lte")
    ct4_min = flt.NumberFilter(field_name="cat_num_prop_4", lookup_expr="gte")
    ct4_max = flt.NumberFilter(field_name="cat_num_prop_4", lookup_expr="lte")
    main_cat = flt.NumberFilter(field_name="category__main__id")
    q = flt.CharFilter(method="text_search", lookup_expr="icontains")

    def text_search(self, queryset, name, value):
        return queryset.filter(Q(name__icontains=value) | Q(description__icontains=value))

    class Meta:
        model = Listing
        fields = [
            'price', 'cat_text_prop_1', 'cat_text_prop_2', 'main_cat', 'location', 'category', 'name', 'q'
        ]

class CategoryFilter(flt.FilterSet):
    main_cat = flt.NumberFilter(field_name="main__id")
    class Meta:
        model = ListingCategory
        fields = [
            'main'
        ]

class MainCategoryFilter(flt.FilterSet):
    class Meta:
        model = MainCategory
        fields = ['id']
