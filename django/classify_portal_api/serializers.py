from rest_framework import serializers
from listings.models import Listing, ListingLocation, ListingImage, User, MainCategory, ListingCategory, Report

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username']

class MainCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MainCategory
        fields = ['id', 'name', 'prop1_name', 'prop2_name', 'prop3_name', 'prop4_name']

class MainCategorySerializerMain(MainCategorySerializer):
    class Meta(MainCategorySerializer.Meta):
        fields = ['name', 'id', 'icon']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingCategory
        fields = ['id', 'name', 'main']
        depth = 2

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingLocation
        fields = ['id', 'district', 'city', 'state', 'country']

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ['is_main', 'listing', 'url', 'id']

class ListingSerializerMainPage(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    location = LocationSerializer()
    class Meta:
        model = Listing
        fields = ['id', 'name', 'description', 'category', 'price', 'location', 'owner', 'is_active', 'images',
                  'cat_text_prop_1', 'cat_text_prop_2', 'cat_num_prop_3', 'cat_num_prop_4']

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
    category = CategorySerializer()

    def to_representation(self, instance):
        main_cat_serializer = MainCategorySerializer(instance.category.main)
        instance_data = super().to_representation(instance)
        instance_data['main_category'] = main_cat_serializer.data
        return instance_data 
    
    class Meta:
        model = Listing
        fields = ['id', 'name', 'description', 'category', 'price', 'owner', 'location', 'is_active', 'images', 
                  'cat_text_prop_1', 'cat_text_prop_2', 'cat_num_prop_3', 'cat_num_prop_4']

    
class ListingPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ['name', 'description', 'category', 'price', 'location', 'is_active', 'cat_text_prop_1', 'cat_text_prop_2', 'cat_num_prop_3', 'cat_num_prop_4']

class UserListingOverview(ListingSerializerMainPage):
    class Meta:
        model = Listing
        fields = ['id', 'name', 'description', 'category', 'price', 'location', 'owner', 'is_active', 'view_count', 'images']

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['listing']

class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'id']