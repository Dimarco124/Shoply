import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
FiMapPin, FiPhone, FiMail, FiClock, FiSend,
FiCheckCircle, FiAlertCircle, FiHelpCircle, FiMessageCircle,
FiUser, FiPackage, FiArrowRight, FiCopy, FiCheck
} from 'react-icons/fi';
import {
FaWhatsapp, FaFacebook, FaInstagram, FaTwitter,
FaTelegram, FaWhatsappSquare
} from 'react-icons/fa';
import { BiMessageDetail } from 'react-icons/bi';
import { MdOutlineMarkChatRead } from 'react-icons/md';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Contact.css';

/* ── Animation helpers ─────────────────────────────────── */
const fadeUp = (delay = 0) => ({
initial: { opacity: 0, y: 40 },
whileInView: { opacity: 1, y: 0 },
transition: { duration: 0.75, delay, ease: [0.65, 0, 0.35, 1] },
viewport: { once: true },
});

const fadeLeft = (delay = 0) => ({
initial: { opacity: 0, x: -32 },
whileInView: { opacity: 1, x: 0 },
transition: { duration: 0.65, delay, ease: [0.65, 0, 0.35, 1] },
viewport: { once: true },
});

const fadeRight = (delay = 0) => ({
initial: { opacity: 0, x: 32 },
whileInView: { opacity: 1, x: 0 },
transition: { duration: 0.65, delay, ease: [0.65, 0, 0.35, 1] },
viewport: { once: true },
});

/* ── Data ──────────────────────────────────────────────── */
const whatsappNumber = "2250554356019";
const whatsappLink = `https://wa.me/${whatsappNumber}`;

const quickMessages = [
{ id: 'commande',    label: 'Suivre ma commande',  message: "Bonjour, je souhaite suivre ma commande. Mon numéro de commande est : [NUMÉRO]" },
{ id: 'produit',     label: 'Infos produit',       message: "Bonjour, je souhaite avoir plus d'informations sur le produit : [NOM DU PRODUIT]" },
{ id: 'livraison',   label: 'Livraison',            message: "Bonjour, je voudrais connaître les délais et tarifs de livraison pour Yamoussoukro." },
{ id: 'retour',      label: 'Retour produit',       message: "Bonjour, je souhaite retourner un produit. Comment puis-je procéder ?" },
{ id: 'partenariat', label: 'Partenariat',          message: "Bonjour, je souhaite discuter d'une opportunité de partenariat avec votre boutique." },
{ id: 'autre',       label: 'Autre demande',        message: "Bonjour, j'ai une question concernant : [VOTRE QUESTION]" },
];

const contactInfos = [
{ icon: <FiMapPin />,   title: 'Adresse',         details: ["Yamoussoukro, Côte d'Ivoire", 'Quartier Habitat, Rue des Commerces'] },
{ icon: <FaWhatsapp />, title: 'WhatsApp Direct',  details: ['+225 05 543 60 19', 'Disponible 24h/24', 'Réponse sous 30 min'], isWhatsapp: true },
{ icon: <FiMail />,     title: 'Email',            details: ['enterpriseshoply@gmail.com'] },
{ icon: <FiClock />,    title: 'Horaires',         details: ['Lun – Ven : 8h – 00h', 'Samedi : 9h – 22h', 'Dimanche : 10h – 20h'] },
];

const faqs = [
{ question: 'Comment passer une commande depuis Yamoussoukro ?',    answer: "C'est simple ! Parcourez notre catalogue, ajoutez vos articles au panier, puis contactez-nous directement sur WhatsApp. Livraison rapide à Yamoussoukro !" },
{ question: 'Quels sont les délais de livraison à Yamoussoukro ?',  answer: "Nous livrons sous 24h max à Yamoussoukro et 2–3 jours dans les environs. Un suivi WhatsApp vous est envoyé dès l'expédition." },
{ question: 'Comment puis-je payer ma commande ?',                  answer: "Nous acceptons Orange Money, Wave, MTN Money, Moov Money et espèces à la livraison et carte bancaire. Paiement 100% sécurisé." },
{ question: 'Puis-je retourner un produit ?',                       answer: "Oui, vous avez 7 jours pour retourner un produit défectueux. Contactez-nous sur WhatsApp pour initier le retour." },
{ question: 'Comment contacter le service client rapidement ?',     answer: "Le plus rapide est WhatsApp au +225 05 543 60 19. Réponse garantie sous 30 minutes !" },
{ question: "Faites-vous la livraison dans toute la Côte d'Ivoire ?", answer: "Non, nous livrons pour le moment dans tout Yamoussoukro, on pourra étendre plutard dans toute la Côte d'Ivoire." },
];

const stats = [
{ value: '30 min', label: 'Délai de réponse moyen',  icon: <FaWhatsapp /> },
{ value: '5 000+', label: 'Clients satisfaits',       icon: <FiUser /> },
{ value: '10 000+',label: 'Commandes livrées',        icon: <FiPackage /> },
{ value: '7j/7',   label: 'Support disponible',       icon: <BiMessageDetail /> },
];

const availability = [
{ label: 'Lun – Ven', width: '100%', hours: '24h/24' },
{ label: 'Samedi',    width: '70%',  hours: '8h–22h' },
{ label: 'Dimanche',  width: '50%',  hours: '10h–18h' },
];

/* ── Component ─────────────────────────────────────────── */
const Contact = () => {
const [copied, setCopied] = useState(false);
const [selectedOption, setSelectedOption] = useState('commande');

const handleQuickMessage = (option) => {
    setSelectedOption(option.id);
    window.open(`${whatsappLink}?text=${encodeURIComponent(option.message)}`, '_blank');
};

const copyNumber = () => {
    navigator.clipboard.writeText('+225 05 543 60 19');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
};

return (
    <div className="contact-page">
    <Header />

    {/* ── HERO ─────────────────────────────────────────── */}
    <section className="contact-hero">
        <div className="contact-hero-bg-grid" />
        <div className="contact-hero-orb contact-hero-orb--1" />
        <div className="contact-hero-orb contact-hero-orb--2" />
        <div className="contact-hero-orb contact-hero-orb--3" />

        <div className="container">
        <motion.div
            className="contact-hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
        >
            <motion.span
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            >
            <FiMessageCircle /> Réponse rapide garantie
            </motion.span>

            <h1 className="contact-hero-title">
            <span className="contact-title-line">Une question ?</span>
            <span className="contact-title-line contact-title-highlight">
                <em>Parlons-en.</em>
            </span>
            </h1>

            <p className="contact-hero-subtitle">
            Notre équipe est disponible 7j/7 pour vous accompagner
            avant, pendant et après votre commande.
            </p>

            <motion.div
            className="hero-contact-pills"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            >
            {['Réponse sous 30 min', 'Support 7j/7', 'Livraison Yamoussoukro', 'Paiement à la livraison'].map((p, i) => (
                <span key={i} className="hero-pill"><FiCheckCircle />{p}</span>
            ))}
            </motion.div>
        </motion.div>
        </div>
    </section>

    {/* ── WHATSAPP BANNER ──────────────────────────────── */}
    <section className="whatsapp-main-banner">
        <div className="container">
        <motion.div
            className="whatsapp-banner-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
        >
            <div className="whatsapp-banner-left">
            <div className="whatsapp-banner-icon-wrap">
                <FaWhatsapp />
            </div>
            <div className="whatsapp-banner-text">
                <h2>Contactez-nous sur WhatsApp</h2>
                <p>Le moyen le plus rapide — réponse en moins de 30 minutes</p>
                <div className="whatsapp-number-row">
                <span className="whatsapp-number">+225 05 543 60 19</span>
                <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={copyNumber}>
                    {copied ? <FiCheck /> : <FiCopy />}
                    {copied ? 'Copié !' : 'Copier'}
                </button>
                </div>
            </div>
            </div>
            <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-banner-btn"
            >
            <FaWhatsapp /> Démarrer la conversation <FiArrowRight />
            </a>
        </motion.div>
        </div>
    </section>

    {/* ── STATS ────────────────────────────────────────── */}
    <section className="contact-stats-section">
        <div className="container">
        <div className="contact-stats-grid">
            {stats.map((s, i) => (
            <motion.div key={i} className="contact-stat-card" {...fadeUp(i * 0.1)} whileHover={{ y: -6 }}>
                <div className="contact-stat-icon-wrap">{s.icon}</div>
                <div className="contact-stat-value">{s.value}</div>
                <div className="contact-stat-label">{s.label}</div>
            </motion.div>
            ))}
        </div>
        </div>
    </section>

    {/* ── SECTION PRINCIPALE ───────────────────────────── */}
    <section className="contact-main-section">
        <div className="container">
        <div className="contact-main-grid">

            {/* Gauche — Coordonnées */}
            <motion.div className="contact-info-col" {...fadeLeft()}>
            <span className="section-badge">Coordonnées</span>
            <h2 className="section-title">Nos contacts</h2>
            <p className="contact-info-intro">
                Basés à Yamoussoukro, joignables 24h/24 sur WhatsApp
                pour toutes vos questions et commandes.
            </p>

            <div className="info-cards">
                {contactInfos.map((info, i) => (
                <motion.div
                    key={i}
                    className={`info-card ${info.isWhatsapp ? 'info-card--whatsapp' : ''}`}
                    {...fadeUp(i * 0.1)}
                    whileHover={{ x: 6 }}
                >
                    <div className={`info-icon-wrap ${info.isWhatsapp ? 'info-icon-wrap--green' : ''}`}>
                    {info.icon}
                    </div>
                    <div className="info-content">
                    <h3>{info.title}</h3>
                    {info.details.map((d, j) => <p key={j}>{d}</p>)}
                    </div>
                </motion.div>
                ))}
            </div>

            {/* Disponibilité */}
            <motion.div className="availability-block" {...fadeUp(0.4)}>
                <div className="availability-header">
                <MdOutlineMarkChatRead />
                <span>Disponibilité WhatsApp</span>
                </div>
                <div className="availability-bars">
                {availability.map((row, i) => (
                    <div key={i} className="availability-row">
                    <span className="avail-label">{row.label}</span>
                    <div className="avail-track">
                        <motion.div
                        className="avail-fill"
                        initial={{ width: 0 }}
                        whileInView={{ width: row.width }}
                        transition={{ duration: 0.8, delay: i * 0.15, ease: [0.65, 0, 0.35, 1] }}
                        viewport={{ once: true }}
                        />
                    </div>
                    <span className="avail-hours">{row.hours}</span>
                    </div>
                ))}
                </div>
            </motion.div>
            </motion.div>

            {/* Droite — Messages rapides */}
            <motion.div className="contact-whatsapp-col" {...fadeRight()}>
            <div className="whatsapp-connect-card">
                <div className="whatsapp-connect-header">
                <div className="whatsapp-connect-icon-wrap">
                    <FaWhatsapp />
                </div>
                <h2>Connexion instantanée</h2>
                <p>Choisissez un sujet et démarrez automatiquement la conversation</p>
                </div>

                <div className="quick-messages-grid">
                {quickMessages.map((opt) => (
                    <motion.button
                    key={opt.id}
                    className={`quick-msg-btn ${selectedOption === opt.id ? 'quick-msg-btn--active' : ''}`}
                    onClick={() => handleQuickMessage(opt)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    >
                    {opt.label}
                    </motion.button>
                ))}
                </div>

                <div className="whatsapp-direct-row">
                <img src='/images/QR.jpeg' className="whatsapp-qr-placeholder">
                    
                </img>
                <div className="whatsapp-direct-text">
                    <h4>Encore plus rapide</h4>
                    <p>Scannez ce code depuis votre téléphone pour démarrer instantanément</p>
                    <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-open-btn"
                    >
                    <FaWhatsapp /> Ouvrir WhatsApp
                    </a>
                </div>
                </div>

                <div className="response-note">
                <FiClock />
                <span>Temps de réponse moyen : <strong>30 minutes</strong></span>
                </div>
            </div>
            </motion.div>
        </div>
        </div>
    </section>

    {/* ── FAQ ──────────────────────────────────────────── */}
    <section className="faq-section">
        <div className="container">
        <motion.div className="section-header" {...fadeUp()}>
            <span className="section-badge">Questions fréquentes</span>
            <h2 className="section-title">Tout ce que vous devez savoir</h2>
            <p className="section-subtitle">
            Retrouvez les réponses aux questions les plus courantes sur nos services à Yamoussoukro
            </p>
        </motion.div>

        <div className="faq-grid">
            {faqs.map((faq, i) => (
            <motion.div
                key={i}
                className="faq-card"
                {...fadeUp(i * 0.08)}
                whileHover={{ y: -6 }}
            >
                <div className="faq-card-top">
                <div className="faq-icon-wrap"><FiHelpCircle /></div>
                <h3>{faq.question}</h3>
                </div>
                <p className="faq-answer">{faq.answer}</p>
                <div className="faq-card-accent" />
            </motion.div>
            ))}
        </div>
        </div>
    </section>

    {/* ── CTA FINAL ────────────────────────────────────── */}
    <section className="contact-cta-section">
        <div className="container">
        <motion.div
            className="contact-cta-content"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
        >
            <div className="contact-cta-tag">Passez commande</div>
            <h2>Prêt à commander à Yamoussoukro ?</h2>
            <p>Contactez-nous directement sur WhatsApp pour une réponse instantanée</p>
            <div className="contact-cta-buttons">
            <a href="/shop" className="contact-cta-btn primary">
                Voir la boutique <FiArrowRight />
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="contact-cta-btn whatsapp">
                <FaWhatsapp /> WhatsApp
            </a>
            </div>
            <p className="contact-cta-note">
            <FiMapPin /> Livraison à Yamoussoukro uniquement
            </p>
        </motion.div>
        </div>
    </section>

    <Footer />
    </div>
);
};

export default Contact;