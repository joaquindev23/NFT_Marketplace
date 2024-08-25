import json, os, django
from confluent_kafka import Consumer
import uuid
import requests
from decimal import Decimal

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()
from django.db import transaction
from rest_framework.exceptions import ValidationError

from django.apps import apps
from core.producer import producer

Order = apps.get_model('orders', 'Order')
OrderItem = apps.get_model('orders', 'OrderItem')

consumer1 = Consumer({
    'bootstrap.servers': os.environ.get('KAFKA_BOOTSTRAP_SERVER'),
    'security.protocol': os.environ.get('KAFKA_SECURITY_PROTOCOL'),
    'sasl.username': os.environ.get('KAFKA_USERNAME'),
    'sasl.password': os.environ.get('KAFKA_PASSWORD'),
    'sasl.mechanism': 'PLAIN',
    'group.id': os.environ.get('KAFKA_GROUP'),
    'auto.offset.reset': 'earliest'
})
consumer1.subscribe([os.environ.get('KAFKA_TOPIC')])

def create_order(order_data):
    print('Order Data: ',order_data)
    try:
        cart_items = order_data['cartItems']
        print('Cart Items: ', cart_items)        
        user_id = order_data['userID']

        courses = []
        products = []

        # Create the order and order items inside a transaction
        print('Creating order...')
        order = Order.objects.create(
            user=user_id,
            transaction_id=str(uuid.uuid4())
        )
        print('Order Created Successfully')

        for item in cart_items:

            if item.get('course'):
                courses.append(item)
            elif item.get('product'):
                products.append(item)

        for object in courses:
            print(f"Creating order item for Course: {object}")
            course_response = order_data['course_response']
            print('TODO: Update course analytics')
            # course_id = object['course'] if object['course'] else None
            # if not course_id:
            #     raise ValidationError('No course ID provided for item.')
            # order_item = OrderItem.objects.create(
            #     course=course_id,
            #     order=order,
            #     name=course_response.get('results').get('details').get('title'),
            #     price=course_response.get('results').get('details').get('price'),
            #     count=item.get('count') or 1
            # )
            # order.amount+= Decimal(course_response.get('results').get('details').get('price'))
            # order.order_items.add(order_item)
            # order.save()
        
        for object in products:
            product_response = order_data['product_response']
            delivery_address = order_data['deliveryAddress']
            save_delivery_address = order_data['saveDeliveryAddress']
            print(f"Creating order item for Product: {object}")
            product_id = object['product'] if object['product'] else None
            if not product_id:
                raise ValidationError('No product ID provided for item.')
            shipping_id = object['shipping'] if object['shipping'] else None
            if not shipping_id:
                raise ValidationError('No Shipping ID provided for item.')
            
            # Fetch product details from product API endpoint
            # print('Product Response: ',product_response)

            # GET Shipping
            shipping_id = object['shipping']
            filtered_shipping = [shipping for shipping in product_response.get('results').get('shipping') if shipping['id'] == shipping_id]
            selected_shipping = None
            if filtered_shipping:
                selected_shipping = filtered_shipping[0]
            
            # GET WEIGHT
            weight_id = object['weight']
            filtered_weights = [weight for weight in product_response.get('results').get('weights') if weight['id'] == weight_id]
            selected_weight = None
            if filtered_weights:
                selected_weight = filtered_weights[0]
                # kafka producer to reduce stock
                producer_data = {
                    'product_id': product_id, 
                    'weight_id': weight_id, 
                    'stock_to_reduce': object['count']
                }
                producer.produce(
                    'product_purchased', 
                    key=b'reduce_stock_by_weight', 
                    value=json.dumps(producer_data).encode('utf-8')
                )
                producer.flush()

            # GET MATERIAL
            material_id = object['material']
            filtered_materials = [material for material in product_response.get('results').get('materials') if material['id'] == material_id]
            selected_material = None
            if filtered_materials:
                selected_material = filtered_materials[0]
                # kafka producer to reduce stock
                producer_data = {
                    'product_id': product_id, 
                    'material_id': material_id, 
                    'stock_to_reduce': object['count']
                }
                producer.produce(
                    'product_purchased', 
                    key=b'reduce_stock_by_material', 
                    value=json.dumps(producer_data).encode('utf-8')
                )
                producer.flush()

            # GET COLOR
            color_id = object['color']
            filtered_colors = [color for color in product_response.get('results').get('colors') if color['id'] == color_id]
            selected_color = None
            if filtered_colors:
                selected_color = filtered_colors[0]
                # kafka producer to reduce stock
                producer_data = {
                    'product_id': product_id, 
                    'color_id': color_id, 
                    'stock_to_reduce': object['count']
                }
                producer.produce(
                    'product_purchased', 
                    key=b'reduce_stock_by_color', 
                    value=json.dumps(producer_data).encode('utf-8')
                )
                producer.flush()

            # GET Size
            size_id = object['size']
            filtered_sizes = [size for size in product_response.get('results').get('sizes') if size['id'] == size_id]
            selected_size = None
            if filtered_sizes:
                selected_size = filtered_sizes[0]
                # kafka producer to reduce stock
                producer_data = {
                    'product_id': product_id, 
                        'size_id': size_id, 
                        'stock_to_reduce': object['count']
                }
                producer.produce(
                    'product_purchased', 
                    key=b'reduce_stock_by_size', 
                    value=json.dumps(producer_data).encode('utf-8')
                )
                producer.flush()

            base_price= Decimal('0')
            product_price = product_response.get('results').get('details').get('price')
            if product_price is not None:
                base_price = Decimal(str(product_price))

            if selected_weight:
                base_price += Decimal(str(selected_weight.get('price')))
            if selected_material:
                base_price += Decimal(str(selected_material.get('price')))
            if selected_color:
                base_price += Decimal(str(selected_color.get('price')))
            if selected_size:
                base_price += Decimal(str(selected_size.get('price')))

            print("Debugging values:")
            print("course:", None)
            print("product:", product_response.get('results').get('details').get('id'))
            print("color:", None if not selected_color else selected_color.get('id'))
            print("color_hex:", None if not selected_color else selected_color.get('hex'))
            print("color_price:", None if not selected_color else Decimal(selected_color.get('price')))
            print("weight:", None if not selected_weight else selected_weight.get('id'))
            print("weight_name:", None if not selected_weight else selected_weight.get('title'))
            print("weight_price:", None if not selected_weight else Decimal(selected_weight.get('price')))
            print("size:", None if not selected_size else selected_size.get('id'))
            print("size_name:", None if not selected_size else selected_size.get('title'))
            print("size_price:", None if not selected_size else Decimal(selected_size.get('price')))
            print("material:", None if not selected_material else selected_material.get('id'))
            print("material_name:", None if not selected_material else selected_material.get('title'))
            print("material_price:", None if not selected_material else Decimal(selected_material.get('price')))
            print("shipping:", product_response.get('results').get('shipping')[0].get('id'))
            print("shipping_time:", product_response.get('results').get('shipping')[0].get('time'))
            print("shipping_name:", product_response.get('results').get('shipping')[0].get('title'))
            print("shipping_price:", Decimal(product_response.get('results').get('shipping')[0].get('price')))
            print("delivery_address:", None)
            print("vendor:", product_response.get('results').get('details').get('author'))
            print("buyer:", user_id)
            print("tracking_number:", None)
            print("tracking_url:", None)
            print("address_line_1:", delivery_address['address_line_1'])
            print("address_line_2:", delivery_address['address_line_2'])
            print("city:", delivery_address['city'])
            print("state_province_region:", delivery_address['state_province_region'])
            print("postal_zip_code:", delivery_address['postal_zip_code'])
            print("country_region:", delivery_address['country_region'])
            print("telephone_number:", delivery_address['telephone_number'])
            print("status:", 'not_processed')
            print("order:", order)
            print("name:", product_response.get('results').get('details').get('title'))
            print("price:", base_price)
            print("count:", object['count'])
            print("thumbnail:", product_response.get('results').get('images')[0].get('file') if product_response.get('results').get('images') else None)


            # print('Product Price: ', base_price)
            # print('Delivery Data: ', delivery_address)
            # print('save_delivery_address ?: ', save_delivery_address)

            # Create OrderItem instance for the product
            order_item = OrderItem.objects.create(
                course=None,
                product=product_response.get('results').get('details').get('id'),
                color=None if not selected_color else selected_color.get('id'),
                color_hex=None if not selected_color else selected_color.get('hex'),
                color_price=None if not selected_color else Decimal(selected_color.get('price')),
                weight=None if not selected_weight else selected_weight.get('id'),
                weight_name=None if not selected_weight else selected_weight.get('title'),
                weight_price=None if not selected_weight else Decimal(selected_weight.get('price')),
                size=None if not selected_size else selected_size.get('id'),
                size_name=None if not selected_size else selected_size.get('title'),
                size_price=None if not selected_size else Decimal(selected_size.get('price')),
                material=None if not selected_material else selected_material.get('id'),
                material_name=None if not selected_material else selected_material.get('title'),
                material_price=None if not selected_material else Decimal(selected_material.get('price')),
                shipping=product_response.get('results').get('shipping')[0].get('id'),
                shipping_time=product_response.get('results').get('shipping')[0].get('time'),
                shipping_name=product_response.get('results').get('shipping')[0].get('title'),
                shipping_price=Decimal(product_response.get('results').get('shipping')[0].get('price')),
                delivery_address=None,
                vendor=product_response.get('results').get('details').get('author'),
                buyer=user_id,
                tracking_number=None,
                tracking_url=None,
                address_line_1=delivery_address['address_line_1'],
                address_line_2=delivery_address['address_line_2'],
                city=delivery_address['city'],
                state_province_region=delivery_address['state_province_region'],
                postal_zip_code=delivery_address['postal_zip_code'],
                country_region=delivery_address['country_region'],
                telephone_number=delivery_address['telephone_number'],
                status='not_processed',
                order=order,
                name=product_response.get('results').get('details').get('title'),
                price=Decimal(base_price),
                count=object['count'],
                thumbnail = product_response.get('results').get('images')[0].get('file') if product_response.get('results').get('images') else None
            )
            order.amount+= Decimal(base_price)
            order.order_items.add(order_item)
            order.save()

            # IF AGreed, Send information to Kafka Consumer Auth
            if save_delivery_address == True:
                delivery_address_data = {
                    'user_id': user_id,
                    'delivery_address': delivery_address
                }
                producer.produce(
                    'delivery_address',
                    key='store_delivery_address',
                    value=json.dumps(delivery_address_data).encode('utf-8')
                )
                producer.flush()
        
    except KeyError as e:
        print(f"Failed to create order: missing key {str(e)}")
    except Exception as e:
        print(f"Failed to create order: {str(e)}")

while True:
    msg1 = consumer1.poll(1.0)

    if msg1 is None:
        continue
    if msg1.error():
        print("Consumer error: {}".format(msg1.error()))
        continue

    if msg1 is not None and not msg1.error():
        topic1 = msg1.topic()
        value1 = msg1.value()
        order_data = json.loads(value1)

        if topic1 == os.environ.get('KAFKA_TOPIC'):
            if msg1.key() == b'create_order':
                try:
                    create_order(order_data)
                    print(f"Order created successfully for user {order_data['userID']}")
                except ValidationError as e:
                    print(f"Failed to create order for user {order_data['userID']}: {str(e)}")

consumer1.close()