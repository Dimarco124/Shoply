import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { produitService, getBackendBaseUrl } from '../services/api';
import { useCart } from '../src/context/CartContext';
import './PromoBanner.css';

const PromoBanner = () => {
const [produit, setProduit] = useState(null);
const [loading, setLoading] = useState(true);
const [added, setAdded] = useState(false);
const { addToCart } = useCart();
const navigate = useNavigate();

useEffect(() => {
    const fetchProduit = async () => {
    try {
        // Récupère directement le produit 10
        const data = await produitService.getById(10);
        setProduit(data);
    } catch (error) {
        console.error('Erreur chargement produit promo:', error);
    } finally {
        setLoading(false);
    }
    };
    fetchProduit();
}, []);

const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/default-category.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${getBackendBaseUrl()}${imagePath}`;
};

const handleBuy = (e) => {
    e.preventDefault();
    if (!produit) return;
    addToCart(produit, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
};

const handleNavigate = () => {
    navigate('/shop?categorie=2');
};

if (loading) return null; // ne rien afficher pendant le chargement
if (!produit) return null;

return (
    <section className="promo-banner">
    <div className="promo-inner">

        {/* ── Colonne gauche : texte ── */}
        <motion.div
        className="promo-text"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        viewport={{ once: true }}
        >
        <motion.h2
            className="promo-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
        >
            <strong>{produit.nom}</strong>
            <span className="promo-subtitle">dans Notre Boutique</span>
        </motion.h2>

        {produit.description && (
            <motion.p
            className="promo-desc"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            viewport={{ once: true }}
            >
            {produit.description.substring(0, 130)}
            {produit.description.length > 130 ? '...' : ''}
            </motion.p>
        )}

        <motion.div
            className="promo-actions"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.38 }}
            viewport={{ once: true }}
        >
            <button className="promo-buy-btn" onClick={handleBuy}>
            <FiShoppingBag />
            {added ? 'Produit ajouté !' : 'Ajouter au panier'}
            </button>
            <button className="promo-more-btn" onClick={handleNavigate}>
            Voir la catégorie
            </button>
        </motion.div>
        </motion.div>

        {/* ── Colonne droite : badge prix + image ── */}
        <div className="promo-visual">

        {/* Badge prix rond */}
        <motion.div
            className="promo-price-badge"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 200 }}
            viewport={{ once: true }}
        >
            <span className="badge-amount">
            {produit.prix_format || `${produit.prix} FCFA`}
            </span>
            <span className="badge-unit">/ unité</span>
        </motion.div>

        {/* Image produit */}
        <motion.div
            className="promo-image"
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            viewport={{ once: true }}
        >
            <img
            src={getImageUrl(produit.image)}
            alt={produit.nom}
            />
        </motion.div>

        </div>
    </div>
    </section>
);
};

export default PromoBanner;