from rest_framework import serializers
from listings.models import Listing, ListingLocation, ListingImage, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username']

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingLocation
        fields = ['district', 'city', 'state', 'country']

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ['is_main', 'listing', 'url']

class ListingSerializerMainPage(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    location = LocationSerializer()
    class Meta:
        model = Listing
        fields = ['id', 'name', 'description', 'category', 'price', 'location', 'owner', 'is_active', 'images']

    def to_representation(self, instance): 
        main_images = ListingImage.main_image.filter(listing=instance, is_main=True)
        images_serializer = ImageSerializer(main_images, many=True)
        instance_data = super().to_representation(instance)
        instance_data['images'] = images_serializer.data
        return instance_data
    

class ListingSerializerDetails(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    location = LocationSerializer()
    owner = UserSerializer()

    class Meta:
        model = Listing
        fields = ['id', 'name', 'description', 'category', 'price', 'location', 'owner', 'is_active', 'images']

class UserListingOverview(ListingSerializerMainPage):
    class Meta:
        class Meta:
            model = Listing
            fields = ['id', 'name', 'description', 'category', 'price', 'location', 'owner', 'is_active', 'view_count', 'images']