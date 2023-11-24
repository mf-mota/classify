from django.urls import path
# from .views import ListingsList, ListingShow
from .views import LocationsList, UserListingsList
from .views import ActiveListingViewSet
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

app_name = "classify_portal_api"

# urlpatterns = [
#     # path("listings/<int:pk>/", ListingShow.as_view(), name="show_listing"),
#     # path("listings/", ListingsList.as_view(), name="listings_index"),
#     path("locations/", LocationsList.as_view(), name="locations_list"),
#     path("users/<int:user_id>/", UserListingsList.as_view(), name="users_listings")
# ]

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

router = DefaultRouter()
router.register("listings", ActiveListingViewSet, basename='active_listings')

[urlpatterns.append(url) for url in router.urls]