import json, os, django
from confluent_kafka import Consumer
import uuid

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.apps import apps

Product = apps.get_model('product', 'Product')
Weight = apps.get_model('product', 'Weight')
Size = apps.get_model('product', 'Size')
Material = apps.get_model('product', 'Material')
Color = apps.get_model('product', 'Color')

from core.producer import producer

class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, uuid.UUID):
            # if obj is uuid, we simply return the value of uuid
            return str(obj)
        return json.JSONEncoder.default(self, obj)

consumer1 = Consumer({
    'bootstrap.servers': os.environ.get('KAFKA_BOOTSTRAP_SERVER'),
    'security.protocol': os.environ.get('KAFKA_SECURITY_PROTOCOL'),
    'sasl.username': os.environ.get('KAFKA_USERNAME'),
    'sasl.password': os.environ.get('KAFKA_PASSWORD'),
    'sasl.mechanism': 'PLAIN',
    'group.id': os.environ.get('KAFKA_GROUP'),
    'auto.offset.reset': 'earliest'
})

consumer1.subscribe([os.environ.get('KAFKA_TOPIC'),os.environ.get('KAFKA_TOPIC_2'), os.environ.get('KAFKA_TOPIC_3')])


while True:
    msg1 = consumer1.poll(1.0)

    if msg1 is None:
        continue
    if msg1.error():
        print("Consumer error: {}".format(msg1.error()))
        continue

    topic = msg1.topic()
    value = msg1.value()

    if topic == 'products_request':
        if msg1.key() == b'products_list':
            # Get user_id list
            products_list = Product.objects.values(
                'id',
                'title',
                'price',
                'purchases',
            )
            for product in products_list:
                product['price'] = str(product['price'])
            # Serialize user_id list
            products_list_data = json.dumps(list(products_list),cls=UUIDEncoder)
            print(products_list_data)
            # producer.produce('users_response', value=user_data)
            producer.produce(
                'products_response',
                key='products_list',
                value=products_list_data
            )
    
    if topic == 'product_request':
        if msg1.key() == b'get_product':
            # Get the product id from the message value
            product_id = msg1.value()
            # Get the product from the database using the product_id
            product = Product.objects.get(id=product_id)
            # Produce the response to the topic 'products_response'
            producer.produce(
                'product_response',
                key='get_product',
                value=product.to_dict()
            )
    if topic == 'product_purchased':
        message_value = json.loads(msg1.value())
        product_id = message_value.get('product_id')
        stock_to_reduce = message_value.get('stock_to_reduce', 1)
        product = Product.objects.get(id=product_id)
        

        if msg1.key() == b'reduce_stock_by_weight':
            weight_id = message_value.get('weight_id')
            weight = Weight.objects.get(id=weight_id)

            if weight.product == product:
                weight.stock -= stock_to_reduce
                print(f"Reducing stock of weight {weight.title} by {stock_to_reduce}. New stock: {weight.stock}")
                if weight.stock <= 0:
                    weight.inStock = False
                weight.save()

        elif msg1.key() == b'reduce_stock_by_size':
            size_id = message_value.get('size_id')
            size = Size.objects.get(id=size_id)

            if size.product == product:
                size.stock -= stock_to_reduce
                print(f"Reducing stock of size {size.title} by {stock_to_reduce}. New stock: {size.stock}")
                if size.stock <= 0:
                    size.inStock = False
                size.save()

        elif msg1.key() == b'reduce_stock_by_material':
            material_id = message_value.get('material_id')
            material = Material.objects.get(id=material_id)

            if material.product == product:
                material.stock -= stock_to_reduce
                print(f"Reducing stock of material {material.title} by {stock_to_reduce}. New stock: {material.stock}")
                if material.stock <= 0:
                    material.inStock = False
                material.save()

        elif msg1.key() == b'reduce_stock_by_color':
            color_id = message_value.get('color_id')
            color = Color.objects.get(id=color_id)

            if color.product == product:
                color.stock -= stock_to_reduce
                print(f"Reducing stock of color {color.title} by {stock_to_reduce}. New stock: {color.stock}")
                if color.stock <= 0:
                    color.inStock = False
                color.save()


consumer.close()