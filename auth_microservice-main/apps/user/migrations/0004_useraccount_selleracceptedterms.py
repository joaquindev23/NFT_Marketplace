# Generated by Django 3.2.16 on 2023-02-01 21:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_auto_20230130_1308'),
    ]

    operations = [
        migrations.AddField(
            model_name='useraccount',
            name='sellerAcceptedTerms',
            field=models.BooleanField(default=False),
        ),
    ]
