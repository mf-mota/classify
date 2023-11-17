from django.urls import path
from .views import ListingsList, ListingShow, LocationsList

app_name = "classify_portal_api"

urlpatterns = [
    path("listings/<int:pk>/", ListingShow.as_view(), name="show_listing"),
    path("listings", ListingsList.as_view(), name="listings_index"),
    path("locations", LocationsList.as_view(), name="locations_list"),
]