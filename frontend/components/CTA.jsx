import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import './CTA.css';

const CTA = () => {
return (
    <section className="cta-section">
    {/* Éléments décoratifs */}
    <div className="cta-decor cta-decor-1" />
    <div className="cta-decor cta-decor-2" />
    <div className="cta-decor cta-decor-3" />

    <div className="cta-inner">
        <motion.div
        className="cta-content"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
        >
        {/* Badge */}
        <motion.span
            className="cta-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
        >
            <FiShoppingBag /> Livraison rapide à Yamoussoukro
        </motion.span>

        {/* Titre */}
        <motion.h2
            className="cta-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
        >
            Prêt à découvrir<br />
            <span className="cta-title-accent">nos meilleurs produits ?</span>
        </motion.h2>

        {/* Sous-titre */}
        <motion.p
            className="cta-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            viewport={{ once: true }}
        >
            Des articles soigneusement sélectionnés, un paiement sécurisé
            et une livraison rapide — tout ça en quelques clics.
        </motion.p>

        {/* Boutons */}
        <motion.div
            className="cta-actions"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.48 }}
            viewport={{ once: true }}
        >
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link to="/shop" className="cta-btn-primary">
                Commander maintenant
                <FiArrowRight className="btn-icon" />
            </Link>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link to="/shop" className="cta-btn-secondary">
                Voir la boutique
            </Link>
            </motion.div>
        </motion.div>

        {/* Gages de confiance */}
        <motion.div
            className="cta-trust"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
        >
            {['✓ Paiement sécurisé', '✓ 1ère livraison gratuite', '✓ Support WhatsApp'].map((item, i) => (
            <span key={i} className="trust-item">{item}</span>
            ))}
        </motion.div>
        </motion.div>
    </div>
    </section>
);
};

export default CTA;