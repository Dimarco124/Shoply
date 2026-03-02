# backend/shop/urls.py

from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
from django.contrib.auth.models import User
from django.http import HttpResponse


urlpatterns = [
    # URL pour la liste des catégories
    path('categories/', views.CategorieList.as_view(), name='categorie-list'),
    
    # URL pour la liste des produits (avec filtres)
    path('produits/', views.ProduitList.as_view(), name='produit-list'),
    
    # URL pour le détail d'un produit
    path('produits/<int:pk>/', views.ProduitDetail.as_view(), name='produit-detail'),
    
    # URL pour les produits d'une catégorie spécifique
    path('categories/<int:categorie_id>/produits/', 
        views.ProduitsParCategorie.as_view(), 
        name='categorie-produits'),
    
]

