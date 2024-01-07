from django_filters import rest_framework as flt
from listings.models import Listing

class ListingFilter(flt.FilterSet):
    min_price = flt.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = flt.NumberFilter(field_name="price", lookup_expr="lte")
    ct1 = flt.CharFilter(field_name="cat_text_prop_1", lookup_expr="icontains")
    ct2 = flt.CharFilter(field_name="cat_text_prop_2", lookup_expr="icontains")
    ct3_min = flt.NumberFilter(field_name="cat_text_prop_3", lookup_expr="gte")
    ct3_max = flt.NumberFilter(field_name="cat_text_prop_3", lookup_expr="lte")
    ct4_min = flt.NumberFilter(field_name="cat_text_prop_4", lookup_expr="gte")
    ct4_max = flt.NumberFilter(field_name="cat_text_prop_4", lookup_expr="lte")
    main_cat = flt.NumberFilter(field_name="category__main__id")
    # do location as well
    class Meta:
        model = Listing
        fields = [
            'price', 'cat_text_prop_1', 'cat_text_prop_2', 'main_cat', 'location'
        ]
