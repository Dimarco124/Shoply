***Projet E-commerce Full Stack (React & Django)***

Bienvenue sur le dépôt officiel de Shoply, une plateforme e-commerce moderne et complète, développée avec React pour le frontend et Django pour le backend. Ce projet a été conçu pour offrir une expérience d'achat fluide, de la navigation à la commande via WhatsApp.

Lien vers le site en production : **https://shoply-yakro-official.vercel.app/**

**Fonctionnalités Principales**

- Catalogue de produits dynamique : Affichage des produits avec images, descriptions, prix et disponibilité.

- Recherche et filtres avancés : Filtrage par catégorie, prix, disponibilité et recherche par mots-clés (backend API).

- Gestion de panier robuste : Ajout/suppression de produits, modification des quantités, persistance via localStorage.

- Génération de bon de commande : Création d'une image (PNG) du récapitulatif de la commande (via html2canvas).

- Intégration WhatsApp : Partage simplifié du bon de commande via l'application WhatsApp.

- Interface d'administration : Backend Django sur mesure pour gérer les catégories, les produits et les commandes.

- Design moderne et responsive : Interface utilisateur intuitive, optimisée pour mobile et desktop.

**Architecture du Projet**

Ce projet est divisé en deux parties principales, hébergées séparément pour des performances optimales :

1. Frontend (Application React)

Technologies : React, Vite, Framer Motion (animations), Axios (requêtes API), React Router (navigation).
Hébergement : Vercel – Offre une intégration continue (CI/CD) parfaite avec GitHub, un SSL gratuit et une performance de premier ordre.


2. Backend (API Django)

Technologies : Django, Django REST Framework (création de l'API), django-cors-headers (gestion CORS), django-filter (filtres avancés).
Base de données : Neon (PostgreSQL) – Base de données PostgreSQL serverless hébergée dans le cloud, avec scaling automatique et séparation stockage/calcul
Hébergement : Render – Solution simple pour déployer des applications web Python.


Anti-veille : Cron Job – Exécute un ping régulier vers l’API du backend pour éviter sa mise en veille sur le plan gratuit de Render, garantissant des réponses rapides.
