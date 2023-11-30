from django.db import models
from django.contrib.auth.models import User
from django.db.models.query import QuerySet #Django default user model
from django.utils import timezone


class MainCategory(models.Model):
    name = models.CharField(max_length=30, unique=True)
    def __str__(self):
        return self.name
    prop1_name = models.CharField(max_length=30, blank=True)
    prop2_name = models.CharField(max_length=30, blank=True)
    prop3_name = models.CharField(max_length=30, blank=True)
    prop4_name = models.CharField(max_length=30, blank=True)
    icon = models.CharField(max_length=200, default="SETDEFAULTIMGURL.COM")
    class Meta:
        verbose_name_plural = "main categories"

class ListingCategory(models.Model):
    name = models.CharField(max_length=30, unique=True)
    main = models.ForeignKey(MainCategory, on_delete=models.PROTECT)
    def __str__(self):
        return f'{self.main}-{self.name}'
    
    class Meta:
        verbose_name_plural = "listing categories"

class ListingLocation(models.Model):
    district = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    country = models.CharField(max_length=50, default="Poland")

    def __str__(self):
        if self.district:
            return "{}, {}, {}, {}".format(
                self.district, self.city, self.state, self.country
            )
        return "{}, {}, {}".format(
            self.city, self.state, self.country
        )
    
    locations = models.Manager()

    class Meta:
        verbose_name_plural = "listing locations"
    

class Listing(models.Model):
    class ActiveListings(models.Manager):
        def get_queryset(self) -> QuerySet:
            print(super().get_queryset())
            return super().get_queryset() .filter(is_active='active')
        
    class DraftListings(models.Manager):
        def get_queryset(self) -> QuerySet:
            return super().get_queryset() .filter(is_active='draft')
        
    def images(self):
        return ListingImage.objects.filter(listing=self)
    
    def inc_view_count(self):
        self.view_count +=1
        self.save()
        return True


    name = models.CharField(max_length=50)
    category = models.ForeignKey(ListingCategory, on_delete=models.PROTECT)
    description = models.TextField()
    IS_ACTIVE_CHOICES = [
        ('active', 'Active'),
        ('draft', 'Draft')
    ]
    is_active = models.CharField(max_length=6, choices=IS_ACTIVE_CHOICES)
    creation = models.DateTimeField(default=timezone.now)
    price = models.IntegerField()
    location = models.ForeignKey(ListingLocation, on_delete=models.RESTRICT)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="listings"
    )
    view_count = models.PositiveIntegerField(default=0)
    all_listings = models.Manager()
    active_listings = ActiveListings()
    draft_listings = DraftListings()
    
    cat_spec_properties = models.JSONField(default=dict)


    class Meta:
        ordering = ['-creation']
    def __str__(self):
        return f"{self.category}/{self.name}"
    
class ListingImage(models.Model):
    class MainImage(models.Manager):
        def get_queryset(self) -> QuerySet:
            return super().get_queryset() .filter(is_main=True)
    is_main = models.BooleanField(default=False)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    url = models.CharField(max_length=200, default="SETDEFAULTIMGURL.COM")
    objects = models.Manager()
    main_image = MainImage()