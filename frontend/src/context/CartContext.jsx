    import React, { createContext, useState, useContext, useEffect } from 'react';

    const CartContext = createContext();

    export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
    };

    export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    // Charger le panier depuis localStorage au démarrage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
        try {
            const parsedCart = JSON.parse(savedCart);
            setCartItems(parsedCart);
        } catch (error) {
            console.error('Erreur chargement panier:', error);
        }
        }
    }, []);

    // Sauvegarder dans localStorage à chaque modification
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        
        // Mettre à jour le compteur et le total
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        const total = cartItems.reduce((sum, item) => sum + (item.prix * item.quantity), 0);
        
        setCartCount(count);
        setCartTotal(total);
    }, [cartItems]);

    // Ajouter un article au panier
    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        
        if (existingItem) {
            // Si l'article existe déjà, augmenter la quantité
            return prevItems.map(item =>
            item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
        } else {
            // Sinon, ajouter le nouvel article
            return [...prevItems, {
            id: product.id,
            nom: product.nom,
            prix: product.prix,
            prix_format: product.prix_format,
            image: product.image,
            quantity: quantity
            }];
        }
        });
    };

    // Retirer un article du panier
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    // Modifier la quantité d'un article
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
        }
        
        setCartItems(prevItems =>
        prevItems.map(item =>
            item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
        );
    };

    // Vider le panier
    const clearCart = () => {
        setCartItems([]);
    };

    // Vérifier si un produit est dans le panier
    const isInCart = (productId) => {
        return cartItems.some(item => item.id === productId);
    };

    // Obtenir la quantité d'un produit dans le panier
    const getItemQuantity = (productId) => {
        const item = cartItems.find(item => item.id === productId);
        return item ? item.quantity : 0;
    };

    const value = {
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity
    };

    return (
        <CartContext.Provider value={value}>
        {children}
        </CartContext.Provider>
    );
    };