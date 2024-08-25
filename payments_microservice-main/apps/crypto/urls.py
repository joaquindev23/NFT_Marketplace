from django.urls import path

from .views import *


urlpatterns = [
    path('pay/', CryptoPaymentView.as_view()),
    path('verify_ticket_ownership/', VerifyTicketOwnershipView.as_view()),
    path('get_stock/', GetStockView.as_view()),
    path('buy_now/', BuyCourseNFT.as_view()),
    # path('list/', ListAllUsersView.as_view()),
    # path('list/ids/', UserIdListView.as_view()),
    # path('get/<id>/', GetUserView.as_view()),
    # path('get/profile/<id>/', GetUserProfileView.as_view()),
    # path('category/<category_slug>', BlogListCategoryView.as_view()),
    # path('<post_slug>', PostDetailView.as_view()),
    # path("search/<str:search_term>",SearchBlogView.as_view()),
]