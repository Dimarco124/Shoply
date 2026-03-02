import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiTruck } from 'react-icons/fi';
import './LivraisonGratuite.css';

const LivraisonGratuite = () => {
return (
    <section className="livraison-banner">
    {/* Image de fond avec overlay */}
    <div className="livraison-bg">
        <img
        src="/images/bannnn.jpg"
        alt="Livraison gratuite"
        className="livraison-bg-img"
        />
        <div className="livraison-overlay" />
    </div>

    {/* Contenu — aligné à droite comme l'image */}
    <div className="livraison-content">
        <motion.div
        className="livraison-inner"
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        viewport={{ once: true }}
        >
        <motion.div
            className="livraison-icon"
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
        >
            <FiTruck />
        </motion.div>

        <motion.h2
            className="livraison-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
        >
            VOTRE 1ÈRE<br />LIVRAISON<br />EST GRATUITE
        </motion.h2>

        <motion.p
            className="livraison-desc"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            viewport={{ once: true }}
        >
            Commandez dès maintenant et profitez de la livraison offerte
            sur votre première commande à Yamoussoukro.
        </motion.p>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            viewport={{ once: true }}
        >
            <Link to="/shop" className="livraison-btn">
            DÉCOUVRIR NOS PRODUITS
            </Link>
        </motion.div>
        </motion.div>
    </div>
    </section>
);
};

export default LivraisonGratuite;