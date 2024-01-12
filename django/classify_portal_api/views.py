from rest_framework import generics
from rest_framework.views import APIView
from django_filters import rest_framework as flt
from listings.models import Listing, ListingLocation, ListingImage, MainCategory, ListingCategory
from rest_framework_simplejwt.tokens import AccessToken
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.permissions import BasePermission, SAFE_METHODS, IsAuthenticated
from classify_portal_api.serializers import ListingSerializerMainPage, UserListingOverview, ListingPostSerializer, ImageSerializer
from classify_portal_api.serializers import ListingSerializerDetails, LocationSerializer, MainCategorySerializer, MainCategorySerializerMain, CategorySerializer
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework_simplejwt.authentication import JWTAuthentication
from b2sdk.v1 import B2Api
from .pagination import SearchPagination
import environ
import json
from .filters import ListingFilter, CategoryFilter, MainCategoryFilter
from rest_framework.pagination import PageNumberPagination

env = environ.Env()
environ.Env.read_env()



# using the custom manager to return active listings only

class UpdateDeletePermission(BasePermission):
    message = "You are not the owner of this listing"
    def has_object_permission(self, request, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.owner == request.user


class ActiveListingViewSet(viewsets.ModelViewSet, UpdateDeletePermission):
    permission_classes = [UpdateDeletePermission]
    authentication_classes = []
    # filter_backends = [flt.DjangoFilterBackend]
    filterset_class = ListingFilter
    pagination_class = PageNumberPagination

    def list(self, request):
        print(request.user)
        filter_backends = flt.DjangoFilterBackend()
        queryset = Listing.active_listings.all()
        flt_queryset = filter_backends.filter_queryset(request, queryset, self)
        paginator = SearchPagination()
        result_page = paginator.paginate_queryset(flt_queryset, request)
        print("here ", flt_queryset.query)
        serializer = ListingSerializerMainPage(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def retrieve(self, request, pk): 
        try:
            listing = Listing.active_listings.all().get(pk=pk)
        except Listing.DoesNotExist:
            return Response({"detail": "Listing not found"}, status=404)
        print("request user", request.user)
        listing.inc_view_count()
        serializer = ListingSerializerDetails(listing)
        return Response(serializer.data)
    
    def partial_update(self, request, pk):
        print("request made by: ", request.user)
        try: 
            listing = Listing.active_listings.all().get(pk=pk)
        except Listing.DoesNotExist:
            return Response({"detail": "Listing not found"}, status=404)
        serializer = ListingPostSerializer(instance=listing, data=request.data, partial=True)
        if not self.has_object_permission(request=request, obj=listing):
            return Response({"detail": "You are not the owner of the listing. Permission denied"}, 
                            status=status.HTTP_401_UNAUTHORIZED)
        if serializer.is_valid():
            listing = serializer.save()
            data = {
                'id': listing.id,
                'message': 'Updated Successfully'
            }
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk):
        print(request.user.username)
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required"}, status=401)
        queryset = Listing.all_listings.all()
        try:
            listing = queryset.get(pk=pk)
            print(listing.owner)
        except Listing.DoesNotExist:
            return Response({"detail": "Listing not found"}, status=404)
        else:
            if self.has_object_permission(request=request, obj=listing):
                listing.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def create(self, request):
        print("req data", request)
        print(request)
        print("user: ", request.user)
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required"}, status=401)
        serializer = ListingPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['owner'] = request.user
            listing = serializer.save()
            data = {
                'id': listing.id,
                'message': 'Created Successfully'
            }
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get_permissions(self):
        if self.request.method in ('DELETE', 'PATCH', 'PUT') :
            return [UpdateDeletePermission()]
        return []
    
    def get_authenticators(self):
        if self.request.method in ('DELETE', 'POST', 'PATCH', 'PUT') :
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

class MainCategoriesDetailList(generics.ListAPIView):
    queryset = MainCategory.objects.all()
    serializer_class = MainCategorySerializer
    filter_backends = (flt.DjangoFilterBackend,)
    filterset_class = MainCategoryFilter
    authentication_classes = []

class LocationsList(generics.ListAPIView):
    queryset = ListingLocation.locations.all()
    serializer_class = LocationSerializer
    authentication_classes = []

class SubCategoriesList(generics.ListAPIView):
    queryset = ListingCategory.objects.all()
    serializer_class = CategorySerializer
    filter_backends = (flt.DjangoFilterBackend,)
    filterset_class = CategoryFilter
    authentication_classes = []

class UserListingsList(generics.ListCreateAPIView):
    serializer_class = UserListingOverview

    def get_queryset(self):
        return Listing.all_listings.filter(owner=self.kwargs.get('user_id'))

class AppendImageToListing(generics.CreateAPIView):
    queryset = ListingImage.objects.all()
    serializer_class = ImageSerializer

    # override the create method to append multiple images in a single HTTP Post request
    def create(self, request, *args, **kwags):
        image_list = request.data
        print(image_list)
        img_list = [json.loads(image_info) for image_info in image_list]
        for image_info in img_list:
            print(image_info)
            serializer = ImageSerializer(data=image_info)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response({'message': 'Serialization went wrong'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': "OK"}, status=status.HTTP_201_CREATED)
    
class RemoveImageFromListing(generics.DestroyAPIView):
    queryset = ListingImage.objects.all()
    serializer_class = ImageSerializer

    def destroy(self, request, pk):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required"}, status=401)
        try: 
            image = self.queryset.get(pk=pk)
            print("image", image)
        except ListingImage.DoesNotExist:
            return Response({"detail": "Image not found"}, status=404)
        else:
            if image.listing.owner.id == request.user.id:
                image.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(status=status.HTTP_401_UNAUTHORIZED)


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
        print("file: ", file_info.as_dict())
        download_urls.append(b2.get_download_url_for_fileid(file_info.as_dict()['fileId']))
        # Generate the download URL for the uploaded file

    return JsonResponse({'urls': download_urls}, status=status.HTTP_202_ACCEPTED)

