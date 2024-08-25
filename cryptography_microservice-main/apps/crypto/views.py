from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions, status
import jwt
from django.http import FileResponse
import os
from rest_framework_api.views import StandardAPIView
from django.conf import settings
secret_key = settings.SECRET_KEY

import logging
logger = logging.getLogger(__name__)

class GetPrivateKey(APIView):
    def get(self, request, format=None):
        private_key_path = os.path.join(settings.BASE_DIR, 'private_key.txt')
        with open(private_key_path, "rb") as f:
            private_key = f.read()
        logger.debug("Private key retrieved")
        return Response(private_key, status=status.HTTP_200_OK)
    
class GetPrivateKeyFile(APIView):
    def get(self, request, format=None):
        private_key_path = os.path.join(settings.BASE_DIR, 'private_key.txt')
        with open(private_key_path, "rb") as f:
            response = FileResponse(f)
            response['Content-Type'] = 'application/x-pem-file'
            response['Content-Disposition'] = 'attachment; filename=private_key.txt'
            return response
