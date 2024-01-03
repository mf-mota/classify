from django_filters import rest_framework as flt
from listings.models import Listing

class ListingFilter(flt.FilterSet):
    min_price = flt.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = flt.NumberFilter(field_name="price", lookup_expr="lte")

    class Meta:
        model = Listing
        fields = [
            'price'
        ]