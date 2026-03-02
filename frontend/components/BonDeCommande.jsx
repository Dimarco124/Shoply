import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import './BonDeCommande.css';
import { produitService, getBackendBaseUrl } from '../services/api';

const BonDeCommande = ({ items, total, note, date, numeroCommande }) => {
const dateFormatee = date ? format(date, 'EEEE d MMMM yyyy à HH:mm', { locale: fr }) : '';

const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/default-category.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${getBackendBaseUrl()}${imagePath}`;
};

return (
    <div className="bon-commande">
    {/* En-tête */}
    <div className="bon-header">
        <h1 className="shop-name">Boutique.</h1>
        <p className="document-title">Récapitulatif de la Commande</p>
        <p className="date">{dateFormatee}</p>
    </div>

    {/* Séparateur décoratif */}
    <div className="separator">
        <span className="separator-line"></span>
        <span className="separator-icon">✦</span>
        <span className="separator-line"></span>
    </div>

    {/* Détails de la commande */}
    <div className="command-details">
        <h2 className="section-title">Détails de la Commande</h2>
        
        <div className="items-list">
        {items.map((item) => (
            <div key={item.id} className="item-row">
            {/* Image du produit */}
            <div className="item-image">
                <img 
                src={getImageUrl(item.image)} 
                alt={item.nom}
                />
            </div>
            
            {/* Informations produit */}
            <div className="item-info">
                <h3 className="item-title">{item.nom}</h3>
            </div>
            
            {/* Prix et quantité */}
            <div className="item-pricing">
                <div className="price-per-unit">
                <span className="price">{item.prix.toFixed(2)}</span>
                <span className="currency">FCFA</span>
                </div>
                <div className="quantity-info">
                <span className="price">{item.prix.toFixed(2)} FCFA</span>
                <span className="times">×</span>
                <span className="quantity-number">{item.quantity}</span>
                </div>
            </div>
            </div>
        ))}
        </div>
    </div>

    {/* Séparateur */}
    <div className="separator-light"></div>

    {/* Total */}
    <div className="totals-section">
        
        <div className="grand-total">
        <span className="grand-total-label">TOTAL:</span>
        <span className="grand-total-amount">{total.toFixed(2)} FCFA</span>
        </div>
    </div>

    {/* Séparateur décoratif */}
    <div className="separator">
        <span className="separator-line"></span>
        <span className="separator-icon">✦</span>
        <span className="separator-line"></span>
    </div>

    {/* Pied de page */}
    <div className="bon-footer">
        <p className="footer-message">
        Merci pour votre commande !
        </p>
        
        {note && (
        <div className="order-note">
            <strong>Note:</strong> {note}
        </div>
        )}
        
        <div className="contact-info">
        <p className="phone">+225 055 435 60 19</p>
        <p className="whatsapp">WhatsApp: +225 055 435 60 19</p>
        </div>
    </div>
    </div>
);
};

export default BonDeCommande;