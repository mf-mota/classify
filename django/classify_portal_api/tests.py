from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from listings.models import Listing, ListingCategory, ListingLocation
from django.db import transaction

# test if we can make a new listing through the API
class BaseAPITestCase(APITestCase):
    def make_test_location(self):
         return ListingLocation.locations.create(
            city="Warszawa",
            state="Mazowieckie",
        )
    
    def make_test_user(self):
        return User.objects.create(
            username="user_test",
            password="1223sfesef",
        )
    
    def make_test_category(self):
        return ListingCategory.objects.create(name="Boats")
    
    def make_test_listing(self):
        return Listing.all_listings.create(
            name="Superboat JA2LK",
            category_id=self.make_test_category().id,
            description="2 years old, needs some maintenance",
            is_active = "active",
            price=220000,
            location_id=self.make_test_location().id,
            owner_id=self.make_test_user().id
        )
    

class ListingEndpointTest(BaseAPITestCase):
    def test_get_all_listings(self):
        with transaction.atomic():
            self.make_test_listing()
            url = reverse('classify_portal_api:listings_index')
            response = self.client.get(url, format='json')
            print(response.content.decode())
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_single_listing(self):
        with transaction.atomic():
            self.make_test_listing()
            url = reverse('classify_portal_api:show_listing', args=[1])
            response = self.client.get(url, format='json')
            print("response: ", response)
            print("status code", response.status_code)
            self.assertEqual(response.status_code, status.HTTP_200_OK)


class CategoryEndpointTest(BaseAPITestCase):
    def test_get_category(self):
        with transaction.atomic():
            location = self.make_test_location()
            url = reverse("classify_portal_api:locations_list")
            res = self.client.get(url, format='json')
            self.assertEqual(res.status_code, status.HTTP_200_OK)


    def test_post_category(self):
        with transaction.atomic():
            url = reverse("classify_portal_api:locations_list")
            location = {
                "city" : "Poznań",
                "state" : "Wielkopolskie"
            }
            res = self.client.post(url, location, format='json')
            self.assertEqual(res.status_code, status.HTTP_201_CREATED)



