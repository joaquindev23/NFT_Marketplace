from rest_framework import serializers
from .models import Contact, EmailList, ContactEmailList, EmailTemplate, EmailCampaign

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ('id', 'email', 'first_name', 'last_name', 'created_at')

class EmailListSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailList
        fields = ('id', 'name', 'description', 'created_by', 'created_at')

class ContactEmailListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactEmailList
        fields = ('id', 'contact', 'email_list')

class EmailTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailTemplate
        fields = ('id', 'name', 'subject', 'body', 'created_by', 'created_at')

class EmailCampaignSerializer(serializers.ModelSerializer):
    email_lists = EmailListSerializer(many=True)

    class Meta:
        model = EmailCampaign
        fields = ('id', 'name', 'email_lists', 'email_template', 'start_time', 'created_by', 'created_at')