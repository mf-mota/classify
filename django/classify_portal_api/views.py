from rest_framework import generics
from listings.models import Listing, ListingLocation, ListingImage, MainCategory
from rest_framework.response import Response
from rest_framework.permissions import BasePermission, SAFE_METHODS, IsAuthenticated
from classify_portal_api.serializers import ListingSerializerMainPage, UserListingOverview
from classify_portal_api.serializers import ListingSerializerDetails, LocationSerializer, MainCategorySerializerMain
from rest_framework import viewsets
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication


# using the custom manager to return active listings only

class UpdateDeletePermission(BasePermission):
    message = "You are not the owner of this listing"
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.owner == request.user

class ActiveListingViewSet(viewsets.ViewSet):
    queryset = Listing.active_listings.all()
    permission_classes = [IsAuthenticated]

    def list(self, request): 
        serializer = ListingSerializerMainPage(self.queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk): 
        try:
            listing = self.queryset.get(pk=pk)
        except Listing.DoesNotExist:
            return Response({"detail": "Listing not found"}, status=404)
        if request.user != listing.owner:
            listing.inc_view_count()
        serializer = ListingSerializerDetails(listing)
        return Response(serializer.data)




# class ListingsList(generics.ListCreateAPIView):
#     queryset = Listing.active_listings.all()
#     serializer_class = ListingSerializerMainPage

# class ListingShow(generics.RetrieveDestroyAPIView, UpdateDeletePermission):
#     queryset = Listing.all_listings.all()
#     serializer_class = ListingSerializerDetails
#     def get(self, request, *args, **kwargs):
#         listing = self.get_object()
#         #TODO: Check whether it's working!
#         if request.user != listing.owner:
#             listing.inc_view_count()
#         return super().get(request, *args, **kwargs)

class MainCategoriesList(generics.ListAPIView):
    queryset = MainCategory.objects.all()
    serializer_class = MainCategorySerializerMain

class LocationsList(generics.ListCreateAPIView):
    queryset = ListingLocation.locations.all()
    serializer_class = LocationSerializer

class UserListingsList(generics.ListCreateAPIView):
    serializer_class = UserListingOverview

    def get_queryset(self):
        return Listing.all_listings.filter(owner=self.kwargs.get('user_id'))
