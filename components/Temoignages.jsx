

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiArrowLeft, FiStar } from 'react-icons/fi';
import { FaQuoteRight } from 'react-icons/fa';
import './Temoignages.css';

const temoignages = [
{
id: 1,
nom: 'Kouassi Jean-Baptiste',
ville: 'Entrepreneur, Yamoussoukro',
photo: '/pers_temoi/temoignage_1.jpg',
commentaire: 'Les produits sont d\'une qualité exceptionnelle ! La livraison a été rapide, en seulement 24h à Yamoussoukro. Je recommande vivement cette boutique à tous mes proches.',
note: 5,
},
{
id: 2,
nom: 'Aya Virginie',
ville: 'Commerçante, Yamoussoukro',
photo: '/pers_temoi/temoignage_6.jpg',
commentaire: 'Service client au top ! Ils m\'ont conseillé par WhatsApp et ma commande est arrivée parfaite. Le paiement Orange Money a été simple et j\'ai même payé à la livraison.',
note: 5,
},
{
id: 3,
nom: 'Konan Olivier',
ville: 'Ingénieur, Yamoussoukro',
photo: '/pers_temoi/temoignage_2.jpg',
commentaire: 'Je suis un client fidèle depuis 6 mois. Les produits sont toujours conformes et la livraison est gratuite. Un vrai plaisir de faire ses achats ici !',
note: 5,
},
{
id: 4,
nom: 'Koffi Amoin',
ville: 'Enseignante, Yamoussoukro',
photo: '/pers_temoi/temoignage_4.jpg',
commentaire: 'Le service WhatsApp est génial ! J\'ai pu commander directement et suivre ma livraison. Les produits sont arrivés dans un emballage soigné et professionnel.',
note: 5,
},
{
id: 5,
nom: 'N\'Guessan Armandine',
ville: 'Couturière, Yamoussoukro',
photo: '/pers_temoi/temoignage_5.jpg',
commentaire: 'Rapport qualité-prix imbattable ! La livraison jusqu\'à Morofé a pris 2 jours mais le colis était bien protégé. Je recommande à 100%.',
note: 4,
},
{
id: 6,
nom: 'Traoré Ibrahim',
ville: 'Directeur, Daloa',
photo: '/pers_temoi/temoignage_3.jpg',
commentaire: 'Une boutique sérieuse avec des produits authentiques. J\'apprécie particulièrement la réactivité du service client et la qualité constante des articles.',
note: 5,
},
];

const Temoignages = () => {
const [startIndex, setStartIndex] = useState(0);
const [direction, setDirection] = useState(1);
const [autoplay, setAutoplay] = useState(true);
const [visibleCount, setVisibleCount] = useState(2); // Par défaut 2

const total = temoignages.length;
const maxIndex = total - visibleCount;

// Gérer le redimensionnement
useEffect(() => {
    const handleResize = () => {
    const newVisibleCount = window.innerWidth <= 768 ? 1 : 2;
    setVisibleCount(newVisibleCount);
    
    // Ajuster startIndex si nécessaire
    if (startIndex > total - newVisibleCount) {
        setStartIndex(Math.max(0, total - newVisibleCount));
    }
    };

    handleResize(); // Appel initial
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
}, [startIndex, total]);

useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
    handleNext();
    }, 5000);
    return () => clearInterval(interval);
}, [startIndex, autoplay]);

const handleNext = () => {
    setDirection(1);
    setStartIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
};

const handlePrev = () => {
    setDirection(-1);
    setStartIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
};

const pauseAutoplay = () => {
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 6000);
};

const visible = temoignages.slice(startIndex, startIndex + visibleCount);

return (
    <section className="temoignages-section">
    <div className="temoignages-container">
        {/* Header */}
        <div className="temoignages-header">
        <div className="temoignages-header-left">
            <motion.span
            className="temoignages-eyebrow"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            >
            <h2 className='temoignages_h2'>
                <span>NOS</span> TEMOIGNAGES
            </h2>
            </motion.span>
        </div>

        {/* Boutons navigation (cachés sur mobile avec CSS) */}
        <div className="temoignages-nav">
            <motion.button
            className="nav-btn"
            onClick={() => { handlePrev(); pauseAutoplay(); }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            aria-label="Précédent"
            >
            <FiArrowLeft /> 
            </motion.button>
            <motion.button
            className="nav-btn"
            onClick={() => { handleNext(); pauseAutoplay(); }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            aria-label="Suivant"
            >
            <FiArrowRight />
            
            </motion.button>
        </div>
        </div>

        {/* Cartes */}
        <div className="temoignages-grid">
        <AnimatePresence mode="popLayout" custom={direction}>
            {visible.map((t) => (
            <motion.div
                key={t.id}
                className="temoignage-card"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                layout
            >
                {/* ... contenu de la carte ... */}
                <p className="temoignage-commentaire">{t.commentaire}</p>
                <div className="temoignage-divider" />
                <div className="temoignage-footer">
                <div className="temoignage-left">
                    <img src={t.photo} alt={t.nom} className="temoignage-photo" />
                    <div className="temoignage-info">
                    <h4 className="temoignage-nom">{t.nom}</h4>
                    <p className="temoignage-ville">{t.ville}</p>
                    <div className="temoignage-stars">
                        {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={i < t.note ? 'star-on' : 'star-off'} />
                        ))}
                    </div>
                    </div>
                </div>
                <FaQuoteRight className="temoignage-quote-icon" />
                </div>
            </motion.div>
            ))}
        </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="temoignages-dots">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <motion.button
            key={i}
            className={`tdot ${i === startIndex ? 'active' : ''}`}
            onClick={() => { setStartIndex(i); pauseAutoplay(); }}
            animate={i === startIndex
                ? { width: 28, backgroundColor: '#c8654a' }
                : { width: 10, backgroundColor: '#ddd' }
            }
            transition={{ duration: 0.3 }}
            />
        ))}
        </div>
    </div>
    </section>
);
};

export default Temoignages;