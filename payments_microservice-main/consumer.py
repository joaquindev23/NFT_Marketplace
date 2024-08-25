import json, os, django
from confluent_kafka import Consumer
import uuid

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()


consumer1 = Consumer({
    'bootstrap.servers': os.environ.get('KAFKA_BOOTSTRAP_SERVER'),
    'security.protocol': 'SASL_SSL',
    'sasl.username': os.environ.get('KAFKA_USERNAME'),
    'sasl.password': os.environ.get('KAFKA_PASSWORD'),
    'sasl.mechanism': 'PLAIN',
    'group.id': 'payments_group',
    'auto.offset.reset': 'earliest'
})
# consumer1.subscribe(['courses_request'])

while True:
    msg1 = consumer1.poll(1.0)

    if msg1 is None:
        continue
    if msg1.error():
        print("Consumer error: {}".format(msg1.error()))
        continue

    # topic = msg1.topic()
    # value = msg1.value()

    # if topic == 'courses_request':
    #     if msg1.key() == b'courses_list':
    #         # Get user_id list
    #         courses_list = Course.objects.values(
    #             'id',
    #             'title',
    #             'price',
    #             'purchases',
    #             'students',
    #         )
    #         for course in courses_list:
    #             course['price'] = str(course['price'])
    #         # Serialize user_id list
    #         courses_list_data = json.dumps(list(courses_list),cls=UUIDEncoder)
    #         print(courses_list_data)
    #         # producer.produce('users_response', value=user_data)
    #         producer.produce(
    #             'courses_response',
    #             key='courses_list',
    #             value=courses_list_data
    #         )

    # if topic == 'course_request':
    #     if msg1.key() == b'get_course':
    #         # Get the course id from the message value
    #         course_id = msg1.value()
    #         # Get the course from the database using the course_id
    #         course = Course.objects.get(id=course_id)
    #         # Produce the response to the topic 'courses_response'
    #         producer.produce(
    #             'course_response',
    #             key='get_course',
    #             value=course.to_dict()
            # )

consumer.close()