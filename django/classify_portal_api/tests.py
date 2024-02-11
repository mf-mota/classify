from rest_framework.test import APITestCase
from rest_framework import status
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from listings.models import Listing, ListingCategory, ListingLocation, MainCategory
from django.db import transaction
from django.core.management import call_command
import json

# # test if we can make a new listing through the API
class BaseAPITestCase(APITestCase):
    @classmethod
    def setUpTestData(self):
       call_command('seeds')


# class ListingEndpointTest(BaseAPITestCase):
#     def test_get_all_listings(self):
#         url = reverse('classify_portal_api:listings_index')
#         response = self.client.get(url, format='json')
#         print(response.content.decode())
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.ass

#     def test_get_single_listing(self):
#         url = reverse('classify_portal_api:show_listing', args=[1])
#         response = self.client.get(url, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.asser
       
class LocationEndpointTest(BaseAPITestCase):
    def test_get_locations(self):
        url = reverse("classify_portal_api:locations_list")
        res = self.client.get(url, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 4)

class MainCategoryEndpointsTest(BaseAPITestCase):
    def test_post_main_category(self):
        url = reverse("classify_portal_api:main_categories_list")
        res = self.client.get(url, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 3)

    def test_post_main_category_details(self):
        props = ["id", "name", "prop1_name", "prop2_name", "prop3_name", "prop4_name"]
        url = reverse("classify_portal_api:main_categories_details_list")
        vehicles_id = MainCategory.objects.filter(name="Vehicles").first().id
        res = self.client.get(f"{url}?id={vehicles_id}", format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Check if the response has the expected keys
        for key in res.data[0].keys():
            self.assertTrue(key in props)

class SubCategoryEndpointTest(BaseAPITestCase):
    def test_post_category(self):
        url = reverse("classify_portal_api:subcategories_list")
        res = self.client.get(url, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 3)

        # with main category filter
        main_cat_id = MainCategory.objects.filter(name="Vehicles").first().id
        res = self.client.get(f"{url}?main_cat={main_cat_id}")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)


class JwtTokensTest(BaseAPITestCase):
    def test_base_endpoint(self):
        token_url = reverse("classify_portal_api:token_obtain_pair")
        res = self.client.post(token_url, {"username": "user_1", "password": "fhi5$sds4.rt"}, format='json').data
        self.assertIn("access", res.keys())
        self.assertIn("refresh", res.keys())

    def test_refresh_endpoint(self):
        # Get the refresh token
        both_token_url = reverse("classify_portal_api:token_obtain_pair")
        refresh = self.client.post(both_token_url, {"username": "user_1", "password": "fhi5$sds4.rt"}, format='json').data['refresh']

        # Get a new access token with the refresh token
        refresh_url = reverse("classify_portal_api:token_refresh")
        res = self.client.post(refresh_url, {"refresh": refresh})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertIn("access", res.data.keys())

    def test_token_validation(self):
        # Get the access token
        both_token_url = reverse("classify_portal_api:token_obtain_pair")
        access = self.client.post(both_token_url, {"username": "user_1", "password": "fhi5$sds4.rt"}, format='json').data['access']

        # Check its validaty
        validate_url = reverse("classify_portal_api:validate_token")
        res_valid = self.client.post(validate_url, {"token": access})
        self.assertEqual(res_valid.status_code, status.HTTP_200_OK)
        
        res_invalid = self.client.post(validate_url, {"token": 12345})
        self.assertEqual(res_invalid.status_code, status.HTTP_401_UNAUTHORIZED)


class UserListingsTest(BaseAPITestCase):
    # Protected Endpoint, access restricted to owner
    def test_no_auth_user_listings(self):
        user_1 = User.objects.filter(username="user_1").first()
        url = reverse("classify_portal_api:users_listings", args=[user_1.id])
        res = self.client.get(url, format='json')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_valid_auth_user_listings(self):
        # get token
        token_url = reverse("classify_portal_api:token_obtain_pair")
        access_token = self.client.post(token_url, {"username": "user_1", "password": "fhi5$sds4.rt"}, format='json').data['access']
        headers = {"Authorization" : f"Bearer {access_token}"}

        user_1 = User.objects.filter(username="user_1").first()
        url = reverse("classify_portal_api:users_listings", args=[user_1.id])
        res = self.client.get(url, format='json', headers=headers)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 3) # The user has 3 listings


class ListingImagesTest(BaseAPITestCase):
    def test_auth_no_auth_remove_image(self):
        image_id = Listing.all_listings.filter(name="BMW 520d").first().images().first().id
        url_add = reverse("classify_portal_api:remove_image", args=[image_id])
        res = self.client.delete(url_add, format='json')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        # with auth 
        token_url = reverse("classify_portal_api:token_obtain_pair")
        access_token = self.client.post(token_url, {"username": "user_1", "password": "fhi5$sds4.rt"}, format='json').data['access']
        headers = {"Authorization" : f"Bearer {access_token}"}

        res = self.client.delete(url_add, format='json', headers=headers)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertNotIn(image_id, [image.id for image in Listing.all_listings.filter(name="BMW 520d").first().images()])

class ReportTest(BaseAPITestCase):
    # does not require auth
    def test_report_a_listing(self):
        pass