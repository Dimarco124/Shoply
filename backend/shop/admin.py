
from django.contrib import admin
from .models import Categorie, Produit


@admin.register(Categorie)
class CategorieAdmin(admin.ModelAdmin):
    """
    Configuration de l'affichage du modèle Categorie dans l'admin
    """
    list_display = ('nom', 'description_courte', 'date_creation')
    search_fields = ('nom',)
    
    def description_courte(self, obj):
        """
        Affiche les 50 premiers caractères de la description
        """
        if obj.description:
            return obj.description[:50] + "..."
        return "-"
    description_courte.short_description = "Description"






@admin.register(Produit)
class ProduitAdmin(admin.ModelAdmin):
    # Colonnes affichées dans la liste des produits
    list_display = ('nom', 'categorie', 'prix_avec_format', 'disponible', 'date_creation')
    
    # Champs sur lesquels on peut filtrer (barre latérale droite)
    list_filter = ('categorie', 'disponible', 'date_creation')
    
    # Champs sur lesquels on peut faire une recherche
    search_fields = ('nom', 'description')
    
    # Organisation des champs dans le formulaire d'édition
    fieldsets = (
        ('Informations de base', {
            'fields': ('categorie', 'nom', 'description')
        }),
        ('Prix et disponibilité', {
            'fields': ('prix', 'disponible')
        }),
        ('Média', {
            'fields': ('image',)
        }),
        ('Métadonnées', {
            'fields': ('date_creation', 'date_modification'),
            'classes': ('collapse',)  # Cette section sera repliée par défaut
        }),
    )
    
    # Champs en lecture seule (non modifiables dans le formulaire)
    readonly_fields = ('date_creation', 'date_modification', 'apercu_image')
    
    def prix_avec_format(self, obj):
        """
        Utilise notre méthode du modèle pour afficher le prix formaté
        """
        return obj.prix_format()
    prix_avec_format.short_description = "Prix"
    prix_avec_format.admin_order_field = 'prix'  # Permet de trier sur cette colonne
    
    def apercu_image(self, obj):
        """
        Affiche un aperçu de l'image dans le formulaire d'édition
        """
        if obj.image:
            return f'<img src="{obj.image.url}" style="max-height: 100px;"/>'
        return "Pas d'image"
    apercu_image.short_description = "Aperçu"
    apercu_image.allow_tags = True  # Permet d'afficher du HTML (pour l'image)