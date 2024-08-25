from django.urls import path
from .views import *

app_name="orders"

urlpatterns = [
    path('create/', CreateOrderView.as_view()),
    path('list/', ListOrdersView.as_view()),
    path('list_items/', ListOrderItemsView.as_view()),
    path('get/<txId>/', DetailOrderView.as_view()),
    path('get_item/<id>/', DetailOrderItemView.as_view()),
    path('edit/tracking_url/<id>/', UpdateTrackingURLView.as_view()),
    path('edit/tracking_number/<id>/', UpdateTrackingNumberView.as_view()),
    path('edit/status/<id>/', UpdateOrderitemStatusView.as_view()),
]