from django.db import models
from django.contrib.auth.models import User
from django.db.models.query import QuerySet #Django default user model
from django.utils import timezone

class ListingCategory(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name
    
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
        return "{} {}, {}".format(
            self.city, self.state, self.country
        )
    
    locations = models.Manager()

    class Meta:
        verbose_name_plural = "listing locations"
    

class Listing(models.Model):
    class ActiveListings(models.Manager):
        def get_queryset(self) -> QuerySet:
            return super().get_queryset() .filter(is_active='active')
        
    class DraftListings(models.Manager):
        def get_queryset(self) -> QuerySet:
            return super().get_queryset() .filter(is_active='draft')
        
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
    all_listings = models.Manager()
    active_listings = ActiveListings()
    draft_listings = DraftListings()

    class Meta:
        ordering = ['-creation']
    def __str__(self):
        return f"{self.category}/{self.name}"
    

class ListingImage(models.Model):
    is_main = models.BooleanField(default=False)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    url = models.CharField(max_length=200, default="SETDEFAULTIMGURL.COM")
