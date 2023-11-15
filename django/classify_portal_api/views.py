from rest_framework import generics
from listings.models import Listing, ListingLocation
from classify_portal_api.serializers import ListingSerializer, LocationSerializer

# using the custom manager to return active listings only
class ListingsList(generics.ListCreateAPIView):
    queryset = Listing.active_listings.all()
    serializer_class = ListingSerializer

class ListingShow(generics.RetrieveAPIView):
    pass

class LocationsList(generics.ListCreateAPIView):
    queryset = ListingLocation.locations.all()
    serializer_class = LocationSerializer
