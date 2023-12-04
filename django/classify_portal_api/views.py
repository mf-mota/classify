from rest_framework import generics
from rest_framework.views import APIView

from listings.models import Listing, ListingLocation, ListingImage, MainCategory, ListingCategory
from rest_framework_simplejwt.tokens import AccessToken
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.permissions import BasePermission, SAFE_METHODS, IsAuthenticated
from classify_portal_api.serializers import ListingSerializerMainPage, UserListingOverview
from classify_portal_api.serializers import ListingSerializerDetails, LocationSerializer, MainCategorySerializerMain, CategorySerializer
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework_simplejwt.authentication import JWTAuthentication
from b2sdk.v1 import B2Api
import environ
env = environ.Env()
environ.Env.read_env()



# using the custom manager to return active listings only

class UpdateDeletePermission(BasePermission):
    message = "You are not the owner of this listing"
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.owner == request.user

class ActiveListingViewSet(viewsets.ViewSet, UpdateDeletePermission):
    queryset = Listing.active_listings.all()
    permission_classes = [UpdateDeletePermission]
    authentication_classes = []

    def list(self, request): 
        print(request.user)
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

    def destroy(self, request, pk):
        print(request.user.username)
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required"}, status=401)
        queryset = Listing.all_listings.all()
        try:
            listing = queryset.get(pk=pk)
            print(listing.owner)
        except Listing.DoesNotExist:
            return Response({"detail": "Listin not found"}, status=404)
        else:
            if listing.owner.id == request.user.id:
                listing.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        

    def get_permissions(self):
        print("permission ran", self.request.method == 'DELETE')
        if self.request.method == 'DELETE':
            return [UpdateDeletePermission()]
        return []
    
    def get_authenticators(self):
        if self.request.method == 'DELETE':
            return [JWTAuthentication()]
        return []
    





# class ListingsList(generics.ListCreateAPIView):
#     queryset = Listing.active_listings.all()
#     serializer_class = ListingSerializerMainPage

# class ListingDeleteView(generics.DestroyAPIView, UpdateDeletePermission):
#     queryset = Listing.all_listings.all()
#     serializer_class = ListingSerializerDetails

#     def delete(self, request, *args, **kwargs):
#         listing = self.get_object()
#         listing.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)



class MainCategoriesList(generics.ListAPIView):
    queryset = MainCategory.objects.all()
    serializer_class = MainCategorySerializerMain
    authentication_classes = []

class LocationsList(generics.ListAPIView):
    queryset = ListingLocation.locations.all()
    serializer_class = LocationSerializer
    authentication_classes = []

class SubCategoriesList(generics.ListAPIView):
    queryset = ListingCategory.objects.all()
    serializer_class = CategorySerializer
    authentication_classes = []

class UserListingsList(generics.ListCreateAPIView):
    serializer_class = UserListingOverview

    def get_queryset(self):
        return Listing.all_listings.filter(owner=self.kwargs.get('user_id'))


# image upload using Backblaze, example of function view
@csrf_exempt
@require_POST
def upload_to_backblaze(request):
    if 'images' not in request.FILES:
        return JsonResponse({'error': 'Images required'}, status=status.HTTP_400_BAD_REQUEST)
    image_files = request.FILES.getlist('images')
    b2 = B2Api()
    b2.authorize_account("production", application_key_id=env('BACKBLAZE_KEY_ID'), application_key=env('BACKBLAZE_APP_KEY'))

    bucket = b2.get_bucket_by_id(env('BACKBLAZE_BUCKET_ID'))
    print(bucket)
    download_urls = []

    for image in image_files:
        # Upload each image to Backblaze B2
        file_info = bucket.upload_bytes(image.read(), file_name=image.name)
        print("id:", file_info.as_dict()['fileId'])
        download_urls.append(b2.get_download_url_for_fileid(file_info.as_dict()['fileId']))
        # Generate the download URL for the uploaded file

    return JsonResponse({'urls': download_urls}, status=status.HTTP_202_ACCEPTED)

