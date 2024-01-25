from django.urls import path
# from .views import ListingsList, ListingShow
from .views import LocationsList, UserListingsList, MainCategoriesList, MainCategoriesDetailList, SubCategoriesList
from .views import upload_to_backblaze, ReportListing, AppendImageToListing, RemoveImageFromListing
from .views import ActiveListingViewSet
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

app_name = "classify_portal_api"

# urlpatterns = [
#     # path("listings/<int:pk>/", ListingShow.as_view(), name="show_listing"),
#     # path("listings/", ListingsList.as_view(), name="listings_index"),
#     path("locations/", LocationsList.as_view(), name="locations_list"),
#     path("users/<int:user_id>/", UserListingsList.as_view(), name="users_listings")
# ]

urlpatterns = [
    path("users/<int:user_id>/", UserListingsList.as_view(), name="users_listings"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/validate/', TokenVerifyView.as_view(), name='validate_token'),
    path("categories/", MainCategoriesList.as_view(), name="main_categories_list"),
    path("maincat-details", MainCategoriesDetailList.as_view(), name="main_categories_details_list"),
    path("subcategories/", SubCategoriesList.as_view(), name="subcategories_list"),
    path("locations/", LocationsList.as_view(), name="locations_list"),
    path('upload_listing_images/', upload_to_backblaze, name='upload_imgs'),
    path("listings/images/", AppendImageToListing.as_view(), name='append_image'),
    path("images/<int:pk>", RemoveImageFromListing.as_view(), name='append_image'),
    path("report/", ReportListing.as_view(), name="listing_report")
]

router = DefaultRouter()
router.register("listings", ActiveListingViewSet, basename='active_listings')

[urlpatterns.append(url) for url in router.urls]