from rest_framework import serializers
from listings.models import Listing, ListingLocation

class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ['id', 'name', 'description', 'category', 'price', 'location', 'owner', 'is_active']


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingLocation
        fields = ['district', 'city', 'state', 'country']
