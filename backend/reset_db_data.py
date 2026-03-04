import os
import django
import sys
from django.db import connection

# Configuration de l'environnement Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def reset_data():
    print("\n--- RÉINITIALISATION DES DONNÉES ---")
    
    from shop.models import Categorie, Produit
    
    # 1. Suppression
    n_cats = Categorie.objects.count()
    n_prods = Produit.objects.count()
    
    print(f"Action : Suppression de {n_cats} catégories et {n_prods} produits...")
    Categorie.objects.all().delete()
    
    # 2. Reset des IDs
    db_engine = connection.vendor
    print(f"Base de données : {db_engine}")
    
    with connection.cursor() as cursor:
        if db_engine == 'sqlite':
            # Reset SQLite
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='shop_categorie';")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='shop_produit';")
            print("Séquences SQLite réinitialisées.")
            
        elif db_engine == 'postgresql':
            # Reset Postgres (Render)
            # RESTART IDENTITY remet les compteurs à 1
            cursor.execute("TRUNCATE TABLE shop_categorie RESTART IDENTITY CASCADE;")
            cursor.execute("TRUNCATE TABLE shop_produit RESTART IDENTITY CASCADE;")
            print("Séquences PostgreSQL réinitialisées.")
            
    print("--- OPÉRATION TERMINÉE ---\n")

if __name__ == "__main__":
    reset_data()
