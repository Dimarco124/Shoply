import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiShoppingBag, FiTrash2, FiPlus, FiMinus,
    FiArrowLeft, FiDownload, FiSend
} from 'react-icons/fi';
import { useCart } from '../src/context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BonDeCommande from '../components/BonDeCommande';
import html2canvas from 'html2canvas';
import './Panier.css';

const Panier = () => {
    const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
    const [generatingImage, setGeneratingImage] = useState(false);
    const orderRef = useRef();

    const generateOrderImage = async () => {
        if (!orderRef.current) return;
        setGeneratingImage(true);
        try {
            const canvas = await html2canvas(orderRef.current, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false,
                allowTaint: true,
                useCORS: true,
            });
            const link = document.createElement('a');
            link.download = `commande-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (e) {
            console.error('Erreur génération image:', e);
        } finally {
            setGeneratingImage(false);
        }
    };

    const sendToWhatsApp = async () => {
        setGeneratingImage(true);
        try {
            const itemsList = cartItems
                .map(item =>
                    `${item.nom} - ${item.prix_format} x${item.quantity} = ${(item.prix * item.quantity).toLocaleString()} FCFA`
                )
                .join('\n');
            const message = `*NOUVELLE COMMANDE*\n\n${itemsList}\n\n*TOTAL: ${cartTotal.toLocaleString()} FCFA*`;
            window.open(`https://wa.me/221XXXXXXXXX?text=${encodeURIComponent(message)}`, '_blank');
        } catch (e) {
            console.error('Erreur WhatsApp:', e);
        } finally {
            setGeneratingImage(false);
        }
    };

    /* ── EMPTY STATE ── */
    if (cartItems.length === 0) {
        return (
            <div className="panier-page">
                <Header />
                <motion.div
                    className="pan-empty"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <FiShoppingBag className="pan-empty-icon" />
                    <h2>Votre panier est vide</h2>
                    <p>Découvrez nos produits et commencez vos achats</p>
                    <Link to="/shop" className="pan-empty-btn">
                        <FiArrowLeft /> Continuer mes achats
                    </Link>
                </motion.div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="panier-page">
            <Header />

            {/* Header */}
            <div className="pan-header">
                <div className="pan-container">
                    <div className="pan-header-inner">
                        <h1 className="pan-header-title">Mon Panier</h1>
                        <span className="pan-header-count">
                            {cartItems.length} article{cartItems.length > 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="pan-body">
                <div className="pan-container">
                    <div className="pan-grid">

                        {/* ── LEFT: ITEMS ── */}
                        <div className="pan-items-section">

                            {/* Hidden bon de commande for html2canvas */}
                            <div ref={orderRef} className="bon-commande-wrapper">
                                <BonDeCommande
                                    items={cartItems}
                                    total={cartTotal}
                                    note=""
                                    date={new Date()}
                                    numeroCommande={`CMD-${Date.now().toString().slice(-8)}`}
                                />
                            </div>

                            {/* Column headers */}
                            <div className="pan-items-header">
                                <span></span>
                                <span>Produit</span>
                                <span style={{ textAlign: 'center' }}>Quantité</span>
                                <span style={{ textAlign: 'center' }}>Total</span>
                                <span></span>
                            </div>

                            {/* Items */}
                            <AnimatePresence>
                                {cartItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        className="pan-item"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20, height: 0, padding: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <img
                                            className="pan-item-img"
                                            src={item.image}
                                            alt={item.nom}
                                        />

                                        <div className="pan-item-info">
                                            <div className="pan-item-cat">{item.categorie_nom}</div>
                                            <div className="pan-item-name">{item.nom}</div>
                                            <div className="pan-item-price">{item.prix_format}</div>
                                        </div>

                                        <div className="pan-qty">
                                            <button
                                                className="pan-qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                <FiMinus />
                                            </button>
                                            <span className="pan-qty-val">{item.quantity}</span>
                                            <button
                                                className="pan-qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <FiPlus />
                                            </button>
                                        </div>

                                        <div className="pan-item-total">
                                            {(item.prix * item.quantity).toLocaleString()} <span style={{ fontSize: '13px', color: 'var(--muted)' }}>FCFA</span>
                                        </div>

                                        <button
                                            className="pan-item-remove"
                                            onClick={() => removeFromCart(item.id)}
                                            title="Retirer"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Clear cart */}
                            <div className="pan-clear-row">
                                <button className="pan-clear-btn" onClick={clearCart}>
                                    Vider le panier
                                </button>
                            </div>
                        </div>

                        {/* ── RIGHT: SUMMARY ── */}
                        <div className="pan-summary">
                            <div className="pan-summary-header">
                                <div className="pan-summary-title">Récapitulatif</div>
                            </div>

                            <div className="pan-summary-body">
                                <div className="pan-summary-row">
                                    <span>Sous-total</span>
                                    <span className="val">{cartTotal.toLocaleString()} FCFA</span>
                                </div>


                                <div className="pan-divider" />

                                <div className="pan-total-row">
                                    <span className="pan-total-label">Total</span>
                                    <span className="pan-total-amount">{cartTotal.toLocaleString()} <span style={{ fontSize: '16px', color: 'var(--muted)' }}>FCFA</span></span>
                                </div>

                                <Link
                                    to="/checkout"
                                    className="pan-btn-checkout"
                                >
                                    <FiSend />
                                    Passer à la caisse
                                </Link>

                                <button
                                    className="pan-btn-download"
                                    onClick={generateOrderImage}
                                    disabled={generatingImage}
                                >
                                    <FiDownload />
                                    {generatingImage ? 'Génération...' : 'Télécharger le bon de commande'}
                                </button>

                                <p className="pan-payment-info">
                                    Paiement sécurisé via<br />
                                    Wave · Orange · MTN · Moov · WhatsApp
                                </p>
                            </div>
                        </div>

                    </div>

                    <Link to="/shop" className="pan-continue-link">
                        <FiArrowLeft /> Continuer mes achats
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Panier;