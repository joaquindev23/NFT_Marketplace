# Generated by Django 3.2.16 on 2023-04-03 23:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0008_alter_product_discount_until'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='nft_address',
            field=models.CharField(blank=True, default=0, max_length=256, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='token_id',
            field=models.TextField(default=123, unique=True),
            preserve_default=False,
        ),
    ]
