from uuid import uuid4
from apps.category.models import Category
from apps.product.permissions import AuthorPermission, IsProductAuthorOrReadOnly
from apps.shipping.models import Shipping
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from random import randint
from django.core.exceptions import ObjectDoesNotExist, PermissionDenied
from PIL import Image
from uuid import UUID
import tempfile
import rsa
import secrets
import json
import requests
from django.core.validators import validate_slug
from .models import Color, Details, Image, Product, Size, Video, ViewCount,WhatLearnt,Requisite,WhoIsFor
from django.db.models import Case, When, Value, IntegerField, Avg
# from apps.reviews.models import ProductReview
from apps.shipping.serializers import ShippingSerializer
from .serializers import *
from django.http import Http404
from .pagination import SmallSetPagination, MediumSetPagination, LargeSetPagination
from django.db.models import Q
from django.db.models import F
# from apps.reviews.models import ProductReview
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from slugify import slugify
from base64 import b64decode
from django.core.files.base import ContentFile
from datetime import datetime
import base64
import jwt
import re
from core.producer import producer
from rest_framework_api.views import StandardAPIView
from django.conf import settings
secret_key = settings.SECRET_KEY
DEBUG = settings.DEBUG

coupons_ms_url=settings.COUPONS_MS_URL
auth_ms_url=settings.AUTH_MS_URL
cryptography_ms_url=settings.CRYPTOGRAPHY_MS_URL

from web3 import Web3
polygon_url=settings.POLYGON_RPC
POLYGONSCAN_API_KEY=settings.POLYGONSCAN_API_KEY


polygon_web3 = Web3(Web3.HTTPProvider(polygon_url))

def validate_token(request):
    token = request.META.get('HTTP_AUTHORIZATION').split()[1]

    try:
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return Response({"error": "Token has expired."}, status=status.HTTP_401_UNAUTHORIZED)
    except jwt.DecodeError:
        return Response({"error": "Token is invalid."}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception:
        return Response({"error": "An error occurred while decoding the token."}, status=status.HTTP_401_UNAUTHORIZED)

    return payload


def get_discounted_product(**kwargs):
    product = get_object_or_404(Product, Q(status='published') | Q(status='draft'), **kwargs)
    date_now = timezone.now()
    discount_key = f"discount-{product.id}"
    discount = cache.get(discount_key)
    if discount is None:
        if product.discount_until and product.discount_until < date_now:
            product.discount = False
            product.save()
            discount = False
        else:
            product.discount = True
            product.save()
            discount = True
        cache.set(discount_key, discount, timeout=60) # set the timeout to 60 seconds
    return product, discount


def get_product_data(id, user_id):
    try:
        product = Product.objects.get(id=id, author=user_id)
    except Product.DoesNotExist:
        raise Http404("Product does not exist")

    videos = VideoSerializer(product.videos.all(), many=True)
    images = ImageSerializer(product.images.all(), many=True)
    shipping = ShippingSerializer(product.shipping.all(), many=True)
    documents = DocumentSerializer(product.documents.all(), many=True)
    colors = ColorSerializer(product.colors.all(), many=True)
    details = DetailSerializer(product.details.all(), many=True)
    sizes = SizeSerializer(product.sizes.all(), many=True)
    weights = WeightSerializer(product.weights.all(), many=True)
    materials = MaterialSerializer(product.materials.all(), many=True)

    whatlearnt = WhatLearntSerializer(product.what_learnt.all(), many=True)
    requisites = RequisiteSerializer(product.requisites.all(), many=True)
    who_is_for = WhoIsForSerializer(product.who_is_for.all(), many=True)
    resources = ResourceSerializer(product.resources.all(), many=True)

    product = ProductSerializer(product)

    product_data = {
        'videos': videos.data,
        'images': images.data,
        'shipping': shipping.data,
        'documents': documents.data,
        'detail': details.data,
        'colors': colors.data,
        'weights': weights.data,
        'materials': materials.data,
        'sizes': sizes.data,
        'whatlearnt': whatlearnt.data,
        'requisites': requisites.data,
        'who_is_for': who_is_for.data,
        'resources': resources.data,
        'details': product.data,
    }

    return product_data


def get_polygon_contract_abi(address):
    url = f'https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address={address}&apikey={POLYGONSCAN_API_KEY}'
    # if DEBUG:
    # else:
    #     url = f'https://api.polygonscan.com/api?module=contract&action=getabi&address={address}&apikey={POLYGONSCAN_API_KEY}'

    response = requests.get(url)
    data = response.json()
    if data['status'] == '1':
        return data['result']
    else:
        return None

def is_valid_token_id(token_id):
    try:
        int(token_id)
        return True
    except ValueError:
        return False
    
def is_valid_uuid(uuid):
    try:
        UUID(uuid, version=4)
        return True
    except ValueError:
        return False
    

def is_valid_nft_address(address):
    # You can modify this function to include specific rules for validating NFT addresses.
    # For now, we'll check if the length of the string is correct.
    return len(address) == 42

    
def get_public_product_data(identifier):
    cache_key = f"public_product_data-{identifier}"
    cached_result = cache.get(cache_key)

    if cached_result:
        return cached_result
    
    if is_valid_uuid(identifier):
        product, discount = get_discounted_product(id=identifier)
    elif is_valid_nft_address(identifier):
        product, discount = get_discounted_product(nft_address=identifier)
    else:
        product, discount = get_discounted_product(slug=identifier)

    videos = VideoSerializer(product.videos.all(), many=True)
    images = ImageSerializer(product.images.all(), many=True)
    shipping = ShippingSerializer(product.shipping.all(), many=True)
    documents = DocumentSerializer(product.documents.all(), many=True)
    colors = ColorSerializer(product.colors.all(), many=True)
    details = DetailSerializer(product.details.all(), many=True)
    sizes = SizeSerializer(product.sizes.all(), many=True)
    weights = WeightSerializer(product.weights.all(), many=True)
    materials = MaterialSerializer(product.materials.all(), many=True)

    whatlearnt = WhatLearntSerializer(product.what_learnt.all(), many=True)
    requisites = RequisiteSerializer(product.requisites.all(), many=True)
    who_is_for = WhoIsForSerializer(product.who_is_for.all(), many=True)
    resources = ResourceSerializer(product.resources.all(), many=True)

    product = ProductSerializer(product)

    product_data = {
        'videos': videos.data,
        'images': images.data,
        'shipping': shipping.data,
        'documents': documents.data,
        'detail': details.data,
        'colors': colors.data,
        'weights': weights.data,
        'materials': materials.data,
        'sizes': sizes.data,
        'whatlearnt': whatlearnt.data,
        'requisites': requisites.data,
        'who_is_for': who_is_for.data,
        'resources': resources.data,
        'details': product.data,
        'discount': discount,
    }
    # Cache the result
    cache.set(cache_key, product_data, 1800)  # Cache for 600 seconds
    return product_data



def decrypt_polygon_private_key(address):
    # Get wallet information from the backend API
    wallet_request = requests.get(f'{auth_ms_url}/api/wallets/get/?address={address}').json()
    base64_encoded_private_key_string = wallet_request['results']['polygon_private_key']
    
    # Get RSA private key from the backend API
    rsa_private_key_string = requests.get(f'{cryptography_ms_url}/api/crypto/key/').json()
    
    # Create a temporary file to store the RSA private key
    with tempfile.NamedTemporaryFile(mode='w', delete=False) as temp_file:
        # Write the contents of rsa_private_key_string to the file
        temp_file.write(rsa_private_key_string)
    # Load the private key from the temporary file
    with open(temp_file.name, "rb") as f:
        privkey = rsa.PrivateKey.load_pkcs1(f.read())
    
    # Decode the Base64-encoded string
    decoded_bytes = base64.b64decode(base64_encoded_private_key_string)
    
    # Decrypt the bytes using the private key
    decrypted_bytes = rsa.decrypt(decoded_bytes, privkey)
    
    # Convert the decrypted bytes to a string
    wallet_private_key = decrypted_bytes.decode('ascii')
    
    return wallet_private_key


# READ / LIST / FILTER
def random_with_N_digits(n):
    range_start = 10**(n-1)
    range_end = (10**n)-1
    return randint(range_start, range_end)
class CreateProductView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        payload = validate_token(request)
        data = self.request.data

        # try:
        # if payload.get('user').get('role') != 'seller':
        #     raise PermissionError('You dont have the permissions to create a product.')
        
        user_id = payload['user_id']

        # Code to create product
        title = data['title']
        category = data['category']
        category = get_object_or_404(Category, name=category)

        type = data['type']
        business_activity = data['businessActivity']

        product = Product.objects.create(author=user_id, title=title, business_activity=business_activity,type=type, category=category)
        # nft_id = int(re.sub('[^0-9]', '', str(course.id))) % 2**256
        product.token_id = random_with_N_digits(9)
        product.save()

        sellers = Sellers.objects.create(
            author=payload['user_id'],
            address=data['address'],
            polygon_address=data['polygonAddress'],
            product=product 
            )
        product.sellers.add(sellers)

        serializer = ProductSerializer(product)
        return self.send_response(serializer.data,status=status.HTTP_201_CREATED)
        # except:
        #     return self.send_error('You dont have the permissions to create a product.',status=status.HTTP_403_FORBIDDEN)
        
class EditProductNFTAddressView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        # try:
        payload = validate_token(request)
        user_id = payload['user_id']

        product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)

        nft_address = self.request.data['nftAddress']

        product.nft_address = nft_address
        product.save()
        product_data = get_product_data(self.request.data['productUUID'],user_id)
        return self.send_response(product_data, status=status.HTTP_200_OK)
        # except Product.DoesNotExist:
        #     return self.send_error('Product with this ID does not exist or user_id not match with course author',
        #                            status=status.HTTP_404_NOT_FOUND)
        # except:
        #     return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class EditProductStockView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']
        try:

            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)

            stock = self.request.data['stock']

            product.stock = stock
            product.save()
            course_data = get_product_data(self.request.data['productUUID'], user_id)
            return self.send_response(course_data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('Course with this ID does not exist or user_id not match with course author',
                                   status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)

class ListAuthorProductsView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request, *args, **kwargs):

        payload = validate_token(request)
        user_id = payload['user_id']

        products = Product.objects.filter(author=user_id)

        # Get filter parameter
        author = request.query_params.getlist('author', None)
        category = request.query_params.getlist('category', None)
        business_activity = request.query_params.getlist('business_activity', None)
        type = request.query_params.getlist('type', None)
        filter_by = request.query_params.get('filter', None)
        order_by = request.query_params.get('order', '-date_created')
        search = request.query_params.get('search', None)

        if filter_by == 'published':
            products = products.filter(status='published')
        elif filter_by == 'unpublished':
            products = products.filter(status='draft')

        if category and 'null' not in category:
            q_obj = Q()
            for cat in category:
                q_obj |= Q(category=cat)
            products = products.filter(q_obj)

        if author and 'null' not in author:
            q_obj = Q()
            for auth in author:
                q_obj |= Q(author=auth)
            products = products.filter(q_obj)

        if business_activity and 'null' not in business_activity:
            q_obj = Q()
            for b_activity in business_activity:
                q_obj |= Q(business_activity=b_activity)
            products = products.filter(q_obj)

        if type and 'null' not in type:
            q_obj = Q()
            for t in type:
                q_obj |= Q(type=t)
            products = products.filter(q_obj)

        if search and 'null' not in search:
            products = Product.objects.filter(Q(title__icontains=search) | Q(description__icontains=search) | Q(short_description__icontains=search) | Q(keywords__icontains=search))


        if order_by == 'oldest':
            products = products.order_by('date_created')
        elif order_by == 'az':
            products = products.order_by('title')
        elif order_by == 'za':
            products = products.order_by('-title')
        elif order_by == 'sold':
            products = products.order_by('sold')
        else:
            products = products.order_by(order_by)

        serializer = ProductListSerializer(products, many=True)

        return self.paginate_response(request, serializer.data)


class ListFiterProductsView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request, *args, **kwargs):
        products = Product.postobjects.all()

        # Get filter parameter
        author = request.query_params.getlist('author', None)
        category = request.query_params.getlist('category', None)
        business_activity = request.query_params.getlist('business_activity', None)
        type = request.query_params.getlist('type', None)
        filter_by = request.query_params.get('filter', None)
        order_by = request.query_params.get('order', '-date_created')
        search = request.query_params.get('search', None)

        if filter_by == 'published':
            products = products.filter(status='published')
        elif filter_by == 'unpublished':
            products = products.filter(status='draft')

        if category and 'null' not in category:
            q_obj = Q()
            for cat in category:
                q_obj |= Q(category=cat)
            products = products.filter(q_obj)

        if author and 'null' not in author:
            q_obj = Q()
            for auth in author:
                q_obj |= Q(author=auth)
            products = products.filter(q_obj)

        if business_activity and 'null' not in business_activity:
            q_obj = Q()
            for b_activity in business_activity:
                q_obj |= Q(business_activity=b_activity)
            products = products.filter(q_obj)

        if type and 'null' not in type:
            q_obj = Q()
            for t in type:
                q_obj |= Q(type=t)
            products = products.filter(q_obj)

        if search and 'null' not in search:
            products = Product.objects.filter(Q(title__icontains=search) | Q(description__icontains=search) | Q(short_description__icontains=search) | Q(keywords__icontains=search))

        if order_by == 'oldest':
            products = products.order_by('date_created')
        elif order_by == 'az':
            products = products.order_by('title')
        elif order_by == 'za':
            products = products.order_by('-title')
        elif order_by == 'sold':
            products = products.order_by('-sold')
        else:
            products = products.order_by(order_by)

        paginator = SmallSetPagination()
        results = paginator.paginate_queryset(products, request)
        serializer = ProductListSerializer(results, many=True)

        response = paginator.get_paginated_response({'products': serializer.data})

        return response
    


    
class ListProductsView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        cache_key = "product_list"
        product_list = cache.get(cache_key)

        if product_list is None:
            try:
                payload = validate_token(request)
                user_id = payload['user_id']
                # Get the first 20 published products 
                products_shown = Product.objects.filter(status='published').values_list('id')[:20]
                
                for product in products_shown:
                    item={}
                    item['user']=user_id
                    item['product']=str(product[0])
                    producer.produce(
                        'product_interaction',
                        key='product_view_impressions',
                        value=json.dumps(item).encode('utf-8')
                    )
                producer.flush()
                # update the impressions field for only the products shown
                Product.objects.filter(id__in=products_shown).update(impressions=F('impressions') + 1)
                products_shown = Product.objects.filter(id__in=products_shown)
                serializer = ProductListSerializer(products_shown, many=True)
                cache.set(cache_key, serializer.data, 1800)  # Cache for 15 minutes
                return self.paginate_response(request, serializer.data)
            except:
                # Get the first 20 published products 
                products_shown = Product.objects.filter(status='published').values_list('id', flat=True)[:20]
                # update the impressions field for only the products shown
                Product.objects.filter(id__in=products_shown).update(impressions=F('impressions') + 1)
                products_shown = Product.objects.filter(id__in=products_shown)
                serializer = ProductListSerializer(products_shown, many=True)
                cache.set(cache_key, serializer.data, 1800)  # Cache for 15 minutes
                return self.paginate_response(request, serializer.data)
        else:
            return self.paginate_response(request, product_list)


class ListProductsFromIDListView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        data = request.data
        cache_key = 'product_items_' + '_'.join([str(item['product']) for item in data])
        cached_result = cache.get(cache_key)

        if cached_result:
            return self.send_response(cached_result, status=status.HTTP_200_OK)
        
        product_items = []

        for item in data:
            product = Product.objects.get(id=item['product'])
            base_price = 0
            count = item['count']
            color = Color.objects.get(pk=item['color']) if item['color'] else None
            size = Size.objects.get(pk=item['size']) if item['size'] else None
            material = Material.objects.get(pk=item['material']) if item['material'] else None
            shipping = Shipping.objects.get(pk=item['shipping'])
            weight = Weight.objects.get(pk=item['weight']) if item['weight'] else None
            coupon = item['coupon'] if item['coupon'] else None
            if coupon:
                # print('Coupon: ',coupon)
                response = requests.get(f'{coupons_ms_url}/api/coupons/get/' + coupon).json()
            else:
                response = None

            if product.price is not None:
                base_price = product.price
            else:
                if weight:
                    base_price += weight.price
                if material:
                    base_price += material.price
                if color:
                    base_price += color.price
                if size:
                    base_price += size.price

            product_item = {
                'product_id':product.id,
                'product_token_id':product.token_id,
                'product_nft_address':product.nft_address,
                'product_slug':product.slug,
                'product_title':product.title,
                'product_price': base_price,
                'product_quantity':product.quantity,
                'product_discount':product.discount,
                'product_compare_price':product.compare_price if product.compare_price else None,
                'product_image':product.images.first().file.url if product.images.exists() else None,
                'size':size.title if size else None,
                'material':material.title if material else None,
                'shipping':shipping.title,
                'weight':weight.title if weight else None,
                'color':color.hex if color else None,
                'count':str(count),
                'coupon':response['results'] if coupon else None,
            }
            product_items.append(product_item)
        # Cache the result
        cache.set(cache_key, product_items, 1800)  # Cache for 300 seconds
        return self.send_response(product_items, status=status.HTTP_200_OK)


class DetailProductAuthorView(StandardAPIView):
    permission_classes = (permissions.AllowAny, )
    def get(self,request, id,*args, **kwargs):

        payload = validate_token(request)
        user_id = payload['user_id']

        try:
            product_data = get_product_data(id,user_id)
            return self.send_response(product_data,status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('Product with this ID does not exist or user_id did not match with product author',status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)
        

class DetailProductView(StandardAPIView):
    permission_classes = (permissions.AllowAny, )
    def get(self,request, id,*args, **kwargs):
        return self.send_response(get_public_product_data(id),status=status.HTTP_200_OK)
        # try:
        # except Product.DoesNotExist:
        #     return self.send_error('product with this ID does not exist or user_id did not match with product author',status=status.HTTP_404_NOT_FOUND)
        # except:
        #     return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)


class UpdateProductClickView(StandardAPIView):
    permission_classes = (permissions.AllowAny, )
    def put(self,request,*args, **kwargs):
        payload = validate_token(request)
        # try:
        if(payload.get('user_id')):
            user_id = payload['user_id']
            data = self.request.data

            product = Product.objects.get(id=data['productUUID'])
            product.clicks += 1
            product.save()

            item={}
            item['user']=user_id
            item['product']=data['productUUID']
            producer.produce(
                'product_interaction',
                key='product_view_clicks',
                value=json.dumps(item).encode('utf-8')
            )
            producer.flush()

            return self.send_response('WatchTime Updated',status=status.HTTP_200_OK)
        else:
            user_id = payload['user_id']
            data = self.request.data

            product = Product.objects.get(id=data['productUUID'])
            product.clicks += 1
            product.save()

            return self.send_response('WatchTime Updated',status=status.HTTP_200_OK)

        # except Course.DoesNotExist:
        #     return self.send_error('Course with this ID does not exist or user_id did not match with course author',status=status.HTTP_404_NOT_FOUND)
        # except:
        #     return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)


class UpdateProductAnalyticsView(StandardAPIView):
    permission_classes = (permissions.AllowAny, )
    def put(self,request, id,*args, **kwargs):
        payload = validate_token(request)
        try:
            if(payload.get('user_id')):
                user_id = payload['user_id']
                data = self.request.data

                watchTime = int(data['watchTime'])
                product = Product.objects.get(id=data['productUUID'])
                oldAvg = product.avg_time_on_page
                newAvg = oldAvg + watchTime
                product.avg_time_on_page = newAvg
                product.save()

                item={}
                item['user']=user_id
                item['product']=id
                item['watchTime']=watchTime
                producer.produce(
                    'product_interaction',
                    key='product_view_watchtime',
                    value=json.dumps(item).encode('utf-8')
                )
                producer.flush()

                return self.send_response('WatchTime Updated',status=status.HTTP_200_OK)
            else:
                user_id = payload['user_id']
                data = self.request.data

                watchTime = int(data['watchTime'])
                product = Product.objects.get(id=data['productUUID'])
                oldAvg = product.avg_time_on_page
                newAvg = oldAvg + watchTime
                product.avg_time_on_page = newAvg
                product.save()

                return self.send_response('WatchTime Updated',status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('Product with this ID does not exist or user_id did not match with Product author',status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)
        

        
class UpdateProductViewsView(StandardAPIView):
    permission_classes = (permissions.AllowAny, )
    def put(self,request,*args, **kwargs):
        payload = validate_token(request)
        # try:
        if(payload.get('user_id')):
            user_id = payload['user_id']
            data = self.request.data

            product = Product.objects.get(id=data['productUUID'])
            product.views += 1
            product.save()

            item={}
            item['user']=user_id
            item['product']=data['productUUID']
            producer.produce(
                'product_interaction',
                key='product_view_views',
                value=json.dumps(item).encode('utf-8')
            )
            producer.flush()

            return self.send_response('WatchTime Updated',status=status.HTTP_200_OK)
        else:
            user_id = payload['user_id']
            data = self.request.data

            product = Product.objects.get(id=data['productUUID'])
            product.views += 1
            product.save()

            return self.send_response('WatchTime Updated',status=status.HTTP_200_OK)

        # except Product.DoesNotExist:
        #     return self.send_error('Course with this ID does not exist or user_id did not match with course author',status=status.HTTP_404_NOT_FOUND)
        # except:
        #     return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)


class CreateWhatLearntView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        
        payload = validate_token(request)
        user_id = payload['user_id']
        data = self.request.data

        # # cache_key = f'detail_product_author_{id}_{user_id}'
        
        try:

            product = get_object_or_404(Product, id=data['productUUID'])

            result=[]
            for whatlearnt in data['whatlearnt']:
                obj, created = WhatLearnt.objects.update_or_create(
                    user=user_id, product=product, position_id=whatlearnt['id'],
                    defaults={'title': whatlearnt['title'],'position_id': whatlearnt['id']},
                )
                # If person exists with first_name='John' & last_name='Lennon' then update first_name='Bob'
                # Else create new person with first_name='Bob' & last_name='Lennon'
                product.what_learnt.add(obj)
                result.append(obj)
                
                # Save the product data in cache
                # cache.set(cache_key, serializer.data)

            return self.send_response('Whatlearnt added to product', status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id did not match with product author',status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)


class DeleteWhatLearntView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']
        product = get_object_or_404(Product, id=self.request.data['product_uuid'])
        whatlearnt = WhatLearnt.objects.get(product=product, position_id=self.request.data['what_learnt_id'])
        if str(product.author) == user_id:
            if Product.objects.filter(what_learnt=whatlearnt).exists():
                whatlearnt.delete()
                return self.send_response('product Whatlearnt Deleted', status=status.HTTP_200_OK)
            else:
                return self.send_error('That item does not exist.', status=status.HTTP_404_NOT_FOUND)
        else:
            return self.send_error('Only the product author may delete this', status=status.HTTP_401_UNAUTHORIZED)


# ============= product Requisites ===================
class CreateRequisiteView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        
        payload = validate_token(request)
        user_id = payload['user_id']
        data = self.request.data
        
        # # cache_key = f'detail_product_author_{id}_{user_id}'
        try:

            product = get_object_or_404(Product, id=data['productUUID'])

            result=[]
            for requisite in data['requisites']:
                obj, created = Requisite.objects.update_or_create(
                    user=user_id, product=product, position_id=requisite['id'],
                    defaults={'title': requisite['title'],'position_id': requisite['id']},
                )
                # If person exists with first_name='John' & last_name='Lennon' then update first_name='Bob'
                # Else create new person with first_name='Bob' & last_name='Lennon'
                product.requisites.add(obj)
                result.append(obj)
        

        # Save the product data in cache
        # cache.set(cache_key, serializer.data)

            return self.send_response('Requisite added to product', status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id did not match with product author',status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)


class DeleteRequisiteView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']
        product = get_object_or_404(Product, id=self.request.data['product_uuid'])
        requisite = Requisite.objects.get(product=product, position_id=self.request.data['requisite_id'])
        if str(product.author) == user_id:
            if Product.objects.filter(requisites=requisite).exists():
                requisite.delete()
                return self.send_response('product Requisite Deleted', status=status.HTTP_200_OK)
            else:
                return self.send_error('That item does not exist.', status=status.HTTP_404_NOT_FOUND)
        else:
            return self.send_error('Only the product author may delete this', status=status.HTTP_401_UNAUTHORIZED)
        

class CreateWhoIsForView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        
        payload = validate_token(request)
        user_id = payload['user_id']
        data = self.request.data
        
        # # cache_key = f'detail_product_author_{id}_{user_id}'
        try:

            product = get_object_or_404(Product, id=data['productUUID'])

            result=[]
            for whoIsFor in data['whoIsFor']:
                obj, created = WhoIsFor.objects.update_or_create(
                    user=user_id, product=product, position_id=whoIsFor['id'],
                    defaults={'title': whoIsFor['title'],'position_id': whoIsFor['id']},
                )
                # If person exists with first_name='John' & last_name='Lennon' then update first_name='Bob'
                # Else create new person with first_name='Bob' & last_name='Lennon'
                product.who_is_for.add(obj)
                result.append(obj)
            

            # Save the product data in cache
            # cache.set(cache_key, serializer.data)

            return self.send_response('Requisite added to product', status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id did not match with product author',status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)


class DeleteWhoIsForView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']

        product = get_object_or_404(Product, id=self.request.data['productUUID'])
        try:
            whoIsFor = WhoIsFor.objects.get(product=product, position_id=self.request.data['whoIsForId'])
            if str(product.author) == user_id:
                try:
                    if Product.objects.filter(who_is_for=whoIsFor).exists():
                        whoIsFor.delete()
                        return self.send_response('product WhoIsFor Deleted', status=status.HTTP_200_OK)
                except:
                    return self.send_error('That item does not exist.', status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Only the product author may delete this', status=status.HTTP_401_UNAUTHORIZED)
    



class SetProductTargetAudienceView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        try:
            payload = validate_token(request)
            user_id = payload['user_id']
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
            bool = self.request.data['bool']
            product.target_audience_bool = bool
            product.save()
            return self.send_response('product Goals Edited Correctly', status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id not match with product author',
                                   status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class SetProductFeaturesView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        try:
            payload = validate_token(request)
            user_id = payload['user_id']
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
            bool = self.request.data['bool']
            product.features_bool = bool
            product.save()
            return self.send_response('product Goals Edited Correctly', status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id not match with product author',
                                   status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class SetProductSupplyChainView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        try:
            payload = validate_token(request)
            user_id = payload['user_id']
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
            bool = self.request.data['bool']
            product.supply_chain_bool = bool
            product.save()
            return self.send_response('product Goals Edited Correctly', status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id not match with product author',
                                   status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class SetProductDeliveryView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        try:
            payload = validate_token(request)
            user_id = payload['user_id']
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
            bool = self.request.data['bool']
            product.delivery_bool = bool
            product.save()
            return self.send_response('product Goals Edited Correctly', status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id not match with product author',
                                   status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class SetWarehousingView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        try:
            payload = validate_token(request)
            user_id = payload['user_id']
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
            bool = self.request.data['bool']
            product.warehousing_bool = bool
            product.save()
            return self.send_response('product Goals Edited Correctly', status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id not match with product author',
                                   status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class SetValueProposition(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        try:
            payload = validate_token(request)
            user_id = payload['user_id']
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
            bool = self.request.data['bool']
            product.value_proposition_bool = bool
            product.save()
            return self.send_response('product Goals Edited Correctly', status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id not match with product author',
                                   status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class SetMarketingView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        try:
            payload = validate_token(request)
            user_id = payload['user_id']
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
            bool = self.request.data['bool']
            product.marketing_strategy_bool = bool
            product.save()
            return self.send_response('product Goals Edited Correctly', status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id not match with product author',
                                   status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class SetDetailsView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        try:
            payload = validate_token(request)
            user_id = payload['user_id']
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
            bool = self.request.data['bool']
            product.product_details_bool = bool
            product.save()
            return self.send_response('product Goals Edited Correctly', status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id not match with product author',
                                   status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class SetAccessibilityView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        try:
            payload = validate_token(request)
            user_id = payload['user_id']
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
            bool = self.request.data['bool']
            product.accessibility_bool = bool
            product.save()
            return self.send_response('product Goals Edited Correctly', status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id not match with product author',
                                   status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class SetDocumentationView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        try:
            payload = validate_token(request)
            user_id = payload['user_id']
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
            bool = self.request.data['bool']
            product.documentation_bool = bool
            product.save()
            return self.send_response('product Goals Edited Correctly', status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id not match with product author',
                                   status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class SetLandingPageView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        try:
            payload = validate_token(request)
            user_id = payload['user_id']
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
            bool = self.request.data['bool']
            product.landing_page_bool = bool
            product.save()
            return self.send_response('product Goals Edited Correctly', status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id not match with product author',
                                   status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class SetPricingView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        try:
            payload = validate_token(request)
            user_id = payload['user_id']
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
            bool = self.request.data['bool']
            product.pricing_bool = bool
            product.save()
            return self.send_response('product Goals Edited Correctly', status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id not match with product author',
                                   status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class SetPromotionsView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        try:
            payload = validate_token(request)
            user_id = payload['user_id']
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
            bool = self.request.data['bool']
            product.promotions_bool = bool
            product.save()
            return self.send_response('product Goals Edited Correctly', status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id not match with product author',
                                   status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class SetShippingView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        try:
            payload = validate_token(request)
            user_id = payload['user_id']
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
            bool = self.request.data['bool']
            product.shipping_bool = bool
            product.save()
            return self.send_response('product Goals Edited Correctly', status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id not match with product author',
                                   status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class SetMessagesView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        try:
            payload = validate_token(request)
            user_id = payload['user_id']
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
            bool = self.request.data['bool']
            product.messages_bool = bool
            product.save()
            return self.send_response('product Goals Edited Correctly', status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id not match with product author',
                                   status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)
        

class EditProductView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def put(self, request, format=None):

        payload = validate_token(request)
        user_id = payload['user_id']

        try:
            product = get_object_or_404(Product, id=self.request.data['productUUID'], author=user_id)

            if(self.request.data['title']):
                product.title=self.request.data['title']

            if(self.request.data['subTitle']):
                product.short_description=self.request.data['subTitle']

            if(self.request.data['description']):
                product.description=self.request.data['description']

            if(self.request.data['language']):
                product.language=self.request.data['language']

            if(self.request.data['level']):
                product.level=self.request.data['level']

            if(self.request.data['taught']):
                product.taught=self.request.data['taught']

            if(self.request.data['category']):
                category = Category.objects.get(id=self.request.data['category'])
                product.category=category
            
            if(self.request.data['thumbnail']):
                thumbnail_base64 = self.request.data['thumbnail'].split('base64,', 1 )
                thumbnail_data = b64decode(thumbnail_base64[1])
                thumbnail = ContentFile(thumbnail_data, self.request.data['filename'])
                product.thumbnail=thumbnail
            
            if(self.request.data['video']):
                product.sales_video=self.request.data['video']
            
            if(
                product.title != None and
                product.short_description != None and
                product.description != None and
                product.thumbnail != None and
                product.sales_video != None and
                product.category != None and
                product.language != None and
                product.level != None and
                product.taught != None 
            ):
                product.landing_page = True

            product.save()

            return self.send_response('Episode Video Edited Successful', status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return self.send_error("Episode not found", status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied as e:
            return self.send_error(str(e), status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return self.send_error(str(e), status=status.HTTP_400_BAD_REQUEST)
        

class CreateDetailView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        
        payload = validate_token(request)
        user_id = payload['user_id']
        data = self.request.data
        print(data)
        # try:
        product = get_object_or_404(Product, id=data['productUUID'], author=user_id)

        result = []
        for detail in data['details']:
            obj, created = Details.objects.update_or_create(
                author=user_id, product=product, id=detail['id'],
                defaults={'title': detail['title'], 'body': detail['body'], 'position_id':detail['position_id']},
            )
            product.details.add(obj)
            result.append(obj)

        product_data = get_product_data(product.id, user_id)
        
        return self.send_response(product_data, status=status.HTTP_200_OK)
        # except Product.DoesNotExist:
        #     return self.send_error('product with this ID does not exist or user_id did not match with product author',status=status.HTTP_404_NOT_FOUND)
        # except PermissionDenied as e:
        #     return self.send_error(str(e), status=status.HTTP_403_FORBIDDEN)
        # except:
        #     return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)


class DeleteDetailView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']
        product = get_object_or_404(Product, id=self.request.data['productUUID'], author=user_id)
        detail = Details.objects.get(product=product, id=self.request.data['detailID'],author = user_id)
        if str(product.author) == user_id:
            if Product.objects.filter(details=detail).exists():
                detail.delete()
                product_data = get_product_data(product.id, user_id)
                return self.send_response(product_data, status=status.HTTP_200_OK)
            else:
                return self.send_error('That item does not exist.', status=status.HTTP_404_NOT_FOUND)
        else:
            return self.send_error('Only the product author may delete this', status=status.HTTP_401_UNAUTHORIZED)


class CreateSizeView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        
        payload = validate_token(request)
        user_id = payload['user_id']
        data = self.request.data

        try:
            product = get_object_or_404(Product, id=data['productUUID'], author=user_id)

            result = []
            for size in data['sizes']:
                obj, created = Size.objects.update_or_create(
                    author=user_id, product=product, id=size['id'],
                    defaults={'title': size['title'], 'position_id':size['position_id'],'price': size['price'],'stock': size['stock']},
                )
                product.sizes.add(obj)
                result.append(obj)

            product_data = get_product_data(product.id, user_id)
            return self.send_response(product_data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id did not match with product author',status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied as e:
            return self.send_error(str(e), status=status.HTTP_403_FORBIDDEN)
        except:
            return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)


class DeleteSizeView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']
        product = get_object_or_404(Product, id=self.request.data['productUUID'], author=user_id)
        size = Size.objects.get(product=product, id=self.request.data['id'],author = user_id)
        if str(product.author) == user_id:
            if Product.objects.filter(sizes=size).exists():
                size.delete()
                product_data = get_product_data(product.id, user_id)
                return self.send_response(product_data, status=status.HTTP_200_OK)
            else:
                return self.send_error('That item does not exist.', status=status.HTTP_404_NOT_FOUND)
        else:
            return self.send_error('Only the product author may delete this', status=status.HTTP_401_UNAUTHORIZED)


class CreateColorsView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        
        payload = validate_token(request)
        user_id = payload['user_id']
        data = self.request.data

        try:
            product = get_object_or_404(Product, id=data['productUUID'], author=user_id)

            result = []
            for color in data['colors']:
                obj, created = Color.objects.update_or_create(
                    author=user_id, product=product, id=color['id'],
                    defaults={'title': color['title'], 'position_id':color['position_id'], 'hex':color['hex']},
                )
                product.colors.add(obj)
                result.append(obj)

            product_data = get_product_data(product.id, user_id)
            return self.send_response(product_data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id did not match with product author',status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied as e:
            return self.send_error(str(e), status=status.HTTP_403_FORBIDDEN)
        except:
            return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)


class DeleteColorsView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']
        product = get_object_or_404(Product, id=self.request.data['productUUID'], author=user_id)
        color = Color.objects.get(product=product, id=self.request.data['id'],author = user_id)
        if str(product.author) == user_id:
            if Product.objects.filter(colors=color).exists():
                color.delete()
                product_data = get_product_data(product.id, user_id)
                return self.send_response(product_data, status=status.HTTP_200_OK)
            else:
                return self.send_error('That item does not exist.', status=status.HTTP_404_NOT_FOUND)
        else:
            return self.send_error('Only the product author may delete this', status=status.HTTP_401_UNAUTHORIZED)
 

class UpdateWhatLearntView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):

        payload = validate_token(request)
        user_id = payload['user_id']
        data = self.request.data

        try:
            product = get_object_or_404(Product, id=data['productUUID'], author=user_id)

            result = []
            for whatlearnt in data['whatlearntList']:
                obj, created = WhatLearnt.objects.update_or_create(
                    id=whatlearnt['id'], user=user_id, product=product,
                    defaults={'title': whatlearnt['title'], 'position_id':whatlearnt['position_id']},
                )
                result.append(obj)

                if(created):
                    product.what_learnt.add(obj)

            product_data = get_product_data(product.id, user_id)

            return self.send_response(product_data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id did not match with product author',status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied as e:
            return self.send_error(str(e), status=status.HTTP_403_FORBIDDEN)
        except:
            return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)


class DeleteWhatLearntView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']
        product = get_object_or_404(Product, id=self.request.data['productUUID'], author=user_id)
        whatLearnt = WhatLearnt.objects.get(product=product, id=self.request.data['id'],user = user_id)
        if str(product.author) == user_id:
            if Product.objects.filter(what_learnt=whatLearnt).exists():
                whatLearnt.delete()
                product_data = get_product_data(product.id, user_id)
                return self.send_response(product_data, status=status.HTTP_200_OK)
            else:
                return self.send_error('That item does not exist.', status=status.HTTP_404_NOT_FOUND)
        else:
            return self.send_error('Only the product author may delete this', status=status.HTTP_401_UNAUTHORIZED)


class UpdateWhoIsForView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):

        payload = validate_token(request)
        user_id = payload['user_id']
        data = self.request.data

        try:
            product = get_object_or_404(Product, id=data['productUUID'], author=user_id)

            result = []
            for whoIsFor in data['whoIsForList']:
                if whoIsFor['title'] == "":
                    continue 
                obj, created = WhoIsFor.objects.update_or_create(
                    id=whoIsFor['id'], user=user_id, product=product,
                    defaults={'title': whoIsFor['title'], 'position_id':whoIsFor['position_id']},
                )
                result.append(obj)

                if(created):
                    product.who_is_for.add(obj)

            product_data = get_product_data(product.id, user_id)

            return self.send_response(product_data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id did not match with product author',status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied as e:
            return self.send_error(str(e), status=status.HTTP_403_FORBIDDEN)
        except:
            return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)


class DeleteWhoIsForView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']

        try:
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
        except Product.DoesNotExist:
            return self.send_error("Product not found.", status=status.HTTP_404_NOT_FOUND)
        
        try:
            whoIsFor = WhoIsFor.objects.get(product=product, id=self.request.data['id'],user = user_id)
        except WhoIsFor.DoesNotExist:
            return self.send_error("Requisite not found.", status=status.HTTP_404_NOT_FOUND)
        
        if str(product.author) == user_id:
            if Product.objects.filter(who_is_for=whoIsFor).exists():
                whoIsFor.delete()
                product_data = get_product_data(product.id, user_id)
                return self.send_response(product_data, status=status.HTTP_200_OK)
            else:
                return self.send_error('That item does not exist.', status=status.HTTP_404_NOT_FOUND)
        else:
            return self.send_error('Only the product author may delete this', status=status.HTTP_401_UNAUTHORIZED)


class UpdateRequisiteView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):

        payload = validate_token(request)
        user_id = payload['user_id']
        data = self.request.data

        try:
            product = get_object_or_404(Product, id=data['productUUID'], author=user_id)

            result = []
            for requisite in data['requisitesList']:
                if requisite['title'] == "":
                    continue 
                obj, created = Requisite.objects.update_or_create(
                    id=requisite['id'], user=user_id, product=product,
                    defaults={'title': requisite['title'], 'position_id':requisite['position_id']},
                )
                result.append(obj)

                if(created):
                    product.requisites.add(obj)

            product_data = get_product_data(product.id, user_id)

            return self.send_response(product_data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id did not match with product author',status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied as e:
            return self.send_error(str(e), status=status.HTTP_403_FORBIDDEN)
        except:
            return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)


class DeleteRequisiteView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']

        try:
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
        except Product.DoesNotExist:
            return self.send_error("Product not found.", status=status.HTTP_404_NOT_FOUND)

        try:
            requisite = Requisite.objects.get(product=product, id=self.request.data['id'],user = user_id)
        except Requisite.DoesNotExist:
            return self.send_error("Requisite not found.", status=status.HTTP_404_NOT_FOUND)

        if str(product.author) == user_id:
            if Product.objects.filter(requisites=requisite).exists():
                requisite.delete()
                product_data = get_product_data(product.id, user_id)
                return self.send_response(product_data, status=status.HTTP_200_OK)
            else:
                return self.send_error('That item does not exist.', status=status.HTTP_404_NOT_FOUND)
        else:
            return self.send_error('Only the product author may delete this', status=status.HTTP_401_UNAUTHORIZED)
        

class UpdateWeightView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):

        payload = validate_token(request)
        user_id = payload['user_id']
        data = self.request.data

        # try:
        product = get_object_or_404(Product, id=data['productUUID'], author=user_id)

        result = []
        for weight in data['weightsList']:
            if weight['title'] == "":
                continue 
            obj, created = Weight.objects.update_or_create(
                id=weight['id'], author=user_id, product=product,
                defaults={'title': weight['title'], 'position_id':weight['position_id'],'price':weight['price'],'stock':weight['stock']},
            )
            result.append(obj)

            if(created):
                product.weights.add(obj)

        product_data = get_product_data(product.id, user_id)

        return self.send_response(product_data, status=status.HTTP_200_OK)
        # except Product.DoesNotExist:
        #     return self.send_error('product with this ID does not exist or user_id did not match with product author',status=status.HTTP_404_NOT_FOUND)
        # except PermissionDenied as e:
        #     return self.send_error(str(e), status=status.HTTP_403_FORBIDDEN)
        # except:
        #     return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)


class DeleteWeightView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']

        try:
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
        except Product.DoesNotExist:
            return self.send_error("Product not found.", status=status.HTTP_404_NOT_FOUND)

        try:
            weight = Weight.objects.get(product=product, id=self.request.data['id'],author = user_id)
        except Weight.DoesNotExist:
            return self.send_error("Requisite not found.", status=status.HTTP_404_NOT_FOUND)

        if str(product.author) == user_id:
            if Product.objects.filter(weights=weight).exists():
                weight.delete()
                product_data = get_product_data(product.id, user_id)
                return self.send_response(product_data, status=status.HTTP_200_OK)
            else:
                return self.send_error('That item does not exist.', status=status.HTTP_404_NOT_FOUND)
        else:
            return self.send_error('Only the product author may delete this', status=status.HTTP_401_UNAUTHORIZED)



class UpdateMaterialView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):

        payload = validate_token(request)
        user_id = payload['user_id']
        data = self.request.data

        try:
            product = get_object_or_404(Product, id=data['productUUID'], author=user_id)

            result = []

            for material in data['materialsList']:
                if material['title'] == "":
                    continue
                if material['image']:
                    format, imgstr = material['image'].split(';base64,')
                    ext = format.split('/')[-1]
                    data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)
                    # validate the file type
                    if ext not in ['jpg', 'jpeg', 'png']:
                        raise ValidationError('Invalid file type. Only jpeg and png are allowed.')
                    # validate the file size
                    if data.size > 2000000:
                        raise ValidationError('File size should be less than 2MB')
                    # validate the file dimensions
                    # img = Image.open(data)
                    # width, height = img.size
                    # if width != 64 or height != 64:
                    #     raise ValidationError('Invalid image dimensions. Only 64x64 pixels images are allowed.')
                    material['image'] = data
                obj, created = Material.objects.update_or_create(
                    id=material['id'], author=user_id, product=product,
                    defaults={
                    'title': material['title'], 
                    'position_id':material['position_id'],
                    'image':material['image'],
                    'stock':material['stock'],
                    'price':material['price']
                    },
                )
                result.append(obj)

                if(created):
                    product.materials.add(obj)

            product_data = get_product_data(product.id, user_id)

            return self.send_response(product_data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id did not match with product author',status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied as e:
            return self.send_error(str(e), status=status.HTTP_403_FORBIDDEN)
        except:
            return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)


class DeleteMaterialView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']

        try:
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
        except Product.DoesNotExist:
            return self.send_error("Product not found.", status=status.HTTP_404_NOT_FOUND)

        try:
            material = Material.objects.get(product=product, id=self.request.data['id'],author = user_id)
        except Material.DoesNotExist:
            return self.send_error("Requisite not found.", status=status.HTTP_404_NOT_FOUND)

        if str(product.author) == user_id:
            if Product.objects.filter(materials=material).exists():
                material.delete()
                product_data = get_product_data(product.id, user_id)
                return self.send_response(product_data, status=status.HTTP_200_OK)
            else:
                return self.send_error('That item does not exist.', status=status.HTTP_404_NOT_FOUND)
        else:
            return self.send_error('Only the product author may delete this', status=status.HTTP_401_UNAUTHORIZED)
        

def parse_image_query_dict(query_dict):
    data = dict(query_dict)
    images_data = {}
    for key, value in data.items():
        if key.startswith("imagesList"):
            index, attr = key.split("].", 1)
            index = int(index.split("[")[1])
            if index not in images_data:
                images_data[index] = {}
            images_data[index][attr] = value[0]
        else:
            data[key] = value[0]

    data['imagesList'] = [v for k, v in images_data.items()]
    return data

class UpdateImageView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']
        query_dict_data = request.POST  # Get the QueryDict data from the POST request
        data = parse_image_query_dict(query_dict_data)  # Convert the QueryDict to the desired dictionary format
        try:
            product = get_object_or_404(Product, id=data['productUUID'], author=user_id)

            allowed_extensions = ['jpg', 'jpeg', 'png']
            
            result = []
            for image in data['imagesList']:
                defaults = {'title': image['title'], 'position_id': image['position_id']}
                if ';base64,' in image['file']:
                    format, imgstr = image['file'].split(';base64,')
                    ext = format.split('/')[-1]
                    data = ContentFile(base64.b64decode(imgstr))

                    # Generate a unique file name
                    file_name, file_ext = os.path.splitext(image['title'])
                    unique_name = f"{file_name}_{secrets.token_hex(8)}{file_ext}"
                    data.name = unique_name
                    
                    # validate the file type
                    if ext not in allowed_extensions:
                        raise ValidationError('Invalid file type. Only jpeg and png are allowed.')

                    # validate the file size
                    if data.size > 2000000:
                        raise ValidationError('File size should be less than 2MB')
                    
                    defaults['file'] = data
                elif image['file'].startswith('/media/') or image['file'].startswith('http'):
                    # Validate the file type based on the URL
                    file_name, file_ext = os.path.splitext(image['file'])
                    if file_ext[1:] not in allowed_extensions:
                        raise ValidationError('Invalid file type. Only jpeg and png are allowed.')
                else:
                    raise ValidationError('Invalid image file format.')

                obj, created = Image.objects.update_or_create(
                    id=image['id'], author=user_id, product=product,
                    defaults=defaults,
                )
                result.append(obj)

                if created:
                    product.images.add(obj)

            product_data = get_product_data(product.id, user_id)
            return self.send_response(product_data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('Course with this ID does not exist or user_id did not match with course author',status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied as e:
            return self.send_error(str(e), status=status.HTTP_403_FORBIDDEN)
        except:
            return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)


class DeleteImageView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']

        try:
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
        except Product.DoesNotExist:
            return self.send_error("Product not found.", status=status.HTTP_404_NOT_FOUND)

        try:
            image = Image.objects.get(product=product, id=self.request.data['id'],author = user_id)
        except Image.DoesNotExist:
            return self.send_error("Image not found.", status=status.HTTP_404_NOT_FOUND)

        if str(product.author) == user_id:
            if Product.objects.filter(images=image).exists():
                image.delete()
                product_data = get_product_data(product.id, user_id)
                return self.send_response(product_data, status=status.HTTP_200_OK)
            else:
                return self.send_error('That item does not exist.', status=status.HTTP_404_NOT_FOUND)
        else:
            return self.send_error('Only the product author may delete this', status=status.HTTP_401_UNAUTHORIZED)


def parse_video_query_dict(query_dict):
    data = dict(query_dict)
    videos_data = {}
    for key, value in data.items():
        if key.startswith("videosList"):
            index, attr = key.split("].", 1)
            index = int(index.split("[")[1])
            if index not in videos_data:
                videos_data[index] = {}
            videos_data[index][attr] = value[0]
        else:
            data[key] = value[0]

    data['videosList'] = [v for k, v in videos_data.items()]
    return data
class UpdateVideoView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']
        query_dict_data = request.POST  # Get the QueryDict data from the POST request
        data = parse_video_query_dict(query_dict_data)  # Convert the QueryDict to the desired dictionary format
        try:
            product = get_object_or_404(Product, id=data['productUUID'], author=user_id)
            product_data = get_product_data(product.id, user_id)

            allowed_extensions = ['mp4', 'm4v', 'mpeg', 'm4p', 'asf', 'mkv', 'webm']

            result = []
            for video in data['videosList']:
                defaults = {'title': video['title'], 'position_id': video['position_id']}
                if ';base64,' in video['file']:
                    format, videostr = video['file'].split(';base64,')
                    ext = format.split('/')[-1]
                    data = ContentFile(base64.b64decode(videostr))

                    # Generate a unique file name
                    file_name, file_ext = os.path.splitext(video['title'])
                    unique_name = f"{file_name}_{secrets.token_hex(8)}{file_ext}"
                    data.name = unique_name

                    # validate the file type
                    if ext not in allowed_extensions:
                        raise ValidationError('Invalid file type. Only mp4,m4v,mpeg,m4p,asf,mkv,webm are allowed.')

                    # validate the file size
                    if data.size > 2 * 1024 * 1024 * 1024:
                        raise ValidationError('File size should be less than 2GB')

                    defaults['file'] = data
                elif video['file'].startswith('/media/') or video['file'].startswith('http'):
                    # Validate the file type based on the URL
                    file_name, file_ext = os.path.splitext(video['file'])
                    if file_ext[1:] not in allowed_extensions:
                        raise ValidationError('Invalid file type. Only mp4,m4v,mpeg,m4p,asf,mkv,webm are allowed.')
                else:
                    raise ValidationError('Invalid video file format.')

                obj, created = Video.objects.update_or_create(
                    id=video['id'], author=user_id, product=product,
                    defaults=defaults,
                )
                result.append(obj)

                if created:
                    product.videos.add(obj)

            product_data = get_product_data(product.id, user_id)
            return self.send_response(product_data, status=status.HTTP_200_OK)

        except Product.DoesNotExist:
            return self.send_error('Course with this ID does not exist or user_id did not match with course author',status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied as e:
            return self.send_error(str(e), status=status.HTTP_403_FORBIDDEN)
        except:
            return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)


class DeleteVideoView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']

        try:
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
        except Product.DoesNotExist:
            return self.send_error("Product not found.", status=status.HTTP_404_NOT_FOUND)

        try:
            video = Video.objects.get(product=product, id=self.request.data['id'],author = user_id)
        except Video.DoesNotExist:
            return self.send_error("Requisite not found.", status=status.HTTP_404_NOT_FOUND)

        if str(product.author) == user_id:
            if Product.objects.filter(videos=video).exists():
                video.delete()
                product_data = get_product_data(product.id, user_id)
                return self.send_response(product_data, status=status.HTTP_200_OK)
            else:
                return self.send_error('That item does not exist.', status=status.HTTP_404_NOT_FOUND)
        else:
            return self.send_error('Only the product author may delete this', status=status.HTTP_401_UNAUTHORIZED)


class UpdateDocumentView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):

        payload = validate_token(request)
        user_id = payload['user_id']
        data = self.request.data

        try:
            product = get_object_or_404(Product, id=data['productUUID'], author=user_id)

            result = []
            for document in data['documentsList']:
                if document['title'] == "":
                    continue 
                obj, created = Documents.objects.update_or_create(
                    id=document['id'], user=user_id, product=product,
                    defaults={'title': document['title'], 'position_id':document['position_id'],'file':document['file']},
                )
                result.append(obj)

                if(created):
                    product.documents.add(obj)

            product_data = get_product_data(product.id, user_id)

            return self.send_response(product_data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id did not match with product author',status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied as e:
            return self.send_error(str(e), status=status.HTTP_403_FORBIDDEN)
        except:
            return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)


class DeleteDocumentView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']

        try:
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
        except Product.DoesNotExist:
            return self.send_error("Product not found.", status=status.HTTP_404_NOT_FOUND)

        try:
            document = Documents.objects.get(product=product, id=self.request.data['id'],user = user_id)
        except Requisite.DoesNotExist:
            return self.send_error("Requisite not found.", status=status.HTTP_404_NOT_FOUND)

        if str(product.author) == user_id:
            if Product.objects.filter(documents=document).exists():
                document.delete()
                product_data = get_product_data(product.id, user_id)
                return self.send_response(product_data, status=status.HTTP_200_OK)
            else:
                return self.send_error('That item does not exist.', status=status.HTTP_404_NOT_FOUND)
        else:
            return self.send_error('Only the product author may delete this', status=status.HTTP_401_UNAUTHORIZED)







class UpdateProductView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']
        data = self.request.data

        try:
            product = get_object_or_404(Product, id=data['productUUID'], author=user_id)
            product_data = data['productBody']

            # updating fields based on user inputs
            update_data = {}
            if product_data.get('title'):
                update_data['title'] = product_data['title']
            if product_data.get('description'):
                update_data['description'] = product_data['description']
            if product_data.get('subTitle'):
                update_data['short_description'] = product_data['subTitle']

            if product_data.get('stock'):
                if product.nft_address=='0':
                    update_data['quantity'] = product_data['stock']
                if product.nft_address!='0':
                    print('Call Contract Change Stock')
                    # # Fetch ABI
                    # abi = get_polygon_contract_abi(product.nft_address)
                    ticket_location = os.path.join(settings.BASE_DIR, 'contracts', 'marketplace', 'ticket.sol')
                    with open(os.path.join(ticket_location, 'Ticket.json'), "r") as f:
                        contract_json = json.load(f)
                    abi = contract_json['abi']
                    ticket_contract_instance = polygon_web3.eth.contract(abi=abi, address=product.nft_address)

                    seller_private_key = decrypt_polygon_private_key(payload['address'])
                    print(f'Editing Stock for {product.nft_address}')
                    # Create Approve Buyer as Discounted method
                    set_stock_txn = ticket_contract_instance.functions.setStock(int(product.token_id), int(product_data['stock'])).buildTransaction(
                        {
                            "gasPrice": polygon_web3.eth.gas_price,
                            "from": payload['polygon_address'],
                            "nonce": polygon_web3.eth.getTransactionCount(payload['polygon_address']),
                        }
                    )
                    signed_tx = polygon_web3.eth.account.sign_transaction(set_stock_txn, private_key=seller_private_key)
                    tx_hash = polygon_web3.eth.send_raw_transaction(signed_tx.rawTransaction)
                    txReceipt = polygon_web3.eth.wait_for_transaction_receipt(tx_hash)

                    if txReceipt.get('status') == 0:
                        return self.send_error('Error Editing Product Stock')


            if product_data.get('language'):
                update_data['language'] = product_data['language']
            if product_data.get('level'):
                update_data['level'] = product_data['level']
            if product_data.get('category'):
                category = get_object_or_404(Category, id=int(product_data['category']))  # Use get_object_or_404
                update_data['category'] = category

            Product.objects.filter(id=product.id).update(**update_data)

            updated_product = Product.objects.get(id=product.id)
            serialized_data = get_product_data(updated_product.id, user_id)
            return self.send_response(serialized_data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id did not match with product author',status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied as e:
            return self.send_error(str(e), status=status.HTTP_403_FORBIDDEN)
        except:
            return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)



class DeleteProductView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']

        try:
            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)
        except Product.DoesNotExist:
            return self.send_error("Product not found.", status=status.HTTP_404_NOT_FOUND)

        try:
            document = Documents.objects.get(product=product, id=self.request.data['id'],user = user_id)
        except Requisite.DoesNotExist:
            return self.send_error("Requisite not found.", status=status.HTTP_404_NOT_FOUND)

        if str(product.author) == user_id:
            if Product.objects.filter(documents=document).exists():
                document.delete()
                product_data = get_product_data(product.id, user_id)
                return self.send_response(product_data, status=status.HTTP_200_OK)
            else:
                return self.send_error('That item does not exist.', status=status.HTTP_404_NOT_FOUND)
        else:
            return self.send_error('Only the product author may delete this', status=status.HTTP_401_UNAUTHORIZED)
        



class UpdateProductPricingView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']
        data = self.request.data
        print(data)

        try:
            product = get_object_or_404(Product, id=data['productUUID'], author=user_id)
            product_data = json.loads(data['productBody'])


            # updating fields based on user inputs
            update_data = {}
            if product_data.get('price'):
                update_data['price'] = product_data['price']

            if product_data.get('comparePrice'):
                update_data['compare_price'] = product_data['comparePrice']

            if product_data.get('discountUntil'):
                update_data['discount_until'] = product_data['discountUntil']

            if product_data.get('discount'):
                update_data['discount'] = product_data['discount']

            # update the fields in the database
            Product.objects.filter(id=product.id).update(**update_data)

            # get the updated product data
            updated_product = Product.objects.get(id=product.id)
            serialized_data = get_product_data(updated_product.id, user_id)
            return self.send_response(serialized_data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id did not match with product author',status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied as e:
            return self.send_error(str(e), status=status.HTTP_403_FORBIDDEN)
        except:
            return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)


class UpdateProductWelcomeMessage(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']
        data = self.request.data

        try:
            product = get_object_or_404(Product, id=data['productUUID'], author=user_id)

            product.welcome_message = data['message']
            product.save()

            product_data = get_product_data(product.id, user_id)
            return self.send_response(product_data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id did not match with product author',status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied as e:
            return self.send_error(str(e), status=status.HTTP_403_FORBIDDEN)
        except:
            return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)

class UpdateProductCongratsMessage(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']
        data = self.request.data

        try:
            product = get_object_or_404(Product, id=data['productUUID'], author=user_id)

            product.congrats_message = data['message']
            product.save()

            product_data = get_product_data(product.id, user_id)
            return self.send_response(product_data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('product with this ID does not exist or user_id did not match with product author',status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied as e:
            return self.send_error(str(e), status=status.HTTP_403_FORBIDDEN)
        except:
            return self.send_error('Bad Request',status=status.HTTP_400_BAD_REQUEST)
        

class PublishProductiew(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        # try:
            payload = validate_token(request)
            user_id = payload['user_id']

            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)

            publish = self.request.data['bool']
            if publish==True:
                product.status = 'published'
                product.save()
                product_data = get_product_data(product.id, user_id)
                return self.send_response(product_data, status=status.HTTP_200_OK)
            else:
                product.status = 'draft'
                product.save()
                product_data = get_product_data(product.id, user_id)
                return self.send_response(product_data, status=status.HTTP_200_OK)



class DeleteProductView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):

        payload = validate_token(request)
        user_id = payload['user_id']

        try:

            product = get_object_or_404(Product, id=self.request.data['productUUID'], author=user_id)
            images=Image.objects.filter(product=product)
            videos=Video.objects.filter(product=product)
            documents=Documents.objects.filter(product=product)

            for image in images:
                image.delete()
                
            for video in videos:
                video.delete()

            for document in documents:
                document.delete()

            product.delete()
            return self.send_response('Product dleted', status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
                return self.send_error("Document not found", status=status.HTTP_404_NOT_FOUND)
        except ValidationError as v:
            return self.send_error(str(v), status=status.HTTP_400_BAD_REQUEST)
        except Http404 as h:
            return self.send_error(str(h), status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return self.send_error(str(e), status=status.HTTP_400_BAD_REQUEST)
        

    
class EditSlugView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        try:
            payload = validate_token(request)
            user_id = payload['user_id']

            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)

            slug = self.request.data['slug']

            product.slug = slug
            product.slug_changes -= 1
            product.save()

            product_data = get_product_data(product.id, user_id)
            return self.send_response(product_data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('Product with this ID does not exist or user_id not match with product author',
                                   status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)


class EditKeywordsView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, format=None):
        try:
            payload = validate_token(request)
            user_id = payload['user_id']

            product = Product.objects.get(id=self.request.data['productUUID'], author=user_id)

            keywords = self.request.data['keywords']

            product.keywords = keywords
            product.save()

            product_data = get_product_data(product.id, user_id)
            return self.send_response(product_data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return self.send_error('Product with this ID does not exist or user_id not match with product author',
                                   status=status.HTTP_404_NOT_FOUND)
        except:
            return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)
        



class SearchProductsView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):

        cache_key = f"search_products_{request.META['QUERY_STRING']}"
        cached_result = cache.get(cache_key)

        if cached_result:
            return self.paginate_response(request, cached_result)
        
        products = Product.objects.all()

        search = request.query_params.get('search', None)
        if search and 'null' not in search:
            products = Product.objects.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) | 
                Q(short_description__icontains=search) | 
                Q(keywords__icontains=search) |
                Q(category__name__icontains=search) |
                Q(category__title__icontains=search) |
                Q(category__description__icontains=search) 
            )

        # Get Order parameter
        order_by = request.query_params.get('order', '-date_created')
        if order_by == 'oldest':
            products = products.order_by('date_created')
        elif order_by == 'desc':
            products = products.order_by('title')
        elif order_by == 'asc':
            products = products.order_by('-title')
        
        else:
            products = products.order_by(order_by)
        
        filter_by = request.query_params.get('filter', None)
        if filter_by == 'views':
            products = products.order_by('-views')
        elif filter_by == 'sold':
            products = products.order_by('-sold')
        elif filter_by == 'date_created':
            products = products.order_by('-published')
        elif filter_by == 'price':
            if order_by == 'asc':
                products = products.order_by('price')
            elif order_by == 'desc':
                products = products.order_by('-price')
        elif order_by == 'impressions':
            products = products.order_by('-impressions')
        elif order_by == 'clickThroughRate':
            products = products.order_by('-clickThroughRate')
        elif order_by == 'purchases':
            products = products.order_by('-purchases')
        elif order_by == 'conversion_rate':
            products = products.order_by('-conversion_rate')
        elif order_by == 'avg_time_on_page':
            products = products.order_by('-avg_time_on_page')

        category = request.query_params.getlist('category', None)
        if category and '' not in category:
            q_obj = Q()
            for cat in category:
                if cat.isdigit():  # If the value is a number
                    q_obj |= Q(category_id=cat) | Q(sub_category_id=cat) | Q(topic_id=cat)
                elif validate_slug(cat) is None:  # If the value is a slug
                    q_obj |= Q(category__slug=cat) | Q(sub_category__slug=cat) | Q(topic__slug=cat)
            products = products.filter(q_obj)

        rating = request.query_params.get('rating', None)
        products = products.annotate(avg_rating=Avg('rating__rate_number'))
        if rating and rating != 'undefined':
            products = products.filter(avg_rating__gte=float(rating))
        else:
            products = products.order_by('-avg_rating')

        pricing = request.query_params.get('pricing', None)
        if pricing and pricing != 'undefined':
            if pricing == 'Free':
                products = products.filter(price__lte=0)
            elif pricing == 'Paid':
                products = products.filter(price__gt=0)
        
        author = request.query_params.get('author', None)
        if author and author != '' and author != 'undefined'and author != 'null':
            products = products.filter(author=author)

        serializer = ProductListSerializer(products, many=True)
        # Cache the result
        cache.set(cache_key, serializer.data, 1800)  # Cache for 300 seconds
        return self.paginate_response(request, serializer.data)