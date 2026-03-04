import os
import django
from django.db import connection

# Configuration de l'environnement Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def reset_data():
    print("--- Début de la réinitialisation des données du shop ---")
    
    # Importer les modèles ici pour éviter des erreurs avant django.setup()
    from shop.models import Categorie, Produit
    
    # 1. Suppression de toutes les données (Cascade delete s'occupe des produits)
    count_cats = Categorie.objects.count()
    count_prods = Produit.objects.count()
    
    print(f"Suppression de {count_cats} catégories et {count_prods} produits...")
    Categorie.objects.all().delete()
    
    # 2. Réinitialisation des compteurs d'ID (auto-increment)
    db_engine = connection.vendor
    print(f"Base de données détectée : {db_engine}")
    
    with connection.cursor() as cursor:
        if db_engine == 'sqlite':
            # SQLite utilise une table interne sqlite_sequence
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='shop_categorie';")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='shop_produit';")
            print("Séquences SQLite réinitialisées.")
            
        elif db_engine == 'postgresql':
            # PostgreSQL utilise TRUNCATE ... RESTART IDENTITY
            # ou ALTER SEQUENCE ... RESTART WITH 1
            # Ici on utilise TRUNCATE CASCADE pour être sûr
            cursor.execute("TRUNCATE TABLE shop_categorie RESTART IDENTITY CASCADE;")
            cursor.execute("TRUNCATE TABLE shop_produit RESTART IDENTITY CASCADE;")
            print("Séquences PostgreSQL réinitialisées.")
            
        else:
            print(f"Attention : Réinitialisation des IDs non supportée pour le moteur {db_engine}")

    print("--- Réinitialisation terminée avec succès ! ---")

if __name__ == "__main__":
    reset_data()
