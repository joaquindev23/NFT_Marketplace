from django.urls import path
from .views import *

urlpatterns = [
    path('check/', CheckCouponView.as_view()),
    # path('check-course-coupon', CheckCourseCouponView.as_view()),
    path('create/', CreateCouponView.as_view()),
    path('list/', ListCouponsView.as_view()),
    path('delete/', DeleteCouponView.as_view()),
    path('get/<id>', DetailCouponView.as_view()),
]