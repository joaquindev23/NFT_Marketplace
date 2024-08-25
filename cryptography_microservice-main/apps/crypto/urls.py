from django.urls import path

from .views import *


urlpatterns = [
    path('key/', GetPrivateKey.as_view()),
    path('key-file/', GetPrivateKeyFile.as_view()),
]