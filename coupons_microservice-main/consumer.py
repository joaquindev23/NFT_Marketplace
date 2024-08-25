import json, os, django
from confluent_kafka import Consumer

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()


consumer1 = Consumer({
    'bootstrap.servers': os.environ.get('KAFKA_BOOTSTRAP_SERVER'),
    'security.protocol': 'SASL_SSL',
    'sasl.username': os.environ.get('KAFKA_USERNAME'),
    'sasl.password': os.environ.get('KAFKA_PASSWORD'),
    'sasl.mechanism': 'PLAIN',
    'group.id': 'coupons_group',
    'auto.offset.reset': 'earliest'
})
# consumer1.subscribe(['user_registered'])


while True:
    msg1 = consumer1.poll(1.0)

    if msg1 is None:
        continue
    if msg1.error():
        print("Consumer error: {}".format(msg1.error()))
        continue

    print("Received message with Value: {}".format(msg1.value()))
    print("Message Topic: {}".format(msg1.topic()))
    print("Message Key: {}".format(msg1.key()))

    topic = msg1.topic()
    value = msg1.value()

    # if topic == 'user_registered':
    #     if msg1.key() == b'create_user':
    #         user_data = json.loads(value)
    #         user_id = user_data['id']
    #         # create a cart for the user with the user_id
    #         cart, created = Cart.objects.get_or_create(user=user_id, defaults={'total_items': 0})
    #         if created:
    #             cart.save()
    # # elif topic == b'"product_added_to_cart"':
    # #     # execute logic for product_added_to_cart event
    # #     if msg.key() == 'add_product_to_cart':
    # #         print('Add product to user cart')
    # #         print(json.loads(value))
    # #         pass
    #     pass

consumer.close()