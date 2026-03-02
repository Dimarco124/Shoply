# Déploiement en production (gratuit) – A à Z

Ce guide permet de mettre en ligne votre site e‑commerce **gratuitement** avec :
- **Backend Django** (API) → [Render](https://render.com) (free)
- **Base de données** → PostgreSQL sur Render (free)
- **Frontend React** → [Vercel](https://vercel.com) (free)

---

## Prérequis

1. Un compte **GitHub** (gratuit).
2. Votre projet poussé sur un dépôt GitHub (dossier racine = celui qui contient `backend/` et `frontend/`).
3. Comptes gratuits sur **Render** et **Vercel** (connexion possible via GitHub).

---

## Étape 1 – Créer la base PostgreSQL sur Render

1. Allez sur [dashboard.render.com](https://dashboard.render.com) et connectez-vous.
2. **New +** → **PostgreSQL**.
3. Renseignez :
   - **Name** : `ecommerce-db` (ou autre).
   - **Region** : choisir la plus proche (ex. Frankfurt).
   - **Plan** : **Free**.
4. Cliquez sur **Create Database**.
5. Une fois la base créée, ouvrez-la et notez :
   - **Internal Database URL** (pour le backend sur Render).
   - Ou **External Database URL** si vous testez en local avec la prod.

Vous en aurez besoin à l’étape 3 pour la variable `DATABASE_URL`.

---

## Étape 2 – Déployer le backend Django sur Render

1. Sur Render : **New +** → **Web Service**.
2. Connectez votre **repo GitHub** (autoriser Render si besoin).
3. Choisir le **repository** du projet.
4. Configuration du service :
   - **Name** : `ecommerce-backend` (ou autre).
   - **Region** : même que la base (ex. Frankfurt).
   - **Branch** : `main` (ou la branche que vous utilisez).
   - **Root Directory** : **`backend`** (obligatoire).
   - **Runtime** : **Python 3**.
   - **Build Command** :  
     `pip install -r requirements.txt`
   - **Start Command** :  
     `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
   - **Plan** : **Free**.

5. **Variables d’environnement** (Environment) – à ajouter une par une :

   | Clé               | Valeur |
   |-------------------|--------|
   | `SECRET_KEY`      | Une chaîne secrète longue et aléatoire (ex. générée sur [djecrety.ir](https://djecrety.ir/) ou 50+ caractères). |
   | `DEBUG`           | `False` |
   | `DATABASE_URL`    | Coller l’**Internal Database URL** de l’étape 1 (depuis la fiche de la base PostgreSQL). |
   | `ALLOWED_HOSTS`   | `.onrender.com` |
   | `CORS_ALLOWED_ORIGINS` | Vous la mettrez à jour après le déploiement du frontend (étape 4). Ex. `https://votre-site.vercel.app` |
   | `CSRF_TRUSTED_ORIGINS` | `https://VOTRE-NOM-SERVICE.onrender.com` (remplacer par l’URL réelle de votre Web Service, ex. `https://ecommerce-backend-xxxx.onrender.com`) |

6. **Release Command** (optionnel mais recommandé) :  
   Dans **Advanced** → **Release Command** :  
   `python manage.py migrate --noinput && python manage.py collectstatic --noinput`  
   Ainsi, à chaque déploiement, les migrations et les fichiers statiques sont mis à jour.

7. Cliquez sur **Create Web Service**. Render build et déploie.
8. Une fois le déploiement réussi, notez l’**URL du service** (ex. `https://ecommerce-backend-xxxx.onrender.com`).  
   L’URL de l’API est : **`https://ecommerce-backend-xxxx.onrender.com/api/`**.

---

## Étape 3 – Créer un superutilisateur et charger les données (optionnel)

Pour utiliser l’admin Django et avoir des catégories/produits en prod :

1. Sur la fiche du **Web Service** Render, onglet **Shell** (ou **Logs** selon l’interface).
2. Ouvrir un **Shell** (si disponible) et lancer :
   ```bash
   python manage.py createsuperuser
   ```
   Si le Shell n’est pas disponible, vous pouvez exécuter ces commandes en local en pointant temporairement `DATABASE_URL` vers l’**External Database URL** de la base Render, puis faire les commandes Django (createsuperuser, import de données, etc.).

3. Aller sur `https://VOTRE-BACKEND.onrender.com/admin/`, vous connecter, puis ajouter des **Catégories** et **Produits** (et images si vous en uploadez).

**Important (plan gratuit Render)** : les fichiers uploadés (médias) sont stockés sur le disque du service. En free tier, ce disque est **éphémère** : il peut être réinitialisé après une longue inactivité ou un redéploiement. Pour des images persistantes, il faudrait plus tard un stockage externe (ex. Cloudinary, S3). Pour démarrer, vous pouvez quand même uploader des images ; elles resteront tant que l’instance ne sera pas recréée.

---

## Étape 4 – Déployer le frontend sur Vercel

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous (via GitHub si possible).
2. **Add New…** → **Project**.
3. Importez le **même repo GitHub** que pour Render.
4. Configuration du projet :
   - **Root Directory** : cliquer sur **Edit**, choisir le dossier **`frontend`**.
   - **Framework Preset** : Vite (détecté automatiquement en général).
   - **Build Command** : `npm run build` (par défaut).
   - **Output Directory** : `dist` (par défaut pour Vite).
   - **Install Command** : `npm install`.

5. **Variables d’environnement** – à ajouter **avant** le premier build :
   - **Name** : `VITE_API_URL`
   - **Value** : `https://VOTRE-BACKEND.onrender.com/api/`  
     (ex. `https://ecommerce-backend-xxxx.onrender.com/api/`)

6. Cliquez sur **Deploy**. Vercel build et déploie.
7. Une fois terminé, notez l’**URL du site** (ex. `https://votre-projet.vercel.app`).

---

## Étape 5 – Revenir sur Render (CORS)

Pour que le frontend (Vercel) puisse appeler l’API sans erreur CORS :

1. Render → votre **Web Service** (backend).
2. **Environment** → éditer `CORS_ALLOWED_ORIGINS`.
3. Mettre **exactement** l’URL de votre frontend Vercel (sans slash final), ex. :  
   `https://votre-projet.vercel.app`
4. Sauvegarder. Render redéploie automatiquement.

Votre site est alors en ligne : le frontend sur Vercel appelle le backend sur Render.

---

## Récapitulatif des URLs

| Rôle        | URL type |
|------------|----------|
| **Site (frontend)** | `https://votre-projet.vercel.app` |
| **API (backend)**   | `https://votre-backend.onrender.com/api/` |
| **Admin Django**    | `https://votre-backend.onrender.com/admin/` |

---

## Vérifications rapides

- **Frontend** : ouvrir l’URL Vercel → la page d’accueil s’affiche, les appels API partent vers l’URL Render.
- **API** : ouvrir `https://votre-backend.onrender.com/api/produits/` dans le navigateur → vous devez voir du JSON (liste de produits ou `[]`).
- **Images** : elles sont servies par le backend (`/media/...`). Si vous avez uploadé des images en prod, elles s’affichent tant que le disque Render n’a pas été réinitialisé.

---

## Limites du plan gratuit

- **Render (free)** : le service peut s’**endormir** après ~15 min d’inactivité ; le premier appel peut prendre 30–60 s (« cold start »). Les médias peuvent être perdus en cas de redéploiement ou recréation du service.
- **Vercel (free)** : bande passante et builds limités mais en général suffisants pour un petit site.
- **PostgreSQL (free)** : la base est supprimée après 90 jours d’inactivité sur certains plans ; vérifier la doc Render à jour.

---

## En cas de problème

1. **Erreur CORS** : revérifier `CORS_ALLOWED_ORIGINS` sur Render (URL exacte du frontend, sans slash final).
2. **500 / erreur serveur** : consulter les **Logs** du Web Service sur Render ; souvent une variable d’environnement manquante ou une migration non appliquée (relancer le **Release Command**).
3. **Frontend ne charge pas les données** : vérifier que `VITE_API_URL` sur Vercel est bien `https://...onrender.com/api/` et que le backend répond (test direct de l’URL `/api/produits/`).
4. **Images cassées** : en prod les images viennent du backend ; l’URL est construite à partir de `VITE_API_URL`. Vérifier que les produits en base ont bien un chemin d’image et que le backend sert `/media/`.

Une fois ces étapes faites, votre site e‑commerce est en ligne de bout en bout, gratuitement.
