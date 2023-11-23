from django.urls import path
# from .views import ListingsList, ListingShow
from .views import LocationsList, UserListingsList
from .views import ActiveListingViewSet
from rest_framework.routers import DefaultRouter


app_name = "classify_portal_api"

# urlpatterns = [
#     # path("listings/<int:pk>/", ListingShow.as_view(), name="show_listing"),
#     # path("listings/", ListingsList.as_view(), name="listings_index"),
#     path("locations/", LocationsList.as_view(), name="locations_list"),
#     path("users/<int:user_id>/", UserListingsList.as_view(), name="users_listings")
# ]
router = DefaultRouter()
router.register("listings", ActiveListingViewSet, basename='active_listings')
urlpatterns = router.urls