from django.urls import path
from .views import *

urlpatterns = [
    path('create/', CreateProductView.as_view()),
    path('list/', ListProductsView.as_view()),
    path('get/<id>/', DetailProductView.as_view()),
    path('list/id/', ListProductsFromIDListView.as_view()),
    path('search/', SearchProductsView.as_view()),

    path('seller/list/', ListAuthorProductsView.as_view()),
    path('seller/get/<id>/', DetailProductAuthorView.as_view()),

    path('edit/handle/targetAudience/', SetProductTargetAudienceView.as_view()),
    path('edit/handle/features/', SetProductFeaturesView.as_view()),
    path('edit/handle/supplyChain/', SetProductSupplyChainView.as_view()),
    path('edit/handle/delivery/', SetProductDeliveryView.as_view()),
    path('edit/handle/warehousing/', SetWarehousingView.as_view()),
    path('edit/handle/proposition/', SetValueProposition.as_view()),
    path('edit/handle/marketing/', SetMarketingView.as_view()),
    path('edit/handle/details/', SetDetailsView.as_view()),
    path('edit/handle/accessibility/', SetAccessibilityView.as_view()),
    path('edit/handle/documentation/', SetDocumentationView.as_view()),
    path('edit/handle/landingPage/', SetLandingPageView.as_view()),
    path('edit/handle/pricing/', SetPricingView.as_view()),
    path('edit/handle/promotions/', SetPromotionsView.as_view()),
    path('edit/handle/shipping/', SetShippingView.as_view()),
    path('edit/handle/messages/', SetMessagesView.as_view()),

    # PRODUCTS WhatLearnt
    path("details/create/",CreateDetailView.as_view()),
    path("details/delete/",DeleteDetailView.as_view()),
    path("colors/create/",CreateColorsView.as_view()),
    path("colors/delete/",DeleteColorsView.as_view()),
    path("sizes/create/",CreateSizeView.as_view()),
    path("sizes/delete/",DeleteSizeView.as_view()),
    path("whatlearnt/create/",UpdateWhatLearntView.as_view()),
    path("whatlearnt/delete/",DeleteWhatLearntView.as_view()),
    path("who_is_for/create/",UpdateWhoIsForView.as_view()),
    path("who_is_for/delete/",DeleteWhoIsForView.as_view()),
    path("requisites/create/",UpdateRequisiteView.as_view()),
    path("requisites/delete/",DeleteRequisiteView.as_view()),
    
    path("weights/create/",UpdateWeightView.as_view()),
    path("weights/delete/",DeleteWeightView.as_view()),
    
    path("materials/create/",UpdateMaterialView.as_view()),
    path("materials/delete/",DeleteMaterialView.as_view()),
    
    path("images/create/",UpdateImageView.as_view()),
    path("images/delete/",DeleteImageView.as_view()),

    path("videos/create/",UpdateVideoView.as_view()),
    path("videos/delete/",DeleteVideoView.as_view()),

    path("documents/create/",UpdateDocumentView.as_view()),
    path("documents/delete/",DeleteDocumentView.as_view()),

    path('update/', UpdateProductView.as_view()),
    path('update/pricing/', UpdateProductPricingView.as_view()),
                                                             
    path('update/welcome_message/', UpdateProductWelcomeMessage.as_view()),
    path('update/congrats_message/', UpdateProductCongratsMessage.as_view()),
                                                                          
    path("publish/",PublishProductiew.as_view()),
    path("delete/",DeleteProductView.as_view()),
    path("edit/keywords/",EditKeywordsView.as_view()),
    path("edit/slug/",EditSlugView.as_view()),
    path("edit/stock/",EditProductStockView.as_view()),
    path("edit/nft_address/",EditProductNFTAddressView.as_view()),

    path('update/analytics/<id>/', UpdateProductAnalyticsView.as_view()),
    path('update/views/', UpdateProductViewsView.as_view()),
    path('update/clicks/', UpdateProductClickView.as_view()),
]