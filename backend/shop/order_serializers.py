from rest_framework import serializers
from .models import Order, OrderItem, Produit
from .serializers import ProduitSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product_details = ProduitSerializer(source='product', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_details', 'quantity', 'price']
        read_only_fields = ['price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'nom_complet', 'email', 'telephone', 
            'adresse', 'ville', 'total_price', 'payment_method', 
            'status', 'transaction_id', 'is_paid', 'paid_at', 
            'created_at', 'items'
        ]
        read_only_fields = ['user', 'total_price', 'status', 'is_paid', 'paid_at', 'transaction_id']

    def create(self, validated_data):
        # La création se fera via une vue personnalisée pour gérer les OrderItems
        return super().create(validated_data)
