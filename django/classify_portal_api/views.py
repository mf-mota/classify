from rest_framework import generics
from listings.models import Listing, ListingLocation, ListingImage
from rest_framework.response import Response
from classify_portal_api.serializers import ListingSerializerMainPage, UserListingOverview
from classify_portal_api.serializers import ListingSerializerDetails, LocationSerializer

# using the custom manager to return active listings only
class ListingsList(generics.ListCreateAPIView):
    queryset = Listing.active_listings.all()
    serializer_class = ListingSerializerMainPage

class ListingShow(generics.RetrieveDestroyAPIView):
    queryset = Listing.all_listings.all()
    serializer_class = ListingSerializerDetails
    Listing.inc_view_count()

class LocationsList(generics.ListCreateAPIView):
    queryset = ListingLocation.locations.all()
    serializer_class = LocationSerializer

class UserListingsList(generics.ListCreateAPIView):
    serializer_class = UserListingOverview

    def get_queryset(self):
        return Listing.all_listings.filter(owner=self.kwargs.get('user_id'))
