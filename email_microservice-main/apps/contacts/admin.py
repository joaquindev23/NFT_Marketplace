from django.contrib import admin
from .models import Contact
# Register your models here.
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'phone')
    search_fields = ('name', 'email', 'subject','phone')
    list_filter = ('contact_date',)
admin.site.register(Contact, ContactAdmin)