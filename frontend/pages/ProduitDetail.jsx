import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiShoppingBag, FiArrowLeft, FiPlus, FiMinus,
    FiTruck, FiShield, FiClock, FiStar, FiCheck,
    FiRefreshCcw, FiMessageCircle, FiGift
} from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { produitService, getBackendBaseUrl, getImageUrl } from '../services/api';
import { useCart } from '../src/context/CartContext';
import './ProduitDetail.css';

const ProduitDetail = () => {
    const { addToCart } = useCart();
    const { id } = useParams();
    const [produit, setProduit] = useState(null);
    const [produitsSimilaires, setProduitsSimilaires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingSimilaires, setLoadingSimilaires] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => { loadProduit(); }, [id]);

    const loadProduit = async () => {
        try {
            setLoading(true);
            const data = await produitService.getById(id);
            setProduit(data);
            if (data.categorie) loadProduitsSimilaires(data.categorie, data.id);
        } catch (e) {
            console.error('Erreur chargement produit:', e);
        } finally {
            setLoading(false);
        }
    };

    const loadProduitsSimilaires = async (categorieId, currentProductId) => {
        try {
            setLoadingSimilaires(true);
            const data = await produitService.getAll({
                categorie: categorieId,
                disponible: true,
                ordering: '-date_creation',
            });
            const similaires = (data.results || data)
                .filter(p => p.id !== parseInt(currentProductId))
                .slice(0, 4);
            setProduitsSimilaires(similaires);
        } catch (e) {
            console.error('Erreur produits similaires:', e);
        } finally {
            setLoadingSimilaires(false);
        }
    };

    const handleQuantityChange = (delta) =>
        setQuantity(prev => Math.max(1, prev + delta));

    const triggerAdded = () => {
        setAdded(true);
        setTimeout(() => setAdded(false), 2500);
    };

    const handleAddToCart = () => {
        addToCart(produit, quantity);
        triggerAdded();
    };

    const handleAddSimilaireToCart = (p, e) => {
        e.preventDefault();
        addToCart(p, 1);
        triggerAdded();
    };

    // getImageUrl est maintenant importé de ../services/api

    return (
        <div className="pdp-page">
            <Header />

            {/* ── LOADING ── */}
            {loading && (
                <div className="pdp-loading">
                    <div className="pdp-spinner" />
                    <p>Chargement en cours</p>
                </div>
            )}

            {/* ── NOT FOUND ── */}
            {!loading && !produit && (
                <div className="pdp-not-found">
                    <h2>Produit introuvable</h2>
                    <Link to="/shop" className="pdp-back-link">
                        <FiArrowLeft /> Retour à la boutique
                    </Link>
                </div>
            )}

            {/* ── CONTENT ── */}
            {!loading && produit && (
                <>

                    {/* Main grid */}
                    <section className="pdp-main">
                        <div className="pdp-container">
                            <div className="pdp-grid">

                                {/* Gallery */}
                                <motion.div
                                    className="pdp-gallery"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <div className="pdp-image-wrap">
                                        <img src={getImageUrl(produit.image)} alt={produit.nom} />
                                        {!produit.disponible && (
                                            <span className="pdp-out-of-stock-badge">Rupture de stock</span>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Info */}
                                <motion.div
                                    className="pdp-info"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <span className="pdp-category-tag">{produit.categorie_nom}</span>
                                    <h1 className="pdp-title">{produit.nom}</h1>

                                    <div className="pdp-rating">
                                        <div className="pdp-stars">
                                            {[...Array(5)].map((_, i) => <FiStar key={i} className="pdp-star" />)}
                                        </div>
                                        <span className="pdp-rating-text">5.0 · 12 avis vérifiés</span>
                                    </div>

                                    {/* Prix + icône panier rapide */}
                                    <div className="pdp-price-row">
                                        <div className="pdp-price">{produit.prix_format}</div>
                                        <button
                                            className="pdp-cart-icon-btn"
                                            onClick={handleAddToCart}
                                            disabled={!produit.disponible}
                                            title="Ajouter au panier"
                                        >
                                            <FiShoppingBag />
                                        </button>
                                    </div>

                                    <div className={`pdp-stock ${produit.disponible ? 'in-stock' : 'out-of-stock'}`}>
                                        <span className="pdp-stock-dot" />
                                        <span className="pdp-stock-label">
                                            {produit.disponible ? 'En stock' : 'Rupture de stock'}
                                        </span>
                                    </div>

                                    <div className="pdp-description">
                                        <div className="pdp-description-label">Description</div>
                                        <p>{produit.description}</p>
                                    </div>

                                    {/* Quantité + ajouter */}
                                    <div className="pdp-actions">
                                        <div className="pdp-qty">
                                            <button
                                                className="pdp-qty-btn"
                                                onClick={() => handleQuantityChange(-1)}
                                                disabled={!produit.disponible}
                                            >
                                                <FiMinus />
                                            </button>
                                            <span className="pdp-qty-val">{quantity}</span>
                                            <button
                                                className="pdp-qty-btn"
                                                onClick={() => handleQuantityChange(1)}
                                                disabled={!produit.disponible}
                                            >
                                                <FiPlus />
                                            </button>
                                        </div>

                                        <button
                                            className="pdp-add-btn"
                                            onClick={handleAddToCart}
                                            disabled={!produit.disponible}
                                        >
                                            <FiShoppingBag />
                                            <span>Ajouter au panier</span>
                                        </button>
                                    </div>

                                    {/* Livraison */}
                                    <div className="pdp-delivery">
                                        {[
                                            { icon: <FiTruck />, label: 'Livraison rapide', sub: '48h max' },
                                            { icon: <FiShield />, label: 'Paiement sécurisé', sub: 'Orange Money · Wave · MTN money · Espèces · Moov money' },
                                            { icon: <FiClock />, label: 'Service client', sub: 'Réponse sous 30 min' },
                                        ].map((item, i) => (
                                            <div className="pdp-delivery-item" key={i}>
                                                <div className="pdp-delivery-icon">{item.icon}</div>
                                                <div className="pdp-delivery-label">{item.label}</div>
                                                <div className="pdp-delivery-sub">{item.sub}</div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* Avantages */}
                    <section className="pdp-avantages">
                        <div className="pdp-container">
                            <div className="pdp-avantages-grid">
                                {[
                                    { icon: <FiShield size={32} />, title: 'Garantie qualité', sub: 'Produits authentiques et contrôlés' },
                                    { icon: <FiRefreshCcw size={32} />, title: 'Retour gratuit', sub: 'Sous 14 jours' },
                                    { icon: <FiMessageCircle size={32} />, title: 'Support WhatsApp', sub: '24h/24, 7j/7' },
                                    { icon: <FiGift size={32} />, title: 'Emballage cadeau', sub: 'Sur demande' },
                                ].map((a, i) => (
                                    <div className="pdp-avantage" key={i}>
                                        <span className="pdp-avantage-icon">{a.icon}</span>
                                        <h4>{a.title}</h4>
                                        <p>{a.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Produits similaires */}
                    <section className="pdp-similaires">
                        <div className="pdp-container">
                            <div className="pdp-section-header">
                                <h2 className="pdp-section-title">Vous aimerez aussi</h2>
                                <div className="pdp-section-line" />
                            </div>

                            {loadingSimilaires ? (
                                <div className="pdp-loading" style={{ minHeight: '200px' }}>
                                    <div className="pdp-spinner" />
                                </div>
                            ) : produitsSimilaires.length > 0 ? (
                                <div className="pdp-similaires-grid">
                                    {produitsSimilaires.map((p, i) => (
                                        <motion.div
                                            key={p.id}
                                            className="pdp-sim-card"
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                        >
                                            <Link to={`/produit/${p.id}`} style={{ textDecoration: 'none' }}>
                                                <div className="pdp-sim-img">
                                                    <img src={getImageUrl(p.image)} alt={p.nom} />
                                                    {!p.disponible && <span className="pdp-sim-rupture">Rupture</span>}
                                                </div>
                                                <div className="pdp-sim-body">
                                                    <div className="pdp-sim-cat">{p.categorie_nom}</div>
                                                    <div className="pdp-sim-nom">{p.nom}</div>
                                                </div>
                                            </Link>

                                            {/* Prix + icône panier */}
                                            <div className="pdp-sim-footer">
                                                <div className="pdp-sim-prix">{p.prix_format}</div>
                                                <button
                                                    className="pdp-sim-cart-btn"
                                                    onClick={(e) => handleAddSimilaireToCart(p, e)}
                                                    title="Ajouter au panier"
                                                >
                                                    <FiShoppingBag />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--muted)', fontSize: '13px', textAlign: 'center', padding: '48px 0' }}>
                                    Aucun produit similaire disponible
                                </p>
                            )}
                        </div>
                    </section>
                </>
            )}

            <Footer />

            {/* Toast confirmation */}
            <AnimatePresence>
                {added && (
                    <motion.div
                        className="pdp-added-notif"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.28 }}
                    >
                        <FiCheck /> Ajouté au panier
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProduitDetail;