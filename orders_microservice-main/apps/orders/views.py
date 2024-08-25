from rest_framework.response import Response
from rest_framework import permissions, status
import jwt
import requests
from rest_framework_api.views import StandardAPIView
from django.conf import settings
secret_key = settings.SECRET_KEY
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from core.producer import producer
import json
from django.db.models import Q

courses_ms_url = settings.COURSES_MS_URL
products_ms_url = settings.PRODUCTS_MS_URL

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


class CreateOrderView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        payload = validate_token(request)
        user_id = payload['user_id']
        data = request.data
        userID = data['userID']
        if user_id != userID:
            return self.send_error('User must be logged in', status=status.HTTP_401_UNAUTHORIZED)

        cart_items = data['cartItems']
        courses = []
        products = []

        if not cart_items:
            raise ValidationError('No cart items provided.')

        # Create the order and order items inside a transaction
        with transaction.atomic():
            order = Order.objects.create(user=user_id)
            for item in cart_items:

                if item.get('course'):
                    courses.append(item)
                elif item.get('product'):
                    products.append(item)

            for object in courses:
                course_id = object['course'] if object['course'] else None
                course_response = requests.get(f'{courses_ms_url}/api/courses/get/' + object['course'] + '/').json()
                if not course_id:
                    raise ValidationError('No course ID provided for item.')
                order_item = OrderItem.objects.create(
                    course=course_id,
                    order=order,
                    name=course_response.get('results').get('details').get('title'),
                    price=course_response.get('results').get('details').get('price'),
                    count=item.get('count') or 1
                )
                order.order_items.add(order_item)
            
            for object in products:
                product_id = object['product'] if object['product'] else None
                if not product_id:
                    raise ValidationError('No product ID provided for item.')
                shipping_id = object['shipping'] if object['shipping'] else None
                if not shipping_id:
                    raise ValidationError('No Shipping ID provided for item.')

                # Fetch product details from product API endpoint
                product_response = requests.get(f'{products_ms_url}/api/products/get/{product_id}/').json()
                shipping_response = requests.get(f"{products_ms_url}/api/shipping/get/{shipping_id}/").json()

                # Create OrderItem instance for the product
                order_item = OrderItem.objects.create(
                    product=product_response.get('results').get('details').get('id'),
                    order=order,
                    name=product_response.get('results').get('details').get('title'),
                    price=product_response.get('results').get('details').get('price'),
                    count=object['count'] or 1,
                    color=object['color'],
                    size=object['size'],
                    shipping=object['shipping'],
                    shipping_time=shipping_response.get('results').get('time'),
                    shipping_name=shipping_response.get('results').get('title'),
                    shipping_price=shipping_response.get('results').get('price'),
                    buyer=user_id,
                    vendor=product_response.get('results').get('details').get('author'),
                    address_line_1=data['deliveryAddress']['addressLine1'],
                    address_line_2=data['deliveryAddress']['addressLine2'],
                    city=data['deliveryAddress']['city'],
                    state_province_region=data['deliveryAddress']['stateProvinceRegion'],
                    postal_zip_code=data['deliveryAddress']['postalZipCode'],
                    country_region=data['deliveryAddress']['countryRegion'],
                    telephone_number=data['deliveryAddress']['telephoneNumber'],
                    # Add any additional fields as needed
                )

                # Add the OrderItem instance to the order
                order.order_items.add(order_item)

                # IF AGreed, Send information to Kafka Consumer Auth
                if data['agreed']:
                    delivery_address_data = {
                        'user_id': data['userID'],
                        'delivery_address': data['deliveryAddress']
                    }
                    producer.produce(
                        'user_contacts',
                        key='store_delivery_address',
                        value=json.dumps(delivery_address_data).encode('utf-8')
                    )
                    producer.flush()

        # Serialize and return the order
        serializer = OrderSerializer(order)
        return self.send_response(serializer.data, status=status.HTTP_200_OK)
    


class ListOrdersView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        payload = validate_token(request)
        user_id = payload['user_id']
        orders = Order.objects.filter(user=user_id)

        # Get order parameter
        order_by = request.query_params.get('order', '-date_issued')
        if order_by == 'oldest':
            orders = orders.order_by('date_issued')
        elif order_by == 'min_amount':
            orders = orders.order_by('amount')
        elif order_by == 'max_amount':
            orders = orders.order_by('-amount')
        else:
            orders = orders.order_by(order_by)

        # Get filter parameters
        filter_by = request.query_params.get('filter', None)
        if filter_by == 'city':
            orders = orders.filter(city__icontains=filter_by)
        if filter_by == 'status':
            orders = orders.filter(status=filter_by)

        # Get search parameter
        search_query = request.query_params.get('search', None)
        if search_query:
            orders = orders.filter(
                Q(full_name__icontains=search_query) |
                Q(transaction_id__icontains=search_query) |
                Q(address_line_1__icontains=search_query) |
                Q(address_line_2__icontains=search_query) |
                Q(city__icontains=search_query) |
                Q(state_province_region__icontains=search_query) |
                Q(postal_zip_code__icontains=search_query)
            )

        serializer = OrderSerializer(orders, many=True).data
        return self.paginate_response(request, serializer)
    

class ListOrderItemsView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        payload = validate_token(request)
        user_id = payload['user_id']
        order_items = OrderItem.objects.filter(vendor=user_id)


        # Get order parameter
        order_by = request.query_params.get('order', '-date_added')
        if order_by == 'oldest':
            order_items = order_items.order_by('date_added')
        elif order_by == 'min_price':
            order_items = order_items.order_by('price')
        elif order_by == 'max_price':
            order_items = order_items.order_by('-price')
        else:
            order_items = order_items.order_by(order_by)

        # Get filter parameters
        filter_by = request.query_params.get('filter', None)
        if filter_by != 'null':
            order_items = order_items.filter(status=filter_by)

        # Get search parameter
        search_query = request.query_params.get('search', None)
        if search_query:
            order_items = order_items.filter(
                Q(name__icontains=search_query) |
                Q(tracking_number__icontains=search_query) |
                Q(address_line_1__icontains=search_query) |
                Q(address_line_2__icontains=search_query) |
                Q(city__icontains=search_query) |
                Q(state_province_region__icontains=search_query) |
                Q(postal_zip_code__icontains=search_query)
            )

        serializer = OrderItemSerializer(order_items, many=True).data
        return self.paginate_response(request, serializer)
    

class DetailOrderView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request, txId, *args, **kwargs):
        validate_token(request)
        order = Order.objects.get(transaction_id=txId)
        order_data = OrderSerializer(order).data
        order_items = order.order_items.all()
        order_items_data = OrderItemSerializer(order_items, many=True).data
        return self.send_response({"order": order_data, "order_items": order_items_data})

class DetailOrderItemView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, id, *args, **kwargs):
        payload = validate_token(request)
        order_item = OrderItem.objects.get(id=id)
        if payload['user_id'] == str(order_item.vendor):
            order_data = OrderSerializer(order_item.order).data
            order_item_data = OrderItemSerializer(order_item).data
            return self.send_response({"order":order_data , "order_item": order_item_data})
        else:
            return self.send_error('Only vendor is allowed to see order item')

class UpdateTrackingURLView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, id, *args, **kwargs):
        payload = validate_token(request)
        order_item = OrderItem.objects.get(id=id)
        if payload['user_id'] == str(order_item.vendor):

            order_item.tracking_url = request.data['trackingUrl']
            order_item.save()

            order_data = OrderSerializer(order_item.order).data
            order_item_data = OrderItemSerializer(order_item).data
            return self.send_response({"order":order_data , "order_item": order_item_data})
        else:
            return self.send_error('Only vendor is allowed to see order item')

class UpdateTrackingNumberView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, id, *args, **kwargs):
        payload = validate_token(request)
        order_item = OrderItem.objects.get(id=id)
        if payload['user_id'] == str(order_item.vendor):

            order_item.tracking_number = request.data['trackingNumber']
            order_item.save()

            order_data = OrderSerializer(order_item.order).data
            order_item_data = OrderItemSerializer(order_item).data
            return self.send_response({"order":order_data , "order_item": order_item_data})
        else:
            return self.send_error('Only vendor is allowed to see order item')

class UpdateOrderitemStatusView(StandardAPIView):
    permission_classes = (permissions.AllowAny,)

    def put(self, request, id, *args, **kwargs):
        payload = validate_token(request)
        order_item = OrderItem.objects.get(id=id)
        if payload['user_id'] == str(order_item.vendor):

            order_item.status = request.data['status']
            order_item.save()

            order = order_item.order
            order_items = order.orderitem_set.all()

            if all(item.status == OrderItem.OrderStatus.delivered for item in order_items):
                order.status = Order.OrderStatus.delivered
            elif all(item.status == OrderItem.OrderStatus.shipping for item in order_items):
                order.status = Order.OrderStatus.shipping
            else:
                order.status = Order.OrderStatus.processing

            order.save()

            order_data = OrderSerializer(order).data
            order_item_data = OrderItemSerializer(order_item).data
            return self.send_response({"order": order_data, "order_item": order_item_data})
        else:
            return self.send_error('Only vendor is allowed to see order item')