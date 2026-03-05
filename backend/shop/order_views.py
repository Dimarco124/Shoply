from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from .models import Order, OrderItem, Produit
from .order_serializers import OrderSerializer, OrderItemSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Un utilisateur ne voit que ses propres commandes
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Les données viennent du panier envoyé par le frontend
        # On ne fait rien ici car on surcharge la méthode create pour plus de contrôle
        pass

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """
        Création sécurisée d'une commande
        Le frontend envoie : {
            "nom_complet": "...",
            "email": "...",
            "telephone": "...",
            "adresse": "...",
            "ville": "...",
            "payment_method": "GENIUSPAY" | "WHATSAPP",
            "items": [
                {"product_id": 1, "quantity": 2},
                ...
            ]
        }
        """
        data = request.data
        items_data = data.get('items', [])
        
        if not items_data:
            return Response({"error": "La commande est vide"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Calculer le prix total sur le SERVEUR (Sécurité)
        total_price = 0
        order_items_to_create = []

        for item in items_data:
            try:
                product = Produit.objects.get(id=item['product_id'])
                qty = int(item['quantity'])
                if qty <= 0: continue
                
                item_price = product.prix * qty
                total_price += item_price
                
                order_items_to_create.append({
                    'product': product,
                    'quantity': qty,
                    'price': product.prix
                })
            except (Produit.DoesNotExist, KeyError, ValueError):
                return Response({"error": f"Produit invalide ou quantité incorrecte"}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Créer la commande principale
        order = Order.objects.create(
            user=request.user,
            nom_complet=data.get('nom_complet'),
            email=data.get('email'),
            telephone=data.get('telephone'),
            adresse=data.get('adresse'),
            ville=data.get('ville', 'Abidjan'),
            total_price=total_price,
            payment_method=data.get('payment_method', 'WHATSAPP'),
            status='PENDING'
        )

        # 3. Créer les lignes de commande
        for item in order_items_to_create:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                quantity=item['quantity'],
                price=item['price']
            )

        # 4. Initier le paiement GeniusPay si nécessaire
        checkout_url = None
        if order.payment_method == 'GENIUSPAY':
            from .services.geniuspay import GeniusPayService
            # On définit les URLs de retour (succès/échec) vers le frontend
            # En v1, on renvoie vers la page de succès locale ou le compte
            base_frontend_url = request.build_absolute_uri('/').split('/api/')[0] 
            # Note: build_absolute_uri sur un API Django peut donner l'URL de l'API. 
            # Souvent en prod on préfère une variable SETTINGS pour l'URL Frontend.
            success_url = f"{base_frontend_url}/mon-compte?status=success"
            cancel_url = f"{base_frontend_url}/checkout?status=cancel"
            
            checkout_url = GeniusPayService.initiate_payment(order, success_url, cancel_url)
            if not checkout_url:
                # Si GeniusPay échoue, on peut soit annuler la commande soit la laisser en PENDING
                # Ici on la laisse mais on informe le frontend
                pass

        # 5. Retourner la commande créée
        serializer = self.get_serializer(order)
        response_data = serializer.data
        if checkout_url:
            response_data['checkout_url'] = checkout_url
            
        return Response(response_data, status=status.HTTP_201_CREATED)
