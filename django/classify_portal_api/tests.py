from rest_framework.test import APITestCase
from rest_framework import status
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from listings.models import Listing, ListingCategory, ListingLocation
from django.db import transaction

# test if we can make a new listing through the API
class BaseAPITestCase(APITestCase):
    def setUp(self):
        user = User.objects.create_user(
        username="user_1",
        password="awhi9$jd39%jhef"
        )
        category = ListingCategory.objects.create(name="Boats")
        full_location = ListingLocation.locations.create(
            district = "Wola",
            city = "Warszawa",
            state = "Mazowieckie"
        )
        location = ListingLocation.locations.create(
            city="Warszawa",
            state="Mazowieckie",
        )
        listing = Listing.all_listings.create(
            name="Superboat JA2LK",
            category_id=category.id,
            description="2 years old, needs some maintenance",
            is_active = "active",
            price=220000,
            location_id=location.id,
            owner_id=user.id
        )
        draft_listing = Listing.all_listings.create(
            name="Superboat JA2LK",
            category_id=category.id,
            description="2 years old, needs some maintenance",
            is_active = "active",
            price=220000,
            location_id=location.id,
            owner_id=user.id
        )

class ListingEndpointTest(BaseAPITestCase):
    def test_get_all_listings(self):
        url = reverse('classify_portal_api:listings_index')
        response = self.client.get(url, format='json')
        print(response.content.decode())
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.ass

    def test_get_single_listing(self):
        url = reverse('classify_portal_api:show_listing', args=[1])
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.asser
class LocationEndpointTest(BaseAPITestCase):
    def test_get_locations(self):
        url = reverse("classify_portal_api:locations_list")
        res = self.client.get(url, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertHTMLEqual()


class CategoryEndpointTest(BaseAPITestCase):
    def test_post_category(self):
        url = reverse("classify_portal_api:locations_list")
        location = {
            "city" : "Poznań",
            "state" : "Wielkopolskie"
        }
        res = self.client.post(url, location, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)




