from rest_framework.test import APITestCase
from rest_framework import status
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from listings.models import Listing, ListingCategory, ListingLocation, MainCategory
from django.db import transaction
from django.core.management import call_command
import logging
import json


# test if we can make a new listing through the API
class BaseAPITestCase(APITestCase):
    @classmethod
    def setUpTestData(self):
       call_command('seeds')
    page_size = 9
       
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
        listing_id = Listing.active_listings.first().id
        url = reverse("classify_portal_api:listing_report")
        res = self.client.post(url, data={"listing": listing_id}, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

class UserDataEndpointTest(BaseAPITestCase):
    # No Auth required for basic view
    def test_user_basic_info(self):
        user_id = User.objects.filter(username="user_1").first().id
        url = reverse("classify_portal_api:user_basic_info", args=[user_id])
        res = self.client.get(url, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # Check the received response for the needed keys
        user_properties_keys = ["first_name", "last_name", "id"]
        self.assertEqual(len(res.data.keys()), 3)
        for key in res.data.keys():
            self.assertIn(key, user_properties_keys)

class ListingsFullAccessTest(BaseAPITestCase):
    def test_listings_all(self):
        # No Auth, 401
        user_id = User.objects.filter(username="user_2").first().id
        user_draft_listing = Listing.draft_listings.filter(owner_id=user_id).first()
        url = reverse("classify_portal_api:all_listings_get_one", args=[user_draft_listing.id])
        res = self.client.get(url, format="json")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        # Auth but not owner-> 403
        token_url = reverse("classify_portal_api:token_obtain_pair")
        access_token = self.client.post(token_url, {"username": "user_1", "password": "fhi5$sds4.rt"}, format='json').data['access']
        headers = {"Authorization" : f"Bearer {access_token}"}
        res = self.client.get(url, format="json", headers=headers)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        # Auth + owner -> 200
        token_url = reverse("classify_portal_api:token_obtain_pair")
        access_token = self.client.post(token_url, {"username": "user_2", "password": "awhi9$jd39%jhef"}, format='json').data['access']
        headers = {"Authorization" : f"Bearer {access_token}"}
        res = self.client.get(url, format="json", headers=headers)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

class ListingsViewsetEndpoints(BaseAPITestCase):
    def test_get_listings_main(self):
        res = self.client.get("/api/listings/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertLessEqual(res.data["count"], self.page_size)

    def test_get_single_listing(self):
        # existing listing
        listing_1 = Listing.active_listings.first()
        res = self.client.get(f"/api/listings/{listing_1.id}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # non-existing listing
        res_no_listing = self.client.get("/api/listings/70000/") # id that doesnt exist
        self.assertEqual(res_no_listing.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_single_listing(self):
        user_1 = User.objects.filter(username="user_1").first()
        listing_1 = Listing.active_listings.filter(owner_id=user_1.id).first()
        orig_price = listing_1.price
        new_price = orig_price - 1500

        # No auth
        res = self.client.patch(f"/api/listings/{listing_1.id}/", data={"price": new_price}, format="json")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        # Auth but not owner
        token_url = reverse("classify_portal_api:token_obtain_pair")
        access_token = self.client.post(token_url, {"username": "user_2", "password": "awhi9$jd39%jhef"}, format='json').data['access']
        headers = {"Authorization" : f"Bearer {access_token}"}
        res_not_owner = self.client.patch(f"/api/listings/{listing_1.id}/", data={"price": new_price}, format="json", headers=headers)
        self.assertEqual(res_not_owner.status_code, status.HTTP_403_FORBIDDEN)

        # Auth + owner
        token_url = reverse("classify_portal_api:token_obtain_pair")
        access_token = self.client.post(token_url, {"username": "user_1", "password": "fhi5$sds4.rt"}, format='json').data['access']
        headers_owner = {"Authorization" : f"Bearer {access_token}"}
        res_owner = self.client.patch(f"/api/listings/{listing_1.id}/", data={"price": new_price}, format="json", headers=headers_owner)
        self.assertEqual(res_owner.status_code, status.HTTP_200_OK)
        self.assertEqual(res_owner.data, {"id": listing_1.id, "message": "Updated Successfully"})

    def test_delete_single_listing(self):
        user_1 = User.objects.filter(username="user_1").first()
        listing_1 = Listing.active_listings.filter(owner_id=user_1.id).first()

        # No auth
        res = self.client.delete(f"/api/listings/{listing_1.id}/", format="json")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        # Auth but not owner
        token_url = reverse("classify_portal_api:token_obtain_pair")
        access_token = self.client.post(token_url, {"username": "user_2", "password": "awhi9$jd39%jhef"}, format='json').data['access']
        headers = {"Authorization" : f"Bearer {access_token}"}
        res_not_owner = self.client.delete(f"/api/listings/{listing_1.id}/", format="json", headers=headers)
        print("status not owner: ", res_not_owner.status_code)
        self.assertEqual(res_not_owner.status_code, status.HTTP_403_FORBIDDEN)

        # Auth + owner
        token_url = reverse("classify_portal_api:token_obtain_pair")
        access_token = self.client.post(token_url, {"username": "user_1", "password": "fhi5$sds4.rt"}, format='json').data['access']
        headers_owner = {"Authorization" : f"Bearer {access_token}"}
        res_owner = self.client.delete(f"/api/listings/{listing_1.id}/", format="json", headers=headers_owner)
        self.assertEqual(res_owner.status_code, status.HTTP_204_NO_CONTENT)

    def test_create_listing(self):
        # get auth tokens
        token_url = reverse("classify_portal_api:token_obtain_pair")
        access_token = self.client.post(token_url, {"username": "user_2", "password": "awhi9$jd39%jhef"}, format='json').data['access']
        headers = {"Authorization" : f"Bearer {access_token}"}
        category = ListingCategory.objects.filter(name="Houses").first().id
        location = ListingLocation.locations.first().id
        # data to create the listing
        listing_params = {
            "name": "House for sale", 
            "description": "Beautiful House in calm location, away from the main road. Pool and garden.", 
            "category": category, 
            "price": 1500000, 
            "location": location, 
            "is_active": "active", 
            "cat_text_prop_1": "Heat Pump", 
            # "cat_text_prop_2", 
            "cat_num_prop_3": 350, 
            "cat_num_prop_4": 6
        }
        new_id = Listing.all_listings.first().id + 1
        res = self.client.post("/api/listings/", data=listing_params, format="json", headers=headers)
        self.assertTrue(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(new_id, Listing.all_listings.first().id)
        self.assertEqual(res.data['message'], 'Created Successfully')
        self.assertEqual(res.data["id"], new_id)

