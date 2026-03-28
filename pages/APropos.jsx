import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
FiShoppingBag, FiTruck, FiShield, FiClock, FiStar,
FiLock, FiCreditCard, FiHeadphones, FiPackage,
FiHeart, FiUsers, FiAward, FiCheckCircle, FiGlobe,
FiTrendingUp, FiMapPin, FiPhone, FiMail, FiArrowRight
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './APropos.css';

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
const stats = [
{ value: '5 000+',  label: 'Clients satisfaits', icon: <FiUsers /> },
{ value: '10 000+', label: 'Produits livrés',     icon: <FiPackage /> },
{ value: '72h',     label: 'Livraison express',   icon: <FiTruck /> },
{ value: '100%',    label: 'Paiements à la livraison', icon: <FiLock /> },
];

const avantages = [
{ icon: <FiGlobe />,      title: 'Livraison directe',  description: 'Nous travaillons avec des fournisseurs de confiance et nous expédions directement vos commandes dans Yamoussoukro.' },
{ icon: <FiTrendingUp />, title: 'Prix compétitifs',   description: "Pas de stock, donc pas de frais de stockage ! Vous bénéficiez des meilleurs prix du marché." },
{ icon: <FiPackage />,    title: 'Large choix',        description: "Accédez à des milliers de produits sans limite de stock. Si c'est disponible, nous pouvons vous le procurer." },
{ icon: <FiShield />,     title: 'Qualité garantie',   description: 'Nous sélectionnons rigoureusement nos fournisseurs pour vous garantir des produits de qualité.' },
];

const valeurs = [
{ icon: <FiHeart />,      title: 'Satisfaction client', description: 'Votre satisfaction est notre priorité absolue. Nous nous engageons à répondre à vos attentes.' },
{ icon: <FiAward />,      title: 'Transparence totale', description: "Pas de surprises : vous savez exactement ce que vous payez et d'où viennent vos produits." },
{ icon: <FiClock />,      title: 'Réactivité',          description: "Traitement des commandes en moins de 24h et suivi personnalisé jusqu'à la livraison." },
{ icon: <FiHeadphones />, title: 'Support dédié',       description: "Une équipe à votre écoute 7j/7 pour vous accompagner avant, pendant et après votre achat." },
];

const etapes = [
{ n: 1, titre: 'Parcourez notre catalogue', description: 'Explorez notre sélection de produits en ligne. Si un article vous intéresse, il est disponible !' },
{ n: 2, titre: 'Ajoutez au panier',         description: 'Sélectionnez vos articles et validez votre panier. Aucun stock, donc jamais de rupture !' },
{ n: 3, titre: 'Générez votre bon',         description: 'Téléchargez votre bon de commande personnalisé avec tous les détails de votre sélection.' },
{ n: 4, titre: 'Commandez sur WhatsApp',    description: "Envoyez votre bon via WhatsApp. Notre équipe traite votre commande immédiatement." },
{ n: 5, titre: 'Réception à Yamoussoukro', description: 'Livraison rapide à domicile ou en point relais. Paiement à la livraison sécurisé.' },
];

const engagements = [
'Paiement à la livraison (Orange Money, Wave, MTN, Moov, espèces)',
'Livraison gratuite à Yamoussoukro dès 25 000 FCFA',
'Retour accepté sous 7 jours (produit défectueux)',
'Service client disponible 7j/7 de 8h à 00h',
'Produits authentiques garantis par nos fournisseurs',
'Suivi de commande en temps réel par WhatsApp',
];

const fournisseurs = [
{ nom: 'Distribution CI', localisation: 'Yamoussoukro', initial: 'DC' },
{ nom: 'Afrique Express',  localisation: 'Abidjan',      initial: 'AE' },
{ nom: 'Global Shop',      localisation: 'International', initial: 'GS' },
];

const modelCards = [
{ icon: <FiMapPin />,     title: 'Notre base à Yamoussoukro',    desc: "Depuis Yamoussoukro, nous coordonnons les commandes avec nos fournisseurs partenaires pour une livraison rapide dans toute la ville de Yamoussoukro.", anim: fadeLeft(0) },
{ icon: <FiPackage />,    title: 'Pas de stock, pas de problème', desc: "Nous ne stockons pas les produits. Vous commandez, nous nous chargeons de vous expédier directement chez vous.",                  anim: fadeUp(0.1) },
{ icon: <FiTrendingUp />, title: 'Prix sans intermédiaires',      desc: "En supprimant les coûts de stockage, nous vous offrons les meilleurs prix du marché, avec une transparence totale.",                      anim: fadeRight(0.2) },
];

/* ── Component ─────────────────────────────────────────── */
const APropos = () => (
<div className="apropos-page">
    <Header />

    {/* ── HERO ─────────────────────────────────────────── */}
    <section className="apropos-hero">
    <div className="ap-hero-bg-grid" />
    <div className="ap-hero-orb ap-hero-orb--1" />
    <div className="ap-hero-orb ap-hero-orb--2" />
    <div className="ap-hero-orb ap-hero-orb--3" />

    <div className="container">
        <motion.div
        className="apropos-hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
        >
        <motion.span
            className="ap-hero-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
        >
            <FiMapPin /> Yamoussoukro, Côte d'Ivoire
        </motion.span>

        <h1 className="apropos-hero-title">
            <span className="ap-title-line">Votre partenaire</span>
            <span className="ap-title-line ap-title-highlight">
            <em>dropshipping</em>
            </span>
            <span className="ap-title-line">de confiance</span>
        </h1>

        <p className="apropos-hero-subtitle">
            Commandez en ligne, recevez chez vous. Nous gérons tout,
            du fournisseur à votre porte.
        </p>

        <motion.div
            className="ap-hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
        >
            <a href="#comment-commander" className="ap-hero-btn ap-hero-btn--primary">
            Comment ça marche ? <FiArrowRight />
            </a>
            <a
            href="https://wa.me/2250554356019"
            target="_blank"
            rel="noopener noreferrer"
            className="ap-hero-btn ap-hero-btn--whatsapp"
            >
            <FaWhatsapp /> Parler à un conseiller
            </a>
        </motion.div>

        <motion.div
            className="ap-hero-pills"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
        >
            {['5 000+ clients', 'Paiement à la livraison', 'Livraison 72h max', 'Support 7j/7'].map((p, i) => (
            <span key={i} className="ap-pill"><FiCheckCircle />{p}</span>
            ))}
        </motion.div>
        </motion.div>
    </div>
    </section>

    {/* ── MODÈLE DROPSHIPPING ──────────────────────────── */}
    <section className="ap-section ap-model-section">
    <div className="container">
        <motion.div className="ap-section-header" {...fadeUp()}>
        <span className="ap-section-badge">Notre modèle</span>
        <h2 className="ap-section-title">Le dropshipping, simplifié</h2>
        <p className="ap-section-subtitle">
            Basés à Yamoussoukro, nous connectons les acheteurs ivoiriens aux meilleurs fournisseurs
        </p>
        </motion.div>

        <div className="ap-model-grid">
        {modelCards.map((card, i) => (
            <motion.div key={i} className="ap-model-card" {...card.anim} whileHover={{ y: -8 }}>
            <div className="ap-model-icon-wrap">
                <div className="ap-model-icon">{card.icon}</div>
            </div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            <div className="ap-model-card-line" />
            </motion.div>
        ))}
        </div>
    </div>
    </section>

    {/* ── STATS ────────────────────────────────────────── */}
    <section className="ap-stats-section">
    <div className="container">
        <div className="ap-stats-grid">
        {stats.map((s, i) => (
            <motion.div key={i} className="ap-stat-card" {...fadeUp(i * 0.1)} whileHover={{ y: -6 }}>
            <div className="ap-stat-icon-wrap">{s.icon}</div>
            <div className="ap-stat-value">{s.value}</div>
            <div className="ap-stat-label">{s.label}</div>
            </motion.div>
        ))}
        </div>
    </div>
    </section>

    {/* ── AVANTAGES ────────────────────────────────────── */}
    <section className="ap-section ap-avantages-section">
    <div className="container">
        <motion.div className="ap-section-header" {...fadeUp()}>
        <span className="ap-section-badge">Nos forces</span>
        <h2 className="ap-section-title">Pourquoi choisir notre service ?</h2>
        <p className="ap-section-subtitle">Les avantages du dropshipping avec Shoply</p>
        </motion.div>

        <div className="ap-avantages-grid">
        {avantages.map((a, i) => (
            <motion.div key={i} className="ap-avantage-card" {...fadeUp(i * 0.1)} whileHover={{ y: -10 }}>
            <div className="ap-avantage-number">0{i + 1}</div>
            <div className="ap-avantage-icon">{a.icon}</div>
            <h3 className="ap-avantage-title">{a.title}</h3>
            <p className="ap-avantage-desc">{a.description}</p>
            </motion.div>
        ))}
        </div>
    </div>
    </section>

    {/* ── COMMENT COMMANDER ────────────────────────────── */}
    <section id="comment-commander" className="ap-section ap-etapes-section">
    <div className="container">
        <motion.div className="ap-section-header" {...fadeUp()}>
        <span className="ap-section-badge">Simple comme bonjour</span>
        <h2 className="ap-section-title">Comment commander ?</h2>
        <p className="ap-section-subtitle">De la sélection à la livraison, on vous guide pas à pas</p>
        </motion.div>

        <div className="ap-etapes-container">
        {etapes.map((etape, idx) => (
            <motion.div key={etape.n} className="ap-etape-item" {...fadeUp(idx * 0.1)}>
            <div className="ap-etape-number-col">
                <div className="ap-etape-number">{String(etape.n).padStart(2, '0')}</div>
                {idx < etapes.length - 1 && <div className="ap-etape-connector" />}
            </div>
            <div className="ap-etape-content">
                <h3 className="ap-etape-title">{etape.titre}</h3>
                <p className="ap-etape-desc">{etape.description}</p>
            </div>
            </motion.div>
        ))}
        </div>

        <motion.div
        className="ap-whatsapp-cta"
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        >
        <a
            href="https://wa.me/2250554356019?text=Bonjour%2C%20je%20souhaite%20commander%20sur%20Shoply"
            target="_blank"
            rel="noopener noreferrer"
            className="ap-whatsapp-button"
        >
            <FaWhatsapp /> Passer une commande maintenant
        </a>
        <p className="ap-whatsapp-note">Réponse sous 30 minutes, 7j/7 de 8h à 00h</p>
        </motion.div>
    </div>
    </section>

    {/* ── VALEURS ──────────────────────────────────────── */}
    <section className="ap-section ap-valeurs-section">
    <div className="container">
        <motion.div className="ap-section-header" {...fadeUp()}>
        <span className="ap-section-badge">Notre ADN</span>
        <h2 className="ap-section-title">Nos Valeurs</h2>
        <p className="ap-section-subtitle">Ce qui nous guide au quotidien</p>
        </motion.div>

        <div className="ap-valeurs-grid">
        {valeurs.map((v, i) => (
            <motion.div key={i} className="ap-valeur-card" {...fadeUp(i * 0.1)} whileHover={{ y: -10 }}>
            <div className="ap-valeur-icon">{v.icon}</div>
            <h3 className="ap-valeur-title">{v.title}</h3>
            <p className="ap-valeur-desc">{v.description}</p>
            <div className="ap-valeur-accent" />
            </motion.div>
        ))}
        </div>
    </div>
    </section>

    {/* ── FOURNISSEURS ─────────────────────────────────── */}
    <section className="ap-section ap-fournisseurs-section">
    <div className="container">
        <motion.div className="ap-section-header" {...fadeUp()}>
        <span className="ap-section-badge">Partenariat</span>
        <h2 className="ap-section-title">Nos fournisseurs partenaires</h2>
        <p className="ap-section-subtitle">Des partenaires de confiance pour des produits de qualité</p>
        </motion.div>

        <div className="ap-fournisseurs-grid">
        {fournisseurs.map((f, i) => (
            <motion.div
            key={i}
            className="ap-fournisseur-card"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            >
            <div className="ap-fournisseur-avatar">{f.initial}</div>
            <h3>{f.nom}</h3>
            <div className="ap-fournisseur-loc"><FiMapPin />{f.localisation}</div>
            <span className="ap-fournisseur-badge">Partenaire vérifié</span>
            </motion.div>
        ))}
        </div>
    </div>
    </section>

    {/* ── ENGAGEMENTS LOCAUX ───────────────────────────── */}
    <section className="ap-section ap-engagements-section">
    <div className="container">
        <div className="ap-engagements-grid">
        <motion.div className="ap-engagements-content" {...fadeLeft()}>
            <span className="ap-section-badge">Notre promesse</span>
            <h2 className="ap-section-title ap-section-title--left">Notre engagement local</h2>
            <p className="ap-engagements-text">
            Basés à Yamoussoukro, nous sommes fiers de contribuer au développement du commerce
            en ligne en Côte d'Ivoire. Notre modèle dropshipping nous permet de vous offrir des
            produits de qualité à prix réduits, tout en soutenant l'économie locale.
            </p>
            <div className="ap-engagements-list">
            {engagements.map((e, i) => (
                <motion.div
                key={i}
                className="ap-engagement-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                viewport={{ once: true }}
                >
                <FiCheckCircle className="ap-engagement-icon" />
                <span>{e}</span>
                </motion.div>
            ))}
            </div>
        </motion.div>

        <motion.div className="ap-engagements-image-wrap" {...fadeRight()}>
            <img
            src="/images/notre_equipe.jpg"
            alt="Notre équipe à Yamoussoukro"
            />
            <div className="ap-image-overlay">
            <FiMapPin />
            <p>Notre équipe à Yamoussoukro</p>
            </div>
        </motion.div>
        </div>
    </div>
    </section>

    {/* ── CTA FINAL ────────────────────────────────────── */}
    <section className="ap-cta-section">
    <div className="container">
        <motion.div
        className="ap-cta-content"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        >
        <div className="ap-cta-tag">Contactez-nous</div>
        <h2>Prêt à passer commande ?</h2>
        <p>Une question ? Notre équipe est là pour vous aider 7j/7</p>

        <div className="ap-cta-info-grid">
            {[
            { icon: <FiMapPin />, label: 'Adresse',   value: "Yamoussoukro, Côte d'Ivoire" },
            { icon: <FiPhone />,  label: 'Téléphone', value: '+225 05 543 60 19' },
            { icon: <FiMail />,   label: 'Email',     value: 'enterpriseshoply@gmail.com' },
            ].map((item, i) => (
            <motion.div key={i} className="ap-cta-info-item" {...fadeUp(i * 0.1)}>
                <div className="ap-cta-icon-wrap">{item.icon}</div>
                <div>
                <h4>{item.label}</h4>
                <p>{item.value}</p>
                </div>
            </motion.div>
            ))}
        </div>

        <div className="ap-cta-buttons">
            <a href="https://wa.me/2250554356019" className="ap-cta-btn ap-cta-btn--whatsapp">
            <FaWhatsapp /> WhatsApp
            </a>
            <a href="mailto:enterpriseshoply@gmail.com" className="ap-cta-btn ap-cta-btn--email">
            <FiMail /> Nous écrire
            </a>
        </div>
        </motion.div>
    </div>
    </section>

    <Footer />
</div>
);

export default APropos;