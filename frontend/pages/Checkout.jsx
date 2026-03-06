import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCreditCard, FiMessageCircle, FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../src/context/CartContext';
import { useAuth } from '../src/context/AuthContext';
import { orderService } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Checkout.css';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);
    const [formData, setFormData] = useState({
        nom_complet: user?.first_name ? `${user.first_name} ${user.last_name}` : '',
        email: user?.email || '',
        telephone: '',
        adresse: '',
        ville: 'Abidjan',
        payment_method: 'WHATSAPP'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                ...formData,
                items: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity
                }))
            };

            const response = await orderService.create(orderData);

            if (formData.payment_method === 'WHATSAPP') {
                // Flux WhatsApp
                const itemsList = cartItems
                    .map(item => `${item.nom} x${item.quantity}`)
                    .join('\n');
                const message = `*COMMANDE #${response.id}*\n\nClient: ${formData.nom_complet}\nArticles:\n${itemsList}\n\n*TOTAL: ${cartTotal.toLocaleString()} FCFA*\n\nJe souhaite régler par Wave/Orange Money.`;
                window.open(`https://wa.me/2250554356019?text=${encodeURIComponent(message)}`, '_blank');
            } else if (formData.payment_method === 'GENIUSPAY') {
                if (response.checkout_url) {
                    window.location.href = response.checkout_url;
                    return; // On s'arrête ici car on redirige
                } else {
                    alert("Erreur d'initiation du paiement GeniusPay. Veuillez essayer WhatsApp ou réessayez plus tard.");
                }
            }

            setOrderSuccess(response);
            clearCart();
        } catch (error) {
            console.error('Erreur commande:', error);
            alert("Une erreur est survenue lors de la création de la commande.");
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="checkout-page">
                <Header />
                <div className="checkout-container success-container">
                    <motion.div
                        className="success-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <FiCheckCircle className="success-icon" />
                        <h2>Commande Réussie !</h2>
                        <p>Votre commande <strong>#{orderSuccess.id}</strong> a bien été enregistrée.</p>
                        <p>Merci pour votre confiance.</p>
                        <div className="success-actions">
                            <Link to="/mon-compte" className="btn-primary">Voir mes commandes</Link>
                            <Link to="/" className="btn-secondary">Retour à l'accueil</Link>
                        </div>
                    </motion.div>
                </div>
                <Footer />
            </div>
        );
    }

    if (cartItems.length === 0) {
        navigate('/panier');
        return null;
    }

    return (
        <div className="checkout-page">
            <Header />
            <div className="checkout-container">
                <div className="checkout-grid">
                    {/* Colonne de gauche : Formulaire */}
                    <div className="checkout-form-section">
                        <Link to="/panier" className="back-link">
                            <FiArrowLeft /> Retour au panier
                        </Link>
                        <h1 className="checkout-title">Finaliser ma commande</h1>

                        <form onSubmit={handleSubmit} className="checkout-form">
                            <div className="form-section">
                                <h3 className="section-title">Coordonnées de livraison</h3>
                                <div className="form-group">
                                    <label>Nom Complet</label>
                                    <input
                                        type="text" name="nom_complet" required
                                        value={formData.nom_complet} onChange={handleChange}
                                        placeholder="Ex: Jean Kouassi"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email" name="email" required
                                            value={formData.email} onChange={handleChange}
                                            placeholder="votre@email.com"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Téléphone</label>
                                        <input
                                            type="tel" name="telephone" required
                                            value={formData.telephone} onChange={handleChange}
                                            placeholder="07 00 00 00 00"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Adresse de livraison précise</label>
                                    <textarea
                                        name="adresse" required
                                        value={formData.adresse} onChange={handleChange}
                                        placeholder="Ex: Riviera Palmeraie, Rue de la Paix, Immeuble Horizon"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Ville</label>
                                    <input
                                        type="text" name="ville" required
                                        value={formData.ville} onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="section-title">Mode de paiement</h3>
                                <div className="payment-options">
                                    <label className={`payment-card ${formData.payment_method === 'GENIUSPAY' ? 'active' : ''}`}>
                                        <input
                                            type="radio" name="payment_method" value="GENIUSPAY"
                                            checked={formData.payment_method === 'GENIUSPAY'}
                                            onChange={handleChange}
                                        />
                                        <div className="payment-content">
                                            <FiCreditCard className="pay-icon" />
                                            <div className="pay-text">
                                                <span className="pay-name">Paiement Mobile (GeniusPay)</span>
                                                <span className="pay-desc">Wave, Orange, MTN, Moov</span>
                                            </div>
                                        </div>
                                    </label>

                                    <label className={`payment-card ${formData.payment_method === 'WHATSAPP' ? 'active' : ''}`}>
                                        <input
                                            type="radio" name="payment_method" value="WHATSAPP"
                                            checked={formData.payment_method === 'WHATSAPP'}
                                            onChange={handleChange}
                                        />
                                        <div className="payment-content">
                                            <FiMessageCircle className="pay-icon" />
                                            <div className="pay-text">
                                                <span className="pay-name">Commander via WhatsApp</span>
                                                <span className="pay-desc">Paiement manuel direct</span>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="btn-pay-now" disabled={loading}>
                                {loading ? 'Traitement...' : formData.payment_method === 'GENIUSPAY' ? 'Payer maintenant' : 'Confirmer la commande'}
                            </button>
                        </form>
                    </div>

                    {/* Colonne de droite : Résumé */}
                    <div className="checkout-summary-section">
                        <div className="summary-card">
                            <h3 className="summary-title">Résumé du panier</h3>
                            <div className="summary-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <div className="item-info">
                                            <span className="item-qty">{item.quantity}x</span>
                                            <span className="item-name">{item.nom}</span>
                                        </div>
                                        <span className="item-price">{(item.prix * item.quantity).toLocaleString()} FCFA</span>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-divider" />
                            <div className="summary-total">
                                <span>Total à payer</span>
                                <span className="total-amount">{cartTotal.toLocaleString()} FCFA</span>
                            </div>
                            <div className="security-notice">
                                <FiCheckCircle /> Transaction 100% sécurisée
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;
