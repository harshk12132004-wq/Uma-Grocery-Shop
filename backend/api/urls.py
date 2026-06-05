from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    register_view, login_view, logout_view, current_user_view, send_otp_view, contact_feedback_view, seed_db_view,
    CategoryViewSet, ProductViewSet, CartViewSet, OrderViewSet, FeedbackViewSet, AdminUsersViewSet, OfferViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'feedback', FeedbackViewSet, basename='feedback')
router.register(r'admin-users', AdminUsersViewSet, basename='admin-user')
router.register(r'offers', OfferViewSet, basename='offer')

urlpatterns = [
    path('auth/register/', register_view, name='register'),
    path('auth/send-otp/', send_otp_view, name='send-otp'),
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/user/', current_user_view, name='current-user'),
    path('contact/', contact_feedback_view, name='contact'),
    path('db/seed/', seed_db_view, name='seed-db'),
    path('', include(router.urls)),
]

