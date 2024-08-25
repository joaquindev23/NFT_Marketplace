from django.db import models

class NftCounter(models.Model):
    current_value = models.PositiveIntegerField(default=0)