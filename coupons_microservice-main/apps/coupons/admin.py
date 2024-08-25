from django.contrib import admin
from .models import Coupon, FixedPriceCoupon, PercentageCoupon


class FixedPriceCouponAdmin(admin.ModelAdmin):
    list_display = ('id', 'discount_price', )
    list_editable = ('discount_price', )
    list_per_page = 25
admin.site.register(FixedPriceCoupon, FixedPriceCouponAdmin)


class PercentageCouponAdmin(admin.ModelAdmin):
    list_display = ('id', 'discount_percentage', )
    list_editable = ('discount_percentage', )
    list_per_page = 25
admin.site.register(PercentageCoupon, PercentageCouponAdmin)

admin.site.register(Coupon)