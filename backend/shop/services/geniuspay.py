import requests
import json
from django.conf import settings

class GeniusPayService:
    @staticmethod
    def initiate_payment(order, success_url, cancel_url):
        """
        Initié un paiement via GeniusPay.
        Retourne l'URL de paiement ou None en cas d'erreur.
        """
        endpoint = f"{settings.GENIUSPAY_BASE_URL}/payments"
        amount = float(order.total_price)
        
        # GeniusPay requiert un montant minimum de 200 XOF
        if amount < 200:
            print(f"--- GeniusPay Error: Amount {amount} is below minimum 200 XOF ---")
            return None

        headers = {
            "X-API-Key": settings.GENIUSPAY_PUBLIC_KEY,
            "X-API-Secret": settings.GENIUSPAY_SECRET_KEY,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        payload = {
            "amount": float(order.total_price),
            "currency": "XOF",
            "description": f"Commande #{order.id} - Dimarco Shoply",
            "external_id": str(order.id),
            "success_url": success_url,
            "error_url": cancel_url,
            "notification_url": settings.GENIUSPAY_WEBHOOK_URL,
            "customer": {
                "name": order.nom_complet,
                "email": order.email
            },
            "metadata": {
                "order_id": order.id,
                "email": order.email
            }
        }
        
        try:
            print(f"--- Initiating GeniusPay Payment ---")
            print(f"Endpoint: {endpoint}")
            # On ne logue pas les clés API réelles pour des raisons de sécurité, mais on vérifie leur présence
            print(f"Headers present: X-API-Key={bool(headers['X-API-Key'])}, X-API-Secret={bool(headers['X-API-Secret'])}")
            print(f"Payload: {json.dumps(payload, indent=2)}")
            
            response = requests.post(endpoint, json=payload, headers=headers, timeout=15)
            
            print(f"Status: {response.status_code}")
            # On log le texte brut pour voir si c'est du HTML (erreur serveur) ou du JSON
            print(f"Raw Response: {response.text[:500]}") # Limité à 500 car.
            
            try:
                response_data = response.json()
            except Exception:
                response_data = {}
                
            print(f"-------------------------------------")
            
            if response.status_code in [200, 201]:
                # Selon la doc, c'est dans data['checkout_url'] ou data['payment_url']
                data = response_data.get("data", {})
                return data.get("checkout_url") or data.get("payment_url")
            else:
                return None
        except Exception as e:
            print(f"GeniusPay Exception: {str(e)}")
            return None

    @staticmethod
    def verify_webhook(data):
        """
        Vérification du webhook.
        D'après la doc : l'événement est dans 'event' et les données dans 'data'.
        """
        event = data.get("event")
        payload_data = data.get("data", {})
        metadata = payload_data.get("metadata", {})
        
        # Le ID de commande est dans les metadata
        order_id = metadata.get("order_id")
        
        if event == "payment.success":
            return order_id
        return None
