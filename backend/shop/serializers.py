# backend/shop/serializers.py

from rest_framework import serializers
from .models import Categorie, Produit

class CategorieSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour le modèle Categorie
    Convertit un objet Categorie en JSON et vice-versa
    """
    class Meta:
        model = Categorie
        fields = ['id', 'nom', 'description', 'image', 'date_creation']
        # 'id' est automatiquement créé par Django, on l'inclut pour l'identifier


class ProduitSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour le modèle Produit
    """
    # On ajoute des champs personnalisés
    prix_format = serializers.SerializerMethodField()
    categorie_nom = serializers.ReadOnlyField(source='categorie.nom')
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Produit
        fields = [
            'id', 'categorie', 'categorie_nom', 'nom', 'description',
            'prix', 'prix_format', 'image', 'image_url', 'disponible',
            'est_nouveau', 'en_solde', 'date_creation'
        ]
    
    def get_prix_format(self, obj):
        """
        Utilise la méthode du modèle pour formater le prix
        """
        return obj.prix_format()
    
    def get_image_url(self, obj):
        """
        Retourne l'URL complète de l'image
        """
        if obj.image:
            return obj.image.url
        return None


class ProduitDetailSerializer(serializers.ModelSerializer):
    """
    Sérialiseur plus détaillé pour la page produit individuelle
    """
    categorie_info = CategorieSerializer(source='categorie', read_only=True)
    prix_format = serializers.SerializerMethodField()
    
    class Meta:
        model = Produit
        fields = [
            'id', 'categorie', 'categorie_info', 'nom', 'description',
            'prix', 'prix_format', 'image', 'disponible',
            'est_nouveau', 'en_solde', 'date_creation', 'date_modification'
        ]
    
    def get_prix_format(self, obj):
        return obj.prix_format()