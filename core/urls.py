from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import (
    HomeView, 
    MenView,
    WomenView,
    AllProductsView, 
    CartView, 
    ItemDetailView, 
    CheckoutView,
    PaymentView,
    order_complete, 
    add_to_cart,
    remove_from_cart,
    update_order_item_quantity,
    remove_completely_from_cart,
    apply_coupon,
    refund_view
)

app_name = 'core'
urlpatterns = [
    path('', HomeView.as_view(), name='index'),
    path('index/', HomeView.as_view()),
    path('men/', MenView.as_view(), name='men'),
    path('women/', WomenView.as_view(), name='women'),
    path('all-products/', AllProductsView.as_view(), name='all-products'),
    path('product-detail/<slug:slug>', ItemDetailView.as_view(), name='product-detail'),
    path('cart/', CartView.as_view(), name='cart'),
    path('apply-coupon/', apply_coupon, name='apply-coupon'),
    path('update-quantity/<int:order_item_id>/', update_order_item_quantity, name='update-quantity'),
    path('add-to-cart/<slug:slug>', add_to_cart, name='add-to-cart'),
    path('remove-from-cart/<slug:slug>', remove_from_cart, name='remove-from-cart'),
    path('remove-completely-from-cart/<slug:slug>', remove_completely_from_cart, name='remove-completely-from-cart'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('request-refund/', refund_view, name='request-refund'),    
    path('payment/<payment_option>', PaymentView.as_view(), name='payment'),
    path('order-complete/', order_complete, name='order-complete'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)