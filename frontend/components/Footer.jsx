import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import {
FiMapPin,
FiMail,
FiInstagram,
FiFacebook,
FiTwitter,
FiArrowUpRight,
FiHeart,
FiSend
} from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
const currentYear = new Date().getFullYear();
const [email, setEmail] = useState('');
const [subscribed, setSubscribed] = useState(false);

const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
};

const navLinks = [
    { label: 'Accueil',   to: '/' },
    { label: 'Boutique',  to: '/shop' },
    { label: 'À propos',  to: '/a-propos' },
    { label: 'Contact',   to: '/contact' },
];

const socials = [
    { icon: <FiInstagram />, href: 'https://instagram.com',  label: 'Instagram' },
    { icon: <FiFacebook />,  href: 'https://facebook.com',   label: 'Facebook' },
    { icon: <FiTwitter />,   href: 'https://twitter.com',    label: 'Twitter' },
    { icon: <FaWhatsapp />,  href: 'https://wa.me/2250555675764', label: 'WhatsApp' },
];

return (
    <footer className="footer">

    {/* ── Bande supérieure : grand titre + newsletter ── */}
    <div className="footer-top">
        <div className="footer-top-inner">

        <motion.div
            className="footer-brand-block"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
        >
            <span className="footer-eyebrow">— Restons connectés</span>
            <h2 className="footer-big-title">
            Shoply<span className="dot">.</span>
            </h2>
            <p className="footer-tagline">
            Des produits soigneusement sélectionnés,<br />
            livrés avec soin à Yamoussoukro.
            </p>
        </motion.div>

        {/* Newsletter */}
        <motion.div
            className="footer-newsletter-block"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: true }}
        >
            <p className="newsletter-label">Offres exclusives & nouveautés</p>
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="newsletter-input"
            />
            <button type="submit" className="newsletter-btn">
                {subscribed ? '✓' : <FiSend />}
            </button>
            </form>
            {subscribed && (
            <motion.p
                className="newsletter-success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                Merci pour votre inscription !
            </motion.p>
            )}
        </motion.div>

        </div>
    </div>

    {/* ── Ligne dorée ── */}
    <div className="footer-gold-line" />

    {/* ── Corps principal ── */}
    <div className="footer-body">
        <div className="footer-body-inner">

        {/* Navigation */}
        <motion.nav
            className="footer-nav"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
        >
            <span className="footer-col-title">Navigation</span>
            <ul>
            {navLinks.map((l, i) => (
                <li key={i}>
                <Link to={l.to} className="footer-nav-link">
                    <span>{l.label}</span>
                    <FiArrowUpRight className="nav-arrow" />
                </Link>
                </li>
            ))}
            </ul>
        </motion.nav>

        {/* Contact */}
        <motion.div
            className="footer-contact-col"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
        >
            <span className="footer-col-title">Contact</span>
            <ul className="footer-contact-list">
            <li>
                <FiMapPin className="ci" />
                <span>Yamoussoukro, Côte d'Ivoire</span>
            </li>
            <li>
                <FaWhatsapp className="ci" />
                <a href="https://wa.me/2250555675764" target="_blank" rel="noopener noreferrer">
                +225 05 556 7 57 64
                </a>
            </li>
            <li>
                <FiMail className="ci" />
                <a href="mailto:enterpriseshoply@gmail.com">
                enterpriseshoply@gmail.com
                </a>
            </li>
            </ul>
        </motion.div>

        {/* Réseaux sociaux */}
        <motion.div
            className="footer-social-col"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
        >
            <span className="footer-col-title">Suivez-nous</span>
            <div className="footer-socials">
            {socials.map((s, i) => (
                <motion.a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill"
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 300 }}
                aria-label={s.label}
                >
                {s.icon}
                <span>{s.label}</span>
                </motion.a>
            ))}
            </div>
        </motion.div>

        </div>
    </div>

    {/* ── Barre du bas ── */}
    <div className="footer-bottom">
        <div className="footer-bottom-inner">
            <p className="copyright">
                © {currentYear} <strong>Shoply.</strong> Tous droits réservés.
            </p>
            <p className="signature">
                Conçu avec <FiHeart className="heart" /> par{' '}
                <motion.span
                className="designer"
                whileHover={{ letterSpacing: '0.08em' }}
                transition={{ duration: 0.3 }}
                >
                Valdes DI MARCO
                </motion.span>
            </p>
        </div>
    </div>

    </footer>
);
};

export default Footer;