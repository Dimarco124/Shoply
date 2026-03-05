from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from .models import Order
from .services.geniuspay import GeniusPayService
import json

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def geniuspay_webhook(request):
    """
    Endpoint Webhook pour GeniusPay.
    Reçoit les notifications de paiement et met à jour le statut de la commande.
    """
    payload = request.data
    # Log pour debugging (à retirer ou mapper vers un vrai logger en prod)
    print(f"GeniusPay Webhook received: {json.dumps(payload)}")
    
    external_id = GeniusPayService.verify_webhook(payload)
    
    if external_id:
        try:
            order = Order.objects.get(id=external_id)
            if payload.get("status") == "SUCCESS":
                order.is_paid = True
                order.status = 'PAID'
                order.save()
                return Response({"message": "Order updated to PAID"}, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
            
    return Response({"message": "Webhook processed"}, status=status.HTTP_200_OK)
