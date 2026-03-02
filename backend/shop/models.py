# backend/shop/models.py

from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone  # ← AJOUTEZ CETTE LIGNE
from django.contrib.auth.models import User 


class Categorie(models.Model):
    """
    Modèle représentant une catégorie de produits
    (ex: Chaussures, Sacs, Accessoires)
    """
    nom = models.CharField(
        max_length=100,
        unique=True,  # Évite les doublons (pas deux catégories "Chaussures")
        verbose_name="Nom de la catégorie"
    )
    
    description = models.TextField(
        blank=True,  # Peut être vide
        null=True,   # Peut être nul dans la base de données
        verbose_name="Description"
    )
    
    image = models.ImageField(
        upload_to='categories/',  # Les images seront dans dossier 'media/categories/'
        blank=True,
        null=True,
        verbose_name="Image de la catégorie"
    )
    
    date_creation = models.DateTimeField(
        auto_now_add=True,  # Se met automatiquement à la création
        verbose_name="Date de création"
    )
    
    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"  # Pour le nom au pluriel dans l'admin
        ordering = ['nom']  # Trie par nom par défaut
    
    def __str__(self):
        """
        Méthode spéciale : définit comment afficher l'objet
        """
        return self.nom
    





class Produit(models.Model):
    """
    Modèle représentant un produit à vendre
    """
    categorie = models.ForeignKey(
        Categorie,  # Relation avec le modèle Categorie
        on_delete=models.CASCADE,  # Si la catégorie est supprimée, ses produits aussi
        related_name='produits',  # Permet d'accéder aux produits d'une catégorie via categorie.produits.all()
        verbose_name="Catégorie"
    )
    
    nom = models.CharField(
        max_length=200,
        verbose_name="Nom du produit"
    )
    
    description = models.TextField(
        verbose_name="Description détaillée"
    )
    
    prix = models.IntegerField(
        validators=[MinValueValidator(0)],  # Le prix ne peut pas être négatif
        verbose_name="Prix (FCFA)",
        help_text="Prix en francs CFA"  # Texte d'aide dans l'admin
    )
    
    image = models.ImageField(
        upload_to='produits/',
        verbose_name="Image du produit"
    )
    
    disponible = models.BooleanField(
        default=True,  # Par défaut, le produit est disponible
        verbose_name="Disponible à la vente"
    )
    
    est_nouveau = models.BooleanField(
        default=False,
        verbose_name="Nouveau (badge NEW)"
    )
    
    en_solde = models.BooleanField(
        default=False,
        verbose_name="En solde (badge SOLDE)"
    )
    
    date_creation = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date d'ajout"
    )
    
    date_modification = models.DateTimeField(
        auto_now=True,  # Se met à jour à chaque modification
        verbose_name="Dernière modification"
    )
    
    class Meta:
        verbose_name = "Produit"
        verbose_name_plural = "Produits"
        ordering = ['-date_creation']  # Trie du plus récent au plus ancien (le - signifie décroissant)
    
    def __str__(self):
        return f"{self.nom} - {self.prix} FCFA"
    
    def prix_format(self):
        """
        Méthode utilitaire pour formater le prix avec des séparateurs de milliers
        Ex: 15000 -> 15 000 FCFA
        """
        return f"{self.prix:,} FCFA".replace(",", " ")










class ContactMessage(models.Model):
    """Modèle pour les messages de contact"""
    
    SUJET_CHOIX = [
        ('commande', 'Question sur une commande'),
        ('produit', 'Information produit'),
        ('livraison', 'Livraison à Yamoussoukro'),
        ('retour', 'Retour / Remboursement'),
        ('partenariat', 'Partenariat / Devenir fournisseur'),
        ('autre', 'Autre'),
    ]
    
    STATUS_CHOIX = [
        ('nouveau', 'Nouveau'),
        ('en_cours', 'En cours de traitement'),
        ('repondu', 'Répondu'),
        ('archive', 'Archivé'),
    ]
    
    nom = models.CharField(max_length=200, verbose_name="Nom complet")
    email = models.EmailField(verbose_name="Email")
    telephone = models.CharField(max_length=50, blank=True, verbose_name="Téléphone")
    sujet = models.CharField(max_length=50, choices=SUJET_CHOIX, verbose_name="Sujet")
    message = models.TextField(verbose_name="Message")
    
    # Métadonnées
    date_envoi = models.DateTimeField(default=timezone.now, verbose_name="Date d'envoi")
    status = models.CharField(max_length=20, choices=STATUS_CHOIX, default='nouveau', verbose_name="Statut")
    ip_address = models.GenericIPAddressField(blank=True, null=True, verbose_name="Adresse IP")
    user_agent = models.TextField(blank=True, verbose_name="User Agent")
    
    # Réponse
    reponse = models.TextField(blank=True, verbose_name="Réponse")
    date_reponse = models.DateTimeField(blank=True, null=True, verbose_name="Date de réponse")
    repondu_par = models.ForeignKey(
        'auth.User', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name="Répondu par"
    )
    
    class Meta:
        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"
        ordering = ['-date_envoi']
    
    def __str__(self):
        return f"{self.nom} - {self.get_sujet_display()} - {self.date_envoi.strftime('%d/%m/%Y %H:%M')}"
    
    def marquer_comme_repondu(self, user, reponse):
        """Marquer le message comme répondu"""
        self.status = 'repondu'
        self.reponse = reponse
        self.date_reponse = timezone.now()
        self.repondu_par = user
        self.save()