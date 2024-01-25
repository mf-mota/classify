from django.core.mail import send_mail
from django.conf import settings
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from listings.models import Listing
from django.template.loader import render_to_string 
from django.template.loader import get_template
from django.template import Context




class Command(BaseCommand):
    help = 'Send newsletters. Ids are required'
    users = User.objects.all()
    email_list = [user.email for user in users]
    template = get_template(template_name="classify_portal/newsletter.html")

    def add_arguments(self, parser):
        parser.add_argument("ids", nargs="+", type=int)

    def handle(self, *args, **options):
        try:
            ids = options['ids']
            sql_query = "SELECT * FROM listings_listing \
            INNER JOIN listings_listingimage ON listings_listing.id =listings_listingimage.listing_id \
            INNER JOIN listings_listinglocation ON location_id = listings_listinglocation.id \
            WHERE listing_id IN {} AND is_main=True" 
            results = Listing.active_listings.raw(sql_query.format(tuple(ids)))
            [print(result.name, result.price, result.location, result.description, result.url) for result in results]
            context = {"listings": results}
            context = self.template.render(context)
            send_mail(
                subject="Classify Newsletter", 
                message="",
                html_message=context,
                from_email=None,
                recipient_list=self.email_list,
                )

        except Exception as error:
            self.stderr.write(self.style.ERROR(f'\nError sending newsletters: {error}'))
        
        else:
            self.stdout.write(self.style.SUCCESS('\nEmail sent successfully!'))