from django.db import models

class Contact(models.Model):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

class Tag(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    contacts = models.ManyToManyField(Contact, related_name='tags', blank=True)

class EmailList(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

class ContactEmailList(models.Model):
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    email_list = models.ForeignKey(EmailList, on_delete=models.CASCADE)

class EmailTemplate(models.Model):
    name = models.CharField(max_length=100)
    subject = models.CharField(max_length=200)
    body = models.TextField()
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

class Segment(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    email_list = models.ForeignKey(EmailList, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tag, related_name='segments', blank=True)
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

class EmailCampaign(models.Model):
    name = models.CharField(max_length=100)
    email_lists = models.ManyToManyField(EmailList)
    segments = models.ManyToManyField(Segment, blank=True)
    email_template = models.ForeignKey(EmailTemplate, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    created_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)