# from ..product.models import Product
from apps.reviews.pagination import LargeSetPagination
from rest_framework.views import APIView
from rest_framework_api.views import StandardAPIView
from rest_framework.response import Response
from rest_framework import permissions
from uuid import UUID
from rest_framework import  status
from apps.reviews.serializers import ReviewSerializer

from django.core.exceptions import ObjectDoesNotExist
# from apps.classroom.models import CourseClassRoom, Rate as ClassRoomRate
from .models import Review
from apps.product.models import Product, Rate
from django.shortcuts import get_object_or_404
import json
import jwt
from django.conf import settings
secret_key = settings.SECRET_KEY


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


def is_valid_uuid(uuid):
    try:
        UUID(uuid, version=4)
        return True
    except ValueError:
        return False


def get_product_by_identifier(identifier):
    if is_valid_uuid(identifier):
        return Product.objects.get(id=identifier)
    elif identifier.startswith("0x"):
        return Product.objects.get(nft_address=identifier)
    else:
        return Product.objects.get(slug=identifier)
    

class GetReviewsView(StandardAPIView):
    def get(self, request, identifier, *args, **kwargs):
        # Get the course using the identifier (UUID, slug, or nft_address)
        product = get_product_by_identifier(identifier)
        rating_filter = request.GET.get('rating', None)
        
        if rating_filter is not None and rating_filter != "undefined":
            reviews = Review.objects.filter(product=product, rating=rating_filter)
        else:
            reviews = Review.objects.filter(product=product)

        review_counts = []
        total_rating = 0
        for rating in range(1, 6):
            count = reviews.filter(rating=rating).count()
            total_rating += rating * count
            review_counts.append({"rating": rating, "count": count})

        review_average = float(total_rating) / float(reviews.count()) if reviews.count() > 0 else 0
        
        review_data = {
            "totalCount": reviews.count(),
            "counts": review_counts,
            "average": review_average
        }

        return self.paginate_response_with_extra(request, ReviewSerializer(reviews, many=True).data, review_data )


class GetReviewView(StandardAPIView):
    def get(self, request, id, format=None):
        payload = validate_token(request)
        user_id_str = payload['user_id']
        user_id = UUID(user_id_str)

        product = Product.objects.get(id=id)
        try:
            review = Review.objects.get(user=user_id, product=product)
            return self.send_response(ReviewSerializer(review).data)
        except ObjectDoesNotExist:
            return self.send_response(False)
        

class CreateReviewView(StandardAPIView):
    permission_classes=(permissions.AllowAny,)
    def post(self, request, format=None):
        payload = validate_token(request)
        user_id_str = payload['user_id']
        user_id = UUID(user_id_str)

        data = self.request.data

        product_uuid = data['productUUID']

        try:
            rating = float(data['rating'])
        except:
            return Response(
                {'error': 'Rating must be a decimal value'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            comment = str(data['content'])
        except:
            return Response(
                {'error': 'Must pass a comment when creating review'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not Product.objects.filter(id=product_uuid).exists():
            return Response(
                {'error': 'This course does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )

        product = Product.objects.get(id=product_uuid)
        
        if Review.objects.filter(user=user_id, product=product).exists():
            return Response(
                {'error': 'Review for this course already created'},
                status=status.HTTP_409_CONFLICT
            )
        
        review = Review(
            user=user_id,
            product=product,
            rating=rating,
            comment=comment
        )
        review.save()

        rate = Rate.objects.create(rate_number=rating, user=user_id)
        product.rating.add(rate)

        ratings=product.rating.all()
        rate=0
        for rating in ratings:
            rate+=rating.rate_number
        try:
            rate/=len(ratings)
        except ZeroDivisionError:
            rate=0

        product.student_rating = rate
        product.save()

        return self.send_response(ReviewSerializer(review).data)



class UpdateReviewView(StandardAPIView):
    permission_classes=(permissions.AllowAny,)
    def put(self, request, format=None):
        payload = validate_token(request)
        user_id_str = payload['user_id']
        user_id = UUID(user_id_str)

        data = self.request.data

        product_uuid = data['productUUID']

        try:
            rating = float(data['rating'])
        except:
            return Response(
                {'error': 'Rating must be a decimal value'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            comment = str(data['content'])
        except:
            return Response(
                {'error': 'Must pass a comment when updating review'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not Product.objects.filter(id=product_uuid).exists():
            return Response(
                {'error': 'This course does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )

        product = Product.objects.get(id=product_uuid)
        
        if not Review.objects.filter(user=user_id, product=product).exists():
            return Response(
                {'error': 'Review does not exist'},
                status=status.HTTP_409_CONFLICT
            )
        
        review = Review.objects.get(user=user_id, product=product)
        review.rating = rating
        review.comment = comment
        review.save()

        # Find the associated Rate object and update it
        rate = Rate.objects.get(user=user_id, id__in=product.rating.all())
        rate.rate_number = rating
        rate.save()

        ratings = product.rating.all()
        rate = 0
        for rating in ratings:
            rate += rating.rate_number
        try:
            rate /= len(ratings)
        except ZeroDivisionError:
            rate = 0

        product.student_rating = rate
        product.save()

        return self.send_response(ReviewSerializer(review).data)


class DeleteCourseReviewView(APIView):
    def delete(self, request, course_uuid, format=None):
        data = self.request.data
        user = self.request.user

        try:
            if not Course.objects.filter(course_uuid=course_uuid).exists():
                return Response(
                    {'error': 'This course does not exist'},
                    status=status.HTTP_404_NOT_FOUND
                )

            course = Course.objects.get(course_uuid=course_uuid)

            results = []

            if Review.objects.filter(user=user, course=course).exists():
                Review.objects.filter(user=user, course=course).delete()

                reviews = Review.objects.order_by('-date_created').filter(
                    course=course
                )

                for review in reviews:
                    item = {}

                    item['id'] = review.id
                    item['rating'] = review.rating
                    item['comment'] = review.comment
                    item['date_created'] = review.date_created
                    item['user'] = review.user.first_name

                    results.append(item)

                return Response(
                    {'reviews': results},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'error': 'Review for this product does not exist'},
                    status=status.HTTP_404_NOT_FOUND
                )
        except:
            return Response(
                {'error': 'Something went wrong when deleting product review'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class FilterCourseReviewsView(APIView):
    def get(self, request, course_uuid, format=None):

        if not Course.objects.filter(course_uuid=course_uuid).exists():
            return Response(
                {'error': 'This course does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )

        course = Course.objects.get(course_uuid=course_uuid)

        rating = request.query_params.get('rating')

        try:
            rating = float(rating)
        except:
            return Response(
                {'error': 'Rating must be a decimal value'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            if not rating:
                rating = 5.0
            elif rating > 5.0:
                rating = 5.0
            elif rating < 0.5:
                rating = 0.5

            results = []

            if Review.objects.filter(course=course).exists():
                if rating == 0.5:
                    reviews = Review.objects.order_by('-date_created').filter(
                        rating=rating, course=course
                    )
                else:
                    reviews = Review.objects.order_by('-date_created').filter(
                        rating__lte=rating,
                        course=course
                    ).filter(
                        rating__gte=(rating - 0.5),
                        course=course
                    )

                paginator = LargeSetPagination()
                results = paginator.paginate_queryset(reviews, request)
                serializer = ReviewSerializer(results, many=True)

                results_length = len(reviews)

            return Response(
                {
                    'reviews': serializer.data,
                    'length':results_length
                },
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when filtering reviews for product'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

