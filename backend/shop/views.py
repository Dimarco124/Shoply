# backend/shop/views.py

from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Categorie, Produit
from .serializers import CategorieSerializer, ProduitSerializer, ProduitDetailSerializer

class CategorieList(generics.ListAPIView):
    """
    Vue pour lister toutes les catégories
    URL: /api/categories/
    Méthode: GET
    """
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer


class ProduitList(generics.ListAPIView):
    """
    Vue pour lister tous les produits avec filtres
    URL: /api/produits/
    Méthode: GET
    Filtres possibles: ?categorie=1&disponible=true&recherche=nike
    """
    serializer_class = ProduitSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Filtres exacts
    filterset_fields = {
        'categorie': ['exact'],
        'disponible': ['exact'],
        'prix': ['gte', 'lte'],  # gte = greater than or equal, lte = less than or equal
    }
    
    # Recherche textuelle
    search_fields = ['nom', 'description']
    
    # Tri
    ordering_fields = ['prix', 'date_creation', 'nom']
    ordering = ['-date_creation']  # Tri par défaut
    
    def get_queryset(self):
        """
        Personnalisation du queryset de base
        On ne retourne que les produits disponibles par défaut ?
        """
        queryset = Produit.objects.all()
        
        # Si on veut filtrer par disponibilité, on le fait via filterset_fields
        # Mais on peut aussi décider de ne montrer que les produits disponibles
        # queryset = queryset.filter(disponible=True)
        
        return queryset


class ProduitDetail(generics.RetrieveAPIView):
    """
    Vue pour obtenir les détails d'un produit spécifique
    URL: /api/produits/1/
    Méthode: GET
    """
    queryset = Produit.objects.all()
    serializer_class = ProduitDetailSerializer


class ProduitsParCategorie(generics.ListAPIView):
    """
    Vue pour lister les produits d'une catégorie spécifique
    URL: /api/categories/1/produits/
    Méthode: GET
    """
    serializer_class = ProduitSerializer
    
    def get_queryset(self):
        """
        Filtre les produits par l'ID de catégorie passé dans l'URL
        """
        categorie_id = self.kwargs['categorie_id']
        return Produit.objects.filter(categorie_id=categorie_id, disponible=True)
    




