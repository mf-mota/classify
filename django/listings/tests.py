from django.test import TestCase
from django.contrib.auth.models import User
from listings.models import Listing, ListingCategory, ListingLocation, MainCategory, Report, ListingImage
from django.core.management import call_command
from datetime import datetime

class ListingsTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command('seeds')
        Report.objects.create(listing_id=Listing.active_listings.filter(name="BMW 520d").first().id)

    def test_listing_location(self):
        location_1 = ListingLocation.locations.filter(district="Prądnik Biały").first()
        full_location_str = str(location_1)
        location_2 = ListingLocation.locations.filter(city="Łask").first()
        no_district_location = str(location_2)

        self.assertEqual(full_location_str, "Prądnik Biały, Kraków, Małopolskie, Poland")
        self.assertEqual(no_district_location, "Łask, Łódzkie, Poland")

    def test_main_category(self):
        vehicles_main = MainCategory.objects.filter(name="Vehicles").first()

        self.assertEqual(vehicles_main.name, "Vehicles")
        self.assertEqual(vehicles_main.prop1_name, "Engine")
        self.assertEqual(vehicles_main.prop2_name, "Fuel")
        self.assertEqual(vehicles_main.prop3_name, "Year")
        self.assertEqual(vehicles_main.prop4_name, "Mileage")
        self.assertIsNotNone(vehicles_main.icon)
        self.assertEqual(str(vehicles_main), f"{vehicles_main.id}-Vehicles")

    def test_user(self):
        user = User.objects.filter(username="user_1").first()

        self.assertEqual(user.username, "user_1")
        self.assertEqual(user.first_name, "John")
        self.assertEqual(user.last_name, "Doe")
        self.assertNotEqual(user.password, "fhi5$sds4.rt") # password in db should be encrypted

    def test_listing(self):
        active_listing = Listing.active_listings.filter(name="BMW 520d").first()
        draft_listing = Listing.draft_listings.first() # seeds only have 1 draft listing

        # Name
        self.assertEqual(active_listing.name, "BMW 520d")
        self.assertEqual(draft_listing.name, "VW Polo")

        # Category
        self.assertEqual(active_listing.category_id, ListingCategory.objects.filter(name="Cars").first().id)
        self.assertEqual(draft_listing.category_id, ListingCategory.objects.filter(name="Cars").first().id)

        # description
        self.assertEqual(active_listing.description, "Great condition, beautiful color. Just had it serviced at the dealership")
        self.assertEqual(draft_listing.description, "The car has 270.000 km, but it's mostly motorway miles. The car was detailed two months ago. New brake pads and rotors.")

        # Status
        self.assertEqual(active_listing.is_active, "active")
        self.assertEqual(draft_listing.is_active, "draft")

        # Price
        self.assertEqual(active_listing.price, 220000)
        self.assertEqual(draft_listing.price, 40000)

        # Location
        self.assertEqual(active_listing.location_id, ListingLocation.locations.filter(district="Wola").first().id)
        self.assertEqual(draft_listing.location_id, ListingLocation.locations.filter(district="Prądnik Biały").first().id)

        # Owner
        self.assertEqual(active_listing.owner_id, User.objects.filter(username="user_1").first().id)
        self.assertEqual(draft_listing.owner_id, User.objects.filter(username="user_2").first().id)

        # Props
        self.assertEqual(active_listing.cat_text_prop_1, "20d")
        self.assertEqual(draft_listing.cat_text_prop_1, "1.6")
        self.assertEqual(active_listing.cat_text_prop_2, "Diesel")
        self.assertEqual(draft_listing.cat_text_prop_2, "Diesel")
        self.assertEqual(active_listing.cat_num_prop_3, 2019)
        self.assertEqual(draft_listing.cat_num_prop_3, 2015)
        self.assertEqual(active_listing.cat_num_prop_4, 75000)
        self.assertEqual(draft_listing.cat_num_prop_4, 125000)

        # string representation
        self.assertEqual(str(active_listing), f"{ListingCategory.objects.filter(name="Cars").first().id}-Vehicles-Cars/BMW 520d")
        self.assertEqual(str(draft_listing), f"{ListingCategory.objects.filter(name="Cars").first().id}-Vehicles-Cars/VW Polo")

        # view count incrementation
        self.assertEqual(active_listing.view_count, 34)
        active_listing.inc_view_count()
        self.assertEqual(active_listing.view_count, 35)

        self.assertEqual(draft_listing.view_count, 0)
        draft_listing.inc_view_count()
        self.assertEqual(draft_listing.view_count, 1)

        # image retrieval 
        ass_active_images = active_listing.images()
        test_image_queryset_active = ListingImage.objects.filter(listing_id=Listing.active_listings.filter(name="BMW 520d").first().id)
        for image in ass_active_images:
            self.assertTrue(image in test_image_queryset_active)

        ass_draft_imaes = draft_listing.images()
        test_image_queryset_draft = ListingImage.objects.filter(listing_id=Listing.draft_listings.filter(name="VW Polo").first().id)
        for image in ass_draft_imaes:
            self.assertTrue(image in test_image_queryset_draft)
    

    def test_report(self):
        report_1 = Report.objects.first() # Seeds do not have reported listings

        self.assertEqual(report_1.listing_id, Listing.active_listings.filter(name="BMW 520d").first().id) 

        # Remove timezone and check whether report creation < current time
        self.assertGreater(datetime.now(), report_1.time.replace(tzinfo=None))

        # String representation
        self.assertEqual(str(report_1), f"Listing: {Listing.active_listings.filter(name="BMW 520d").first().id} @{report_1.time}")

    def test_listing_images(self):
        images = ListingImage.objects.filter(listing_id=Listing.active_listings.filter(name="BMW 520d").first().id)

        # Two images were added to the listing in the seeds
        self.assertEqual(len(images), 2)

        self.assertTrue(True in [image.is_main for image in images])
        self.assertTrue(False in [image.is_main for image in images])

        self.assertEqual([image.url for image in images if image.is_main][0], 
                         "https://f005.backblazeb2.com/file/cars-dealers/bmw-5-series-touring-gallery-image-design-05_890.jpg")
        self.assertEqual([image.url for image in images if not image.is_main][0], 
                         "https://f005.backblazeb2.com/file/cars-dealers/pobierz+(1).jpeg")
        
        self.assertEqual(len(ListingImage.main_image.filter(listing_id=Listing.active_listings.filter(name="BMW 520d").first().id)), 1)