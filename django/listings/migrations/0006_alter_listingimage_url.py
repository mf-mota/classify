# Generated by Django 5.0 on 2024-01-15 12:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0005_rename_cat_num_prop_1_listing_cat_num_prop_3_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listingimage',
            name='url',
            field=models.CharField(default='https://f005.backblazeb2.com/file/cars-dealers/Template+Images/no_photo_default.jpg', max_length=200),
        ),
    ]
