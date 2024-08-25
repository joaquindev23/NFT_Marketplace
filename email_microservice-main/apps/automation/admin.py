from django.contrib import admin
from .models import Contact, EmailList, ContactEmailList, EmailTemplate, EmailCampaign, Tag, Segment

class ContactAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'created_at')
    search_fields = ('email', 'first_name', 'last_name')
    list_filter = ('created_at',)

class EmailListAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_by', 'created_at')
    search_fields = ('name', 'created_by')
    list_filter = ('created_at',)

class ContactEmailListAdmin(admin.ModelAdmin):
    list_display = ('contact', 'email_list')
    search_fields = ('contact__email', 'email_list__name')
    list_select_related = ('contact', 'email_list')

class EmailTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject', 'created_by', 'created_at')
    search_fields = ('name', 'subject', 'created_by')
    list_filter = ('created_at',)

class EmailCampaignAdmin(admin.ModelAdmin):
    list_display = ('name', 'email_template', 'start_time', 'created_by', 'created_at')
    search_fields = ('name', 'created_by', 'email_template__name')
    list_filter = ('start_time', 'created_at')
    list_select_related = ('email_template',)
    filter_horizontal = ('email_lists', 'segments')

class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

class SegmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'email_list', 'created_by', 'created_at')
    search_fields = ('name', 'created_by', 'email_list__name')
    list_filter = ('created_at',)
    filter_horizontal = ('tags',)

admin.site.register(Contact, ContactAdmin)
admin.site.register(EmailList, EmailListAdmin)
admin.site.register(ContactEmailList, ContactEmailListAdmin)
admin.site.register(EmailTemplate, EmailTemplateAdmin)
admin.site.register(EmailCampaign, EmailCampaignAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Segment, SegmentAdmin)