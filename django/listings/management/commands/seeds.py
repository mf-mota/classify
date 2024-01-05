from django.core.management.base import BaseCommand
import listings.models as models
from django.db import transaction


class Command(BaseCommand):
    help = 'Seed the database to get started'
    @transaction.atomic
    def handle(self, *args, **options):
        try:
            self.stdout.write(self.style.SUCCESS('Starting to seed db...\n'))
            self.stdout.write('1) Creating Users...')
            user_1 = models.User.objects.create_user(
                username="user_1",
                first_name = "John",
                last_name="Doe",
                password="fhi5$sds4.rt"
            )
            user_1.save()
            user_2 = models.User.objects.create_user(
                username="user_2",
                first_name = "Piotr",
                last_name="Kowalski",
                password="awhi9$jd39%jhef"
            )
            user_2.save()

            #main categories
            self.stdout.write('2) Creating Main Categories...')
            main_cat_vehicles = models.MainCategory(
                name="Vehicles",
                prop1_name="Engine",
                prop2_name="Fuel",
                prop3_name="Year",
                prop4_name="Mileage",
                icon="https://f005.backblazeb2.com/file/cars-dealers/Default+Icons/vehiclesIcon.png"
            )
            main_cat_vehicles.save()
            main_cat_properties = models.MainCategory(
                name="Properties",
                prop1_name="Heating Type",
                prop3_name="Area",
                prop4_name="Rooms",
                icon="https://cars-dealers.s3.us-east-005.backblazeb2.com/Default+Icons/PropertyIcon.png"
            )
            main_cat_properties.save()

            main_cat_pets = models.MainCategory(
                name="Pets",
                prop1_name="Breed/ Type",
                icon="https://cars-dealers.s3.us-east-005.backblazeb2.com/Default+Icons/animalsIcon.png"
            )
            main_cat_pets.save()
            #listing categories
            self.stdout.write('3) Creating Sub Categories...')

            cat_cars = models.ListingCategory.objects.create(name="Cars", 
                                                             main_id=main_cat_vehicles.id)
            cat_cars.save()
            cat_houses = models.ListingCategory.objects.create(name="Houses", 
                                                               main_id=main_cat_properties.id)                                         
            cat_houses.save()
            cat_dogs = models.ListingCategory.objects.create(name="Dogs",
                                                             main_id = main_cat_pets.id)
            cat_dogs.save()
            #locations
            self.stdout.write('4) Creating Locations...')

            full_location_1 = models.ListingLocation.locations.create(
                district = "Wola",
                city = "Warszawa",
                state = "Mazowieckie"
            )
            full_location_1.save()
            full_location_2 = models.ListingLocation.locations.create(
                district = "Prądnik Biały",
                city = "Kraków",
                state = "Małopolskie"
            )
            full_location_2.save()

            full_location_3 = models.ListingLocation.locations.create(
                district = "Górna",
                city = "Łódź",
                state = "Łódzkie"
            )
            full_location_3.save()
            short_location_1 = models.ListingLocation.locations.create(
                city="Łask",
                state="Łódzkie",
            )
            short_location_1.save()
            #listings
            self.stdout.write('5) Generating Listings...')
            active_listing_1 = models.Listing.all_listings.create(
                name="BMW 520d",
                category_id=cat_cars.id,
                description="Great condition, beautiful color. Just had it serviced at the dealership",
                is_active = "active",
                price=220000,
                location_id=full_location_1.id,
                owner_id=user_1.id,
                view_count=34,
                cat_text_prop_1="20d",
                cat_text_prop_2="Diesel",
                cat_num_prop_3=2019,
                cat_num_prop_4=75000,
                # cat_spec_properties={
                #     "Engine": "1995",
                #     "Fuel": "Diesel",
                #     "Year": 2019,
                #     "Mileage": 75000,
                # }
            )
            active_listing_1.save()

            active_listing_2 = models.Listing.all_listings.create(
                name="3-bed house",
                category_id=cat_houses.id,
                description="Newly renovated, 3 bedrooms, 2 bath. Small garden with palms.",
                is_active = "active",
                price=900000,
                location_id=full_location_3.id,
                owner_id=user_1.id,
                view_count=10,
                cat_text_prop_1="Heat Pump",
                cat_num_prop_3=160,
                cat_num_prop_4=4,
                # cat_spec_properties = {
                #     "Heating Type": "Heat Pump",
                #     "Area": 160,
                #     "Rooms": 4,
                # }
            )
            active_listing_2.save()

            active_listing_3 = models.Listing.all_listings.create(
                name="4-bed detached house",
                category_id=cat_houses.id,
                description="The house was built in the 80s, requires some renovation. The price is negotiable.",
                is_active = "active",
                price=700000,
                location_id=short_location_1.id,
                owner_id=user_1.id,
                view_count=10,
                cat_text_prop_1="None",
                cat_num_prop_3=120,
                cat_num_prop_4=5,
                # cat_spec_properties = {
                #     "Heating Type": "No heating",
                #     "Area": 120,
                #     "Rooms": 5,
                # }
            )
            active_listing_3.save()

            draft_listing_1 = models.Listing.all_listings.create(
                name="VW Polo",
                category_id=cat_cars.id,
                description="The car has 270.000 km, but it's mostly motorway miles. The car was detailed two months ago. New brake pads and rotors.",
                is_active = "draft",
                price=40000,
                location_id=full_location_2.id,
                owner_id=user_2.id,
                cat_text_prop_1="1.6",
                cat_text_prop_2="Diesel",
                cat_num_prop_3=2015,
                cat_num_prop_4=125000,
                # cat_spec_properties={
                #     "Engine": "1568",
                #     "Fuel": "Petrol",
                #     "Year": 2015,
                #     "Mileage": 125000,
                # }
            )
            draft_listing_1.save()

            #images 
            #active_listing_1
            self.stdout.write('6) Adding Images to the listings...')
            models.ListingImage.objects.create(is_main=True, 
                                            url="https://f005.backblazeb2.com/file/cars-dealers/bmw-5-series-touring-gallery-image-design-05_890.jpg", 
                                            listing_id=active_listing_1.id).save()
            models.ListingImage.objects.create(url="https://f005.backblazeb2.com/file/cars-dealers/pobierz+(1).jpeg", 
                                            listing_id=active_listing_1.id).save()
            models.ListingImage.objects.create(is_main=True, 
                                            url="https://f005.backblazeb2.com/file/cars-dealers/069012_r0_940.jpg", 
                                            listing_id=active_listing_2.id).save()
            models.ListingImage.objects.create(is_main=True, 
                                            url="https://f005.backblazeb2.com/file/cars-dealers/069012_r0_940.jpg", 
                                            listing_id=active_listing_3.id).save()

        except Exception as error:
            self.stderr.write(self.style.ERROR(f'\nError seeding the db: {error}'))
        
        else:
            self.stdout.write(self.style.SUCCESS('\nSeeding successfully completed!'))