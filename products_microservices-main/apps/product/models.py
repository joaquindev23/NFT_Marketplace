from django.db import models

# Create your models here.
from django.db import models
from apps.category.models import Category
from apps.shipping.models import Shipping
from django.utils import timezone
from django.conf import settings
import os
from django.core.validators import MaxValueValidator,MinValueValidator
import uuid
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
from django.db.models.signals import pre_save
from django.db.models.signals import post_save
from django.dispatch import receiver


def marketplace_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    banner_pic_name = 'products/{0}/{1}'.format(instance.title, filename)
    full_path = os.path.join(settings.MEDIA_ROOT, banner_pic_name)

    if os.path.exists(full_path):
    	os.remove(full_path)

def products_image_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    banner_pic_name = 'products/{0}/{1}'.format(instance.product.title, filename)
    full_path = os.path.join(settings.MEDIA_ROOT, banner_pic_name)

    if os.path.exists(full_path):
    	os.remove(full_path)

def video_file_size(value): # add this to some file where you can import it from
    limit = 100000000
    if value.size > limit:
        raise ValidationError('File too large. Size should not exceed 100 MiB.')

def image_file_size(value): # add this to some file where you can import it from
    limit = 10000000
    if value.size > limit:
        raise ValidationError('File too large. Size should not exceed 10 MiB.')


class Image(models.Model):
    id =                        models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    position_id =               models.IntegerField(null=True, blank=True)
    title =                     models.CharField(max_length=60, blank=True, null=True)
    file =                      models.ImageField(upload_to='marketplace/products') 
    author =                    models.UUIDField(blank=True, null=True)
    product =                   models.ForeignKey('Product', on_delete=models.CASCADE, related_name='product_image_attached')

    
class Documents(models.Model):
    id =                        models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    position_id =               models.IntegerField(null=True, blank=True)
    title =                     models.CharField(max_length=60, blank=True, null=True)
    file =                      models.ImageField(upload_to='marketplace/products') 
    author =                    models.UUIDField(blank=True, null=True)
    product =                   models.ForeignKey('Product', on_delete=models.CASCADE, related_name='product_documents_attached')


class Video(models.Model):
    id =                        models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    position_id =               models.IntegerField(null=True, blank=True)
    title =                     models.CharField(max_length=60, blank=True, null=True)
    file =                      models.FileField(upload_to='marketplace/products') 
    author =                    models.UUIDField(blank=True, null=True)
    product =                   models.ForeignKey('Product', on_delete=models.CASCADE, related_name='product_video_attached')


class Sellers(models.Model):
    id =                        models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author =                        models.UUIDField(blank=True, null=True)
    address =                       models.CharField(max_length=256, null=True, blank=True)
    polygon_address =               models.CharField(max_length=256, blank=True, null=True)
    product =                        models.ForeignKey('Product', on_delete=models.CASCADE, related_name='productSeller')


class Product(models.Model):

    class PostObjects(models.Manager):
        def get_queryset(self):
            return super().get_queryset().filter(status='published')

    options = (
        ('draft', 'Draft'),
        ('published', 'Published'),
    )
    
    packagingOptions = (
        ('normal', 'Normal'),
        ('gift', 'Gift'),
    )

    conditionOptions = (
        ('new', 'New'),
        ('used', 'Used'),
        ('broken', 'Broken'),
    )

    id =                            models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    token_id =                      models.TextField(unique=True)
    nft_address =                 models.CharField(default=0,max_length=256, blank=True, null=True)
    sellers =                        models.ManyToManyField(Sellers,blank=True, related_name='courseSellers')

    author =                        models.UUIDField(blank=True, null=True)

    title =                         models.CharField(max_length=60, blank=True, null=True)
    description =                   models.TextField(blank=True, null=True)
    short_description =             models.TextField(max_length=125, blank=True, null=True)
    images =                        models.ManyToManyField(Image,blank=True, related_name='product_images')
    videos =                        models.ManyToManyField(Video,blank=True, related_name='product_videos')
    
    category =                      models.ForeignKey(Category, on_delete=models.CASCADE,blank=True, null=True)
    
    keywords =                      models.CharField(max_length=255,blank=True, null=True)
    slug =                          models.SlugField(unique=True, default=uuid.uuid4)

    language =          models.CharField(max_length=50, blank=True, null=True)
    level =             models.CharField(max_length=50, blank=True, null=True)

    slug_changes =                  models.IntegerField(default=1, blank=True, null=True)
    welcome_message =               models.TextField(max_length=1200, blank=True, null=True)
    congrats_message =              models.TextField(max_length=1200, blank=True, null=True)

    what_learnt =                   models.ManyToManyField('WhatLearnt', blank=True, related_name='whatlearnt_from_product')
    requisites =                    models.ManyToManyField('Requisite', blank=True, related_name='requisite_from_product')
    who_is_for =                    models.ManyToManyField('WhoIsFor', blank=True, related_name='whoisfor_from_product')
    resources =                     models.ManyToManyField('Resource', blank=True, related_name='resources_from_product')

    date_created =                  models.DateTimeField(default=timezone.now)
    updated =                       models.DateTimeField(auto_now=True)
    discount_until =                models.DateTimeField(default=timezone.now)
    discount =                      models.BooleanField(default=False)
    can_delete =                      models.BooleanField(default=True)

    shipping =                      models.ManyToManyField(Shipping,blank=True)

    price =                         models.DecimalField(max_digits=6, decimal_places=2,blank=True, null=True)
    compare_price =                 models.DecimalField(max_digits=6, decimal_places=2,blank=True, null=True)
    quantity =                      models.IntegerField(default=0)

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        related_name='products',
    )
    sub_category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        related_name='sub_category_products',
    )
    topic = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        related_name='topic_products',
    )

    best_seller =                   models.BooleanField(default=False)

    documents =                     models.ManyToManyField(Documents,blank=True, related_name='product_documents')
    business_activity =             models.CharField(max_length=255, default='B2C')
    type =                          models.CharField(max_length=255, default='Brand Product')

    # Criteria that a physical product can be sold by
    colors =                        models.ManyToManyField('Color', blank=True,related_name='productColors')
    details =                       models.ManyToManyField('Details', blank=True,related_name='productDetails')
    sizes =                         models.ManyToManyField('Size', blank=True,related_name='productSizes')
    materials =                         models.ManyToManyField('Material', blank=True,related_name='productMaterial')
    weights =                         models.ManyToManyField('Weight', blank=True,related_name='productweight')
    condition =                         models.CharField(max_length=255,choices=conditionOptions, default='new')
    warranty =                      models.CharField(max_length=255, default='0')
    packaging =                      models.CharField(max_length=255,choices=packagingOptions, default='normal')

    rating =                        models.ManyToManyField('Rate',blank=True)

    # Analytics
    views =                         models.IntegerField(default=0, blank=True)
    clicks =                        models.IntegerField(default=0, blank=True, null=True)
    impressions =                   models.IntegerField(default=0, blank=True, null=True)
    clickThroughRate =              models.FloatField(default=0, blank=True, null=True)
    purchases =                     models.IntegerField(default=0, blank=True, null=True)
    conversion_rate =               models.FloatField(default=0, blank=True, null=True)
    avg_time_on_page =              models.FloatField(default=0, blank=True, null=True)
    sold =                          models.IntegerField(default=0, blank=True, null=True)
    income_earned =                 models.PositiveIntegerField(default=0, blank=True)
    rating_no =                     models.IntegerField(default=0, blank=True, null=True)
    avgRating =                     models.IntegerField(default=0, blank=True)
    likes =                         models.IntegerField(default=0, blank=True)
    totalRevenue =                  models.IntegerField(default=0, blank=True)
    returns =                       models.IntegerField(default=0, blank=True)
    refunds =                       models.IntegerField(default=0, blank=True)

    onSale =                        models.BooleanField(default=False)

    manufacturer =                  models.CharField(max_length=1200, blank=True, null=True)

    target_audience_bool =          models.BooleanField(default=False)
    features_bool =                 models.BooleanField(default=False)
    supply_chain_bool =             models.BooleanField(default=False)
    delivery_bool =                 models.BooleanField(default=False)
    warehousing_bool =              models.BooleanField(default=False)
    value_proposition_bool =        models.BooleanField(default=False)
    marketing_strategy_bool =       models.BooleanField(default=False)
    product_details_bool =          models.BooleanField(default=False)
    accessibility_bool =            models.BooleanField(default=False)
    documentation_bool =            models.BooleanField(default=False)
    landing_page_bool =             models.BooleanField(default=False)
    pricing_bool =                  models.BooleanField(default=False)
    promotions_bool =               models.BooleanField(default=False)
    shipping_bool =                 models.BooleanField(default=False)
    messages_bool =                 models.BooleanField(default=False)

    status =                        models.CharField(max_length=10, choices=options, default='draft')

    objects =                       models.Manager()  # default manager
    postobjects =           PostObjects()  # custom manager

    class Meta:
        ordering = ('date_created',)

    def __str__(self):
        return self.title
    
    def get_rating(self):
        ratings=self.rating.all()
        rate=0
        for rating in ratings:
            rate+=rating.rate_number
        try:
            rate/=len(ratings)
        except ZeroDivisionError:
            rate=0
        return rate
    
    def progress(self):
        progress = 0
        if self.target_audience_bool:
            progress += 1
        if self.features_bool:
            progress += 1
        if self.supply_chain_bool:
            progress += 1
        if self.delivery_bool:
            progress += 1
        if self.warehousing_bool:
            progress += 1
        if self.value_proposition_bool:
            progress += 1
        if self.marketing_strategy_bool:
            progress += 1
        if self.product_details_bool:
            progress += 1
        if self.accessibility_bool:
            progress += 1
        if self.documentation_bool:
            progress += 1
        if self.landing_page_bool:
            progress += 1
        if self.pricing_bool:
            progress += 1
        if self.promotions_bool:
            progress += 1
        if self.shipping_bool:
            progress += 1
        if self.messages_bool:
            progress += 1
        # other fields
        return progress

    def get_no_rating(self):
        return len(self.rating.all())

    def get_view_count(self):
        views = ViewCount.objects.filter(product=self).count()
        return views
    
    def get_image(self):
        image = Image.objects.filter(product=self)[0]
        return image

    def calculate_ctr(self):
        if self.impressions and self.clicks:
            self.clickThroughRate = self.clicks / self.impressions
        else:
            self.clickThroughRate = 0
    
@receiver(pre_save, sender=Product)
def update_ctr(sender, instance, **kwargs):
    instance.calculate_ctr()

# @receiver(post_save, sender=Product)
# def update_discount_status(sender, instance, **kwargs):
#     now = timezone.now()
#     if instance.price < instance.compare_price and now <= instance.discount_until:
#         instance.discount = True
#     else:
#         instance.discount = False
#     instance.save()

class ViewCount(models.Model):
    id =                        models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product =                   models.ForeignKey(Product, related_name='product_view_count', on_delete=models.CASCADE)
    ip_address =                models.CharField(max_length=255)

    def __str__(self):
        return f"{self.ip_address}"


class Rate(models.Model):
    id =                        models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rate_number=                models.IntegerField(validators=[MinValueValidator(0),MaxValueValidator(5)])
    user =                      models.UUIDField(blank=True, null=True)


class Color(models.Model):
    id =                        models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    position_id =               models.IntegerField(null=True, blank=True)
    title =                     models.CharField(max_length=255)
    hex =                       models.CharField(max_length=255)
    price =                     models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock =                     models.IntegerField(null=True, blank=True)
    inStock =                   models.BooleanField(default=True)
    author =                    models.UUIDField(blank=True, null=True)
    product =                   models.ForeignKey(Product, on_delete=models.CASCADE, related_name='color_belongs_to_product', blank=True, null=True)

    def __str__(self):
        return self.title


class Details(models.Model):
    id =                        models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    position_id =               models.IntegerField(null=True, blank=True)
    title =                     models.CharField(max_length=255)
    body =                      models.CharField(max_length=1200)
    author =                    models.UUIDField(blank=True, null=True)
    product =                   models.ForeignKey(Product, on_delete=models.CASCADE, related_name='detail_belongs_to_product', blank=True, null=True)


    def __str__(self):
        return self.title


class Size(models.Model):
    id =                        models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    position_id =               models.IntegerField(null=True, blank=True)
    title =                     models.CharField(max_length=255)
    inStock =                   models.BooleanField(default=True)
    stock =                     models.IntegerField(null=True, blank=True)
    author =                    models.UUIDField(blank=True, null=True)
    price =                     models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    product =                   models.ForeignKey(Product, on_delete=models.CASCADE, related_name='size_belongs_to_product', blank=True, null=True)

    def __str__(self):
        return self.title

class Material(models.Model):
    id =                        models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    position_id =               models.IntegerField(null=True, blank=True)
    title =                     models.CharField(max_length=255)
    image =                      models.ImageField(upload_to='marketplace/materials',null=True, blank=True) 
    inStock =                   models.BooleanField(default=True)
    stock =                     models.IntegerField(null=True, blank=True)
    author =                    models.UUIDField(blank=True, null=True)
    price =                     models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    product =                   models.ForeignKey(Product, on_delete=models.CASCADE, related_name='material_belongs_to_product', blank=True, null=True)

    def __str__(self):
        return self.title

class Weight(models.Model):
    id =                        models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    position_id =               models.IntegerField(null=True, blank=True)
    title =                     models.CharField(max_length=255)
    inStock =                   models.BooleanField(default=True)
    stock =                     models.IntegerField(null=True, blank=True)
    author =                    models.UUIDField(blank=True, null=True)
    price =                     models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    product =                   models.ForeignKey(Product, on_delete=models.CASCADE, related_name='weight_belongs_to_product', blank=True, null=True)

    def __str__(self):
        return self.title


class Requisite(models.Model):
    id =                        models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    position_id =               models.IntegerField(null=True, blank=True)
    title =                     models.CharField(max_length=255)
    user =                      models.UUIDField(blank=True, null=True)
    product =                   models.ForeignKey(Product, on_delete=models.CASCADE, related_name='requisite_belongs_to_product', blank=True, null=True)

    def __str__(self):
        return self.title

    
class WhatLearnt(models.Model):
    id =                        models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    position_id =               models.IntegerField(null=True, blank=True)
    title =                     models.CharField(max_length=255)
    user =                      models.UUIDField(blank=True, null=True)
    product =                   models.ForeignKey(Product, on_delete=models.CASCADE, related_name='whatlearnt_belongs_to_product', blank=True, null=True)

    def __str__(self):
        return self.title


class WhoIsFor(models.Model):
    id =                        models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    position_id =               models.IntegerField(null=True, blank=True)
    title =                     models.CharField(max_length=255)
    user =                      models.UUIDField(blank=True, null=True)
    product =                   models.ForeignKey(Product, on_delete=models.CASCADE, related_name='whoisfor_belongs_to_product', blank=True, null=True)

    def __str__(self):
        return self.title
    

class Resource(models.Model):
    id =                        models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    position_id =               models.IntegerField(null=True, blank=True)
    title =                     models.CharField(max_length=255)
    file =                      models.FileField(upload_to='marketplace/resources', blank=True, null=True)
    url =                       models.URLField(blank=True, null=True)
    user =                      models.UUIDField(blank=True, null=True)

    def __str__(self):
        return self.title