from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import status
from .models import Coupon, FixedPriceCoupon, PercentageCoupon
from .serializers import CouponSerializer, FixedPriceCouponSerializer, PercentageCouponSerializer
from django.db.models import Q
from django.contrib.contenttypes.models import ContentType
from rest_framework_api.views import StandardAPIView
from django.http import Http404
from rest_framework.exceptions import ValidationError
from django.core.exceptions import ObjectDoesNotExist, PermissionDenied
import jwt
from django.core.cache import cache

import requests
from django.conf import settings
tax = settings.TAXES
secret_key = settings.SECRET_KEY
import os

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


class CheckCouponView(StandardAPIView):
    def get(self, request, format=None):
        coupon_name = request.query_params.get('name')

        try:
            coupon = Coupon.objects.get(name=coupon_name)

            if(coupon.fixed_price_coupon):
                if coupon.fixed_price_coupon.uses > 0:
                    serialized_coupon = CouponSerializer(coupon).data
                    return self.send_response({
                        'coupon':serialized_coupon,
                        'type':'fixed',
                        'discount':coupon.fixed_price_coupon.discount_price,
                    }, status=status.HTTP_200_OK)
                else:
                    return self.send_error('Coupon code has no uses left',status=status.HTTP_404_NOT_FOUND)

            if(coupon.percentage_coupon):
                if coupon.percentage_coupon.uses > 0: 
                    serialized_coupon = CouponSerializer(coupon).data
                    return self.send_response({
                        'coupon':serialized_coupon,
                        'type':'percentage',
                        'discount':coupon.percentage_coupon.discount_percentage,
                    }, status=status.HTTP_200_OK)
                else:
                    return self.send_error('Coupon code has no uses left',status=status.HTTP_404_NOT_FOUND)
        except ObjectDoesNotExist:
            return self.send_error("Coupon not found", status=status.HTTP_404_NOT_FOUND)


class CreateCouponView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']

        try:
            data = self.request.data
            print(data)
            name = data['name']
            content_type = data['content_type']
            object_id = data['object_id'][0]

            if self.request.data.get('fixed_price_coupon', None):
                fixed_price_coupon = data['fixed_price_coupon']
                discount_price = fixed_price_coupon['discount_price']
                uses = fixed_price_coupon['uses']
                fixed_price_coupon = FixedPriceCoupon.objects.create(discount_price=discount_price,uses=uses)
                coupon = Coupon(
                    name=name,
                    user=user_id,
                    fixed_price_coupon=fixed_price_coupon,
                    content_type=content_type,
                    object_id=object_id
                )
                coupon.save()

            elif self.request.data.get('percentage_coupon', None):
                percentage_coupon = data['percentage_coupon']
                discount_percentage = percentage_coupon['discount_percentage']
                uses = percentage_coupon['uses']
                percentage_coupon = PercentageCoupon.objects.create(discount_percentage=discount_percentage,uses=uses)
                coupon = Coupon(
                    name=name,
                    user=user_id,
                    percentage_coupon=percentage_coupon,
                    content_type=content_type,
                    object_id=object_id
                )
                coupon.save()
                # Update the cache for the list of coupons
                cache_key = f'coupons_{user_id}_{content_type}_{object_id}'
                cached_coupons = cache.get(cache_key)
                if cached_coupons is not None:
                    coupon_data = CouponSerializer(coupon).data
                    cached_coupons.append(coupon_data)
                    cache.set(cache_key, cached_coupons)
            return self.send_response('Coupon created', status=status.HTTP_201_CREATED)
        except KeyError as e:
            return self.send_error("Missing required field: " + str(e), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return self.send_error("Error: " + str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListCouponsView(StandardAPIView):
    serializer_class = CouponSerializer

    def get(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']
        type = request.query_params.get('type')
        object = request.query_params.get('object')

        # Generate a cache key based on the user ID, type, and object
        cache_key = f'coupons_{user_id}_{type}_{object}'

        # Try to get the serialized coupons data from the cache
        serialized_coupons = cache.get(cache_key)

        # If the serialized coupons data is not in the cache, fetch it and store it in the cache
        if serialized_coupons is None:
            try:
                if object:
                    coupons = Coupon.objects.filter(user=user_id, content_type=type, object_id=object)
                else:
                    coupons = Coupon.objects.filter(user=user_id)

                serializer = self.serializer_class(coupons, many=True)
                serialized_coupons = serializer.data

                # Store the serialized coupons data in the cache with a specified timeout
                cache_timeout = 60 * 5  # Cache the data for 5 minutes (adjust as needed)
                cache.set(cache_key, serialized_coupons, cache_timeout)

            except Coupon.DoesNotExist:
                return self.send_error('No coupons found',status=status.HTTP_404_NOT_FOUND)
            except:
                return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)

        return self.paginate_response(request, serialized_coupons)


class DeleteCouponView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']

        try:

            coupon = Coupon.objects.get(id=self.request.data['couponUUID'],user=user_id)

            if(coupon.fixed_price_coupon):
                coupon.fixed_price_coupon.delete()
                return self.send_response('Coupon deleted',status=status.HTTP_200_OK)
            if(coupon.percentage_coupon):
                coupon.percentage_coupon.delete()
                return self.send_response('Coupon deleted',status=status.HTTP_200_OK)
    
        except Coupon.DoesNotExist:
            return self.send_error('No coupons found',status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return self.send_error(str(e), status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as v:
            return self.send_error(str(v), status=status.HTTP_400_BAD_REQUEST)
        except:
            return self.send_error('Bad Request', status=status.HTTP_400_BAD_REQUEST)
        

class DetailCouponView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, id, format=None):
        # Generate a cache key based on the coupon ID
        cache_key = f'coupon_{id}'

        # Try to get the serialized coupon data from the cache
        serialized_coupon = cache.get(cache_key)

        # If the serialized coupon data is not in the cache, fetch it and store it in the cache
        if serialized_coupon is None:
            coupon = Coupon.objects.get(id=id)
            serialized_coupon = CouponSerializer(coupon).data

            # Store the serialized coupon data in the cache with a specified timeout
            cache_timeout = 60 * 5  # Cache the data for 5 minutes (adjust as needed)
            cache.set(cache_key, serialized_coupon, cache_timeout)

        return self.send_response(serialized_coupon, status=status.HTTP_200_OK)