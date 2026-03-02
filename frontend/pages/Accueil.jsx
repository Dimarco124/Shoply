import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiTruck, FiShield, FiClock, FiStar, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import { categorieService, produitService, getBackendBaseUrl, getImageUrl } from '../services/api';
import './Accueil.css';
import Temoignages from '../components/Temoignages';
import Footer from '../components/Footer';
import CTA from '../components/CTA';
import { useCart } from '../src/context/CartContext';
import LivraisonGratuite from '../components/LivraisonGratuite';
import PromoBanner from '../components/PromoBanner';

import noteSimulee from '../src/utils/noteSimulee';


const STACK_MAX = 3; // Nb de catégories max dans la colonne droite

const Accueil = () => {



    const { addToCart } = useCart();

    const [categories, setCategories] = useState([]);
    const [produitsPhare, setProduitsPhare] = useState([]);
    const [derniersProduits, setDerniersProduits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [panierCount, setPanierCount] = useState(0);
    const [selectedCategorie, setSelectedCategorie] = useState(null);
    const [heroSlide, setHeroSlide] = useState(0);
    const autoSlideRef = useRef(null);

    const handleAddToCart = (produit, e) => {
        e.preventDefault();
        addToCart(produit, 1);
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [cats, phares, derniers] = await Promise.all([
                    categorieService.getAll(),
                    produitService.getPhare(),
                    produitService.getDerniersProduits(25)
                ]);
                setCategories(Array.isArray(cats) ? cats : []);
                setProduitsPhare(Array.isArray(phares) ? phares : []);
                setDerniersProduits(Array.isArray(derniers) ? derniers : []);
            } catch (error) {
                console.error('Erreur chargement données:', error);
                setCategories([]);
                setProduitsPhare([]);
                setDerniersProduits([]);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);



    const stackCategories = categories.slice(1, STACK_MAX + 1);         // index 1,2,3
    const sliderCategories = [
        categories[0],
        ...categories.slice(STACK_MAX + 1)
    ].filter(Boolean);                                                   // index 0, puis 4,5,6...

    // Auto-slide
    useEffect(() => {
        if (sliderCategories.length <= 1) return;
        autoSlideRef.current = setInterval(() => {
            setHeroSlide(prev => (prev + 1) % sliderCategories.length);
        }, 3500);
        return () => clearInterval(autoSlideRef.current);
    }, [sliderCategories.length]);

    // getImageUrl est maintenant importé de ../services/api

    const currentSlide = sliderCategories[heroSlide];

    const apiVide = !loading && categories.length === 0 && derniersProduits.length === 0;

    return (
        <div className="site-wrapper">
            <Header panierCount={panierCount} />
            {apiVide && (
                <div className="api-off-banner" role="alert">
                    <p><strong>Données non chargées.</strong> Vérifiez que le backend Django est démarré (<code>python manage.py runserver</code> dans le dossier backend) et que l&apos;URL API est correcte (fichier <code>.env</code> ou <code>VITE_API_URL</code>).</p>
                </div>
            )}
            <Hero />

            {/* Catégories Section */}
            <section className="section categories-section">
                <div className="categories-layoutt">

                    {/* ── LEFT : Hero Slider ── */}
                    {currentSlide && (
                        <motion.div
                            className="categories-heroo"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            viewport={{ once: true }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide.id}
                                    className="hero-slide-content"
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -18 }}
                                    transition={{ duration: 0.55, ease: "linear" }}
                                >
                                    <Link to={`/shop?categorie=${currentSlide.id}`} className="heroo-category-link">
                                        <span className="hero-tag">✦ 100% Naturel</span>
                                        <h2 className="hero-category-title">{currentSlide.nom}</h2>
                                        {currentSlide.description && (
                                            <p className="hero-category-desc">{currentSlide.description}</p>
                                        )}
                                        <span className="hero-shop-btn">VOIR LA COLLECTION</span>
                                    </Link>

                                    {/* Image flottante */}
                                    <motion.div
                                        className="heroo-category-image"
                                        initial={{ opacity: 0, scale: 0.88 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.88 }}
                                        transition={{ duration: 0.55 }}
                                    >
                                        <img
                                            src={getImageUrl(currentSlide.image)}
                                            alt={currentSlide.nom}
                                        />
                                    </motion.div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Dots — 1 dot par slide */}
                            <div className="hero-dots">
                                {sliderCategories.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`hero-dot ${i === heroSlide ? 'active' : ''}`}
                                        onClick={() => {
                                            setHeroSlide(i);
                                            clearInterval(autoSlideRef.current);
                                            autoSlideRef.current = setInterval(() => {
                                                setHeroSlide(prev => (prev + 1) % sliderCategories.length);
                                            }, 5000);
                                        }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── RIGHT : Stack (toujours les 3 premières après index 0) ── */}
                    <div className="categories-stack">
                        {loading ? (
                            <div className="loading">Chargement des catégories...</div>
                        ) : (
                            stackCategories.map((categorie, index) => (
                                <motion.div
                                    key={categorie.id}
                                    className="category-stack-card"
                                    initial={{ opacity: 0, x: 60 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.55, delay: index * 0.13, ease: "easeOut" }}
                                    viewport={{ once: true }}
                                    whileHover={{ scale: 1.015 }}
                                >
                                    <Link to={`/shop?categorie=${categorie.id}`} className="stack-card-link">
                                        <div className="stack-card-content">
                                            <div className="stack-card-text">
                                                <span className="stack-discount">
                                                    {categorie.remise ? `${categorie.remise}% Off` : "Nouveau"}
                                                </span>
                                                <div className="stack-sale-divider">
                                                    <span className="sale-label">SOLDES</span>
                                                </div>
                                                <h3 className="stack-category-name">{categorie.nom}</h3>
                                                <span className="stack-shop-link">
                                                    Voir la collection <FiArrowRight />
                                                </span>
                                            </div>
                                            <div className="stack-card-image">
                                                <img src={getImageUrl(categorie.image)} alt={categorie.nom} />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </div>

                </div>
            </section>

            {/* Produits Phares */}
            {derniersProduits.length > 0 && (
                <section className="produits-phares-section">
                    <div className="container">

                        {/* Header : titre gauche + filtres catégories droite */}
                        <motion.div
                            className="produits-phares-header"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="produits-phares-title">
                                <span>NEW</span> PRODUCT
                            </h2>

                            {categories.length > 0 && (
                                <nav className="produits-phares-nav">
                                    <button
                                        className={`nav-filter-btn ${!selectedCategorie ? 'active' : ''}`}
                                        onClick={() => setSelectedCategorie(null)}
                                    >
                                        All
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            className={`nav-filter-btn ${selectedCategorie === cat.id ? 'active' : ''}`}
                                            onClick={() => setSelectedCategorie(cat.id)}
                                        >
                                            {cat.nom}
                                        </button>
                                    ))}
                                </nav>
                            )}
                        </motion.div>

                        {/* Grille produits */}
                        {loading ? (
                            <div className="loading">Chargement des produits...</div>
                        ) : (
                            <div className="produits-phares-grid">
                                {(selectedCategorie
                                    ? derniersProduits.filter(p => p.categorie === selectedCategorie || p.categorie?.id === selectedCategorie)
                                    : derniersProduits
                                ).slice(0, 25).map((produit, index) => (
                                    <motion.div
                                        key={produit.id}
                                        className="produit-phare-card"
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.45, delay: (index % 4) * 0.08 }}
                                        viewport={{ once: true }}
                                    >
                                        <Link to={`/produit/${produit.id}`} className="produit-phare-link">

                                            {/* Image + badge */}
                                            <div className="produit-phare-image">
                                                <img
                                                    src={getImageUrl(produit.image)}
                                                    alt={produit.nom}
                                                    loading="lazy"
                                                />
                                                {produit.est_nouveau && (
                                                    <span className="produit-badge badge-new">NEW</span>
                                                )}
                                                {produit.en_solde && (
                                                    <span className="produit-badge badge-sale">SALE</span>
                                                )}
                                                {produit.stock === 0 && (
                                                    <span className="produit-badge badge-out">OUT OF STOCK</span>
                                                )}
                                            </div>

                                            {/* Infos */}
                                            <div className="produit-phare-info">
                                                <h3 className="produit-phare-nom">{produit.nom}</h3>
                                                <div className="produit-phare-notes">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FiStar
                                                            key={i}
                                                            className={i < noteSimulee(produit.id) ? 'star-filled' : 'star-empty'}
                                                        />
                                                    ))}
                                                </div>
                                                {/* Prix + bouton panier sur la même ligne */}
                                                <div className="produit-phare-footer">
                                                    <span className="produit-phare-prix">{produit.prix_format}</span>
                                                    <button
                                                        className="produit-phare-cart-btn"
                                                        onClick={(e) => handleAddToCart(produit, e)}
                                                        title="Ajouter au panier"
                                                    >
                                                        <FiShoppingBag />
                                                    </button>
                                                </div>
                                            </div>

                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                    </div>
                </section>
            )}



            {/* Livraison Gratuite */}
            <LivraisonGratuite />


            {/* Valeurs */}
            <section className="section">
                <div className="container">
                    <div className="valeurs-grid">
                        {[
                            { icon: <FiTruck />, title: 'Livraison rapide', desc: '24/48h à Yamoussoukro' },
                            { icon: <FiShield />, title: 'Paiement sécurisé', desc: 'Orange Money, Wave, CB' },
                            { icon: <FiClock />, title: 'Service client', desc: 'Réponse sous 30 min' },
                            { icon: <FiStar />, title: 'Qualité garantie', desc: 'Produits sélectionnés' },
                        ].map((valeur, index) => (
                            <motion.div
                                key={index}
                                className="valeur-items"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}

                            >
                                <div className="valeur-icon">{valeur.icon}</div>
                                <h3 className="valeur-title">{valeur.title}</h3>
                                <p className="valeur-desc">{valeur.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Temoignages />

            <CTA />
            <PromoBanner />
            <Footer />
        </div>
    );
};

export default Accueil;