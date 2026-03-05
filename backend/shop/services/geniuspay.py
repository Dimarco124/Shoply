import requests
from django.conf import settings

class GeniusPayService:
    @staticmethod
    def initiate_payment(order, success_url, cancel_url):
        """
        Initié un paiement via GeniusPay.
        Retourne l'URL de paiement ou None en cas d'erreur.
        """
        endpoint = f"{settings.GENIUSPAY_BASE_URL}/checkout/create"
        headers = {
            "Authorization": f"Bearer {settings.GENIUSPAY_TOKEN}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        payload = {
            "amount": float(order.total_price),
            "currency": "XOF",
            "description": f"Commande #{order.id} - Dimarco Shoply",
            "external_id": str(order.id),
            "success_url": success_url,
            "cancel_url": cancel_url,
            "notification_url": settings.GENIUSPAY_WEBHOOK_URL,
            # Vous pouvez ajouter metadata si supporté
            "metadata": {
                "order_id": order.id,
                "email": order.email
            }
        }
        
        try:
            response = requests.post(endpoint, json=payload, headers=headers, timeout=15)
            response_data = response.json()
            
            if response.status_code == 200 or response.status_code == 201:
                # La structure typique de GeniusPay pour l'URL de checkout
                return response_data.get("checkout_url")
            else:
                print(f"GeniusPay Error: {response.status_code} - {response.text}")
                return None
        except Exception as e:
            print(f"GeniusPay Exception: {str(e)}")
            return None

    @staticmethod
    def verify_webhook(data):
        """
        Vérification basique du webhook (à adapter selon la doc officielle de signature si dispo).
        """
        # Dans un premier temps, on vérifie juste si c'est un succès
        status = data.get("status")
        external_id = data.get("external_id")
        
        if status == "SUCCESS":
            return external_id
        return None
