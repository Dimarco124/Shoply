from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import auth_views

urlpatterns = [
    path('register/', auth_views.RegisterView.as_view(), name='auth-register'),
    path('login/', auth_views.LoginView.as_view(), name='auth-login'),
    path('profile/', auth_views.ProfileView.as_view(), name='auth-profile'),
    path('change-password/', auth_views.ChangePasswordView.as_view(), name='auth-change-password'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
