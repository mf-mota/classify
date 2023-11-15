from django.test import TestCase
from django.contrib.auth.models import User
from listings.models import Listing, ListingCategory, ListingLocation


class ListingsTests(TestCase):
    @classmethod
    def setUpTestData(cls):
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
            category_id=1,
            description="2 years old, needs some maintenance",
            is_active = "active",
            price=220000,
            location_id=2,
            owner_id=1
        )
        draft_listing = Listing.all_listings.create(
            name="Superboat JA2LK",
            category_id=1,
            description="2 years old, needs some maintenance",
            is_active = "draft",
            price=220000,
            location_id=1,
            owner_id=1
        )

    def test_listing_short_location(self):
        listing = Listing.all_listings.get(id=1)
        category = ListingCategory.objects.get(id=1)
        location = ListingLocation.locations.get(id=2)

        name = str(listing.name)
        description = str(listing.description)
        is_active = str(listing.is_active)
        price = int(listing.price)
        owner = str(listing.owner)

        self.assertEqual(name, "Superboat JA2LK")
        self.assertEqual(description, "2 years old, needs some maintenance")
        self.assertEqual(is_active, "active")
        self.assertEqual(price, 220000)
        self.assertEqual(owner, "user_1")

        #dunders
        self.assertEqual(str(listing), f"{category}/Superboat JA2LK")
        self.assertEqual(str(category), "Boats")
        self.assertEqual(str(location), "Warszawa, Mazowieckie, Poland")

    def test_full_location(self):
        location = ListingLocation.locations.get(id=1)
        self.assertEqual(str(location), "Wola, Warszawa, Mazowieckie, Poland")

    def test_draft_listing(self):
        draft_listing = Listing.draft_listings.first()
        name = str(draft_listing.name)
        description = str(draft_listing.description)
        is_active = str(draft_listing.is_active)
        price = int(draft_listing.price)
        owner = str(draft_listing.owner)
        self.assertEqual(name, "Superboat JA2LK")
        self.assertEqual(description, "2 years old, needs some maintenance")
        self.assertEqual(is_active, "draft")
        self.assertEqual(price, 220000)
        self.assertEqual(owner, "user_1")

    