from rest_framework import serializers

from apps.category.serializers import CategorySerializer
from .models import *
from apps.shipping.serializers import ShippingSerializer


class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sellers
        fields =[
            'author',
            "address",
            'polygon_address',
            # 'course',
        ]


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = [
            'id',
            'title',
            'price',
            'hex',
            'inStock',
            "position_id",
        ]

class DetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Details
        fields = [
            'id',
            'title',
            'body',
            "position_id",
        ]

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = [
            'id',
            'title',
            'price',
            'inStock',
            'stock',
            "position_id",
        ]

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = [
            'id',
            'title',
            'image',
            'price',
            'inStock',
            'stock',
            "position_id",
        ]

class WeightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weight
        fields = [
            'id',
            'title',
            'price',
            'inStock',
            'stock',
            "position_id",
        ]

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields =[
            'id',
            'position_id',
            "title",
            'file',
            'product',
        ]

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documents
        fields =[
            'id',
            'position_id',
            "title",
            'file',
            'product',
        ]

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields =[
            'id',
            'position_id',
            "title",
            'file',
            'product',
        ]

class ResourceSerializer(serializers.ModelSerializer):
    # file=serializers.CharField(source='get_absolute_url')
    class Meta:
        model= Resource
        fields = [
            "title",
            "file",
            "url",
            "id"
            'position_id',
        ]


class WhatLearntSerializer(serializers.ModelSerializer):
    class Meta:
        model= WhatLearnt
        fields = [
            "id",
            "position_id",
            "title",
        ]


class RequisiteSerializer(serializers.ModelSerializer):
    class Meta:
        model= Requisite
        fields = [
            "id",
            "position_id",
            "title",
        ]


class WhoIsForSerializer(serializers.ModelSerializer):
    class Meta:
        model= WhoIsFor
        fields = [
            "id",
            "position_id",
            "title",
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    colors=ColorSerializer(many=True)
    details=DetailSerializer(many=True)
    sizes=SizeSerializer(many=True)
    student_rating=serializers.IntegerField(source='get_rating')
    student_rating_no=serializers.IntegerField(source='get_no_rating')
    shipping = ShippingSerializer(many=True)
    images = ImageSerializer(many=True)
    videos = VideoSerializer(many=True)
    documents = DocumentSerializer(many=True)
    category=CategorySerializer()
    sellers=SellerSerializer(many=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'token_id',
            'nft_address',
            'title',
            'images',
            'description',
            'short_description',
            'price',
            'compare_price',
            'category',
            'quantity',
            'sold',
            'income_earned',
            'date_created',
            'updated',
            'discount_until',
            'discount',
            'author',
            'rating',
            'details',
            'colors',
            'sizes',
            'videos',
            'documents',
            'status',
            'student_rating',
            'student_rating_no',
            'slug',
            'keywords',
            'shipping',
            'views',
            'business_activity',
            'type',
            'onSale',
            'level',
            'language',
            'sellers'
        ]


class ProductCartSerializer(serializers.ModelSerializer):
    image=serializers.CharField(source='get_image')
    class Meta:
        model = Product
        fields = [
            'id',
            'token_id',
            'nft_address',
            'slug',
            'title',
            'short_description',
            'image',
            'price',
            'quantity',
            'discount_until',
            'discount',
            'compare_price',
        ]



class ProductSimpleSerializer(serializers.ModelSerializer):
    rating=serializers.IntegerField(source='get_rating')
    rating_no=serializers.IntegerField(source='get_no_rating')
    images = ImageSerializer(many=True)
    sellers=SellerSerializer(many=True)
    class Meta:
        model = Product
        fields = [
            'id',
            'token_id',
            'nft_address',
            'title',
            'images',
            'description',
            'short_description',
            'price',
            'compare_price',
            'date_created',
            'discount_until',
            'discount',
            'author',
            'status',
            'rating',
            'rating_no',
            'best_seller',
            'slug',
            'keywords',
            'sellers'
        ]


class ProductSearchSimpleSerializer(serializers.ModelSerializer):
    thumbnail=serializers.CharField(source='get_image')
    class Meta:
        model = Product
        fields = [
            'id',
            'token_id',
            'nft_address',
            'title',
            'short_description',
            'thumbnail',
            'slug',
        ]


class ProductSerializer(serializers.ModelSerializer):
    rating=serializers.IntegerField(source='get_rating')
    rating_no=serializers.IntegerField(source='get_no_rating')
    category=CategorySerializer()
    sellers=SellerSerializer(many=True)
    class Meta:
        model = Product
        fields = [
            'id',
            'token_id',
            'nft_address',
            'title',
            'description',
            'short_description',
            'price',
            'compare_price',
            'category',
            'quantity',
            'sold',
            'date_created',
            'discount_until',
            'discount',
            'author',
            'status',
            'rating',
            'rating_no',
            'best_seller',
            'slug',
            'keywords',
            'views',
            'business_activity',
            'type',
            'slug_changes',
            'welcome_message',
            'congrats_message',
            'target_audience_bool',
            'features_bool',
            'supply_chain_bool',
            'delivery_bool',
            'warehousing_bool',
            'value_proposition_bool',
            'marketing_strategy_bool',
            'product_details_bool',
            'accessibility_bool',
            'documentation_bool',
            'landing_page_bool',
            'pricing_bool',
            'promotions_bool',
            'shipping_bool',
            'messages_bool',
            'progress',
            'level',
            'language',
            'can_delete',
            'sellers'
        ]


class ProductListSerializer(serializers.ModelSerializer):
    rating=serializers.IntegerField(source='get_rating')
    rating_no=serializers.IntegerField(source='get_no_rating')
    images = ImageSerializer(many=True)
    details=DetailSerializer(many=True)
    videos = VideoSerializer(many=True)
    materials = MaterialSerializer(many=True)
    sizes = SizeSerializer(many=True)
    colors = ColorSerializer(many=True)
    weights = WeightSerializer(many=True)
    shipping = ShippingSerializer(many=True)
    documents = DocumentSerializer(many=True)
    category = CategorySerializer()
    class Meta:
        model = Product
        fields = [
            'id',
            'token_id',
            'nft_address',
            'title',
            'author',
            'description',
            'short_description',
            'price',
            'compare_price',
            'quantity',
            'images',
            'videos',
            'sold',
            'materials',
            'weights',
            'sizes',
            'colors',
            'date_created',
            'discount_until',
            'discount',
            'status',
            'rating',
            'rating_no',
            'best_seller',
            'slug',
            'keywords',
            'views',
            'documents',
            'shipping',
            'details',
            'business_activity',
            'type',
            'category',
            'target_audience_bool',
            'features_bool',
            'supply_chain_bool',
            'delivery_bool',
            'warehousing_bool',
            'value_proposition_bool',
            'marketing_strategy_bool',
            'product_details_bool',
            'accessibility_bool',
            'documentation_bool',
            'landing_page_bool',
            'pricing_bool',
            'promotions_bool',
            'shipping_bool',
            'messages_bool',
            'progress',
        ]

class ProductIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id'
        ]