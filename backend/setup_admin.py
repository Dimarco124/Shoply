# backend/setup_admin.py

import os
import django

# Initialiser Django pour pouvoir interagir avec la base de données
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User

# On récupère les identifiants depuis les variables d'environnement (ex: sur Render)
# avec des valeurs par défaut au cas où
username = os.environ.get('ADMIN_USERNAME', 'admin')
password = os.environ.get('ADMIN_PASSWORD', 'SuperMotDePasse123!')
email = os.environ.get('ADMIN_EMAIL', 'admin@monsite.com')

# On vérifie si ce superutilisateur existe déjà
if not User.objects.filter(username=username).exists():
    print(f"Création du superutilisateur : {username}")
    User.objects.create_superuser(username, email, password)
    print("Superutilisateur créé avec succès !")
else:
    print(f"Le superutilisateur {username} existe déjà. Création ignorée.")
