    import React, { useState, useEffect } from 'react';
    import { Link, useLocation } from 'react-router-dom';
    import { motion, AnimatePresence } from 'framer-motion';
    import {
    FiShoppingBag, FiX, FiHome, FiInfo, FiMail,
    FiPhone, FiMapPin
    } from 'react-icons/fi';
    import { FaWhatsapp } from 'react-icons/fa';
    import { useCart } from '../src/context/CartContext';
    import './Header.css';

    /* ── Variants Framer Motion ─────────────────────────────────── */
    const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit:   { opacity: 0, transition: { duration: 0.2 } },
    };

    const menuVariants = {
    hidden:  { x: '100%' },
    visible: { x: 0, transition: { duration: 0.35, ease: [0.65, 0, 0.35, 1] } },
    exit:    { x: '100%', transition: { duration: 0.28, ease: [0.65, 0, 0.35, 1] } },
    };

    const navItems = [
    { name: 'Accueil',  path: '/',        icon: <FiHome /> },
    { name: 'Boutique', path: '/shop',    icon: <FiShoppingBag /> },
    { name: 'À propos', path: '/a-propos',icon: <FiInfo /> },
    { name: 'Contact',  path: '/contact', icon: <FiMail /> },
    { name: 'Panier',   path: '/panier',  icon: <FiShoppingBag /> },
    ];


    const Header = () => {
    const [isScrolled, setIsScrolled]         = useState(false);
    const [isMobileMenuOpen, setMobileMenu]   = useState(false);
    const location                            = useLocation();
    const { cartCount }                       = useCart();


    /* Scroll */
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* Fermer menu au changement de route */
    useEffect(() => { setMobileMenu(false); }, [location.pathname]);

    /* Bloquer le scroll body */
    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    const isHome             = location.pathname === '/';
    const shouldBeTransparent = isHome && !isScrolled;
    const close              = () => setMobileMenu(false);

    return (
        <>
        {/* ── HEADER FIXE ────────────────────────────────────────── */}
        <header className={`header ${shouldBeTransparent ? 'transparent' : 'solid'}`}>
            <div className="header-container">

            {/* Logo */}
            <Link to="/" className="header-logo">
                <span className="logo-text">Shoply</span>
                <span className="logo-dot">.</span>
            </Link>

            {/* Nav desktop */}
            <nav className="header-nav">
                {navItems.slice(0, 4).map(item => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                    {item.name}
                </Link>
                ))}
            </nav>

            {/* Actions */}
            <div className="header-actions">
                <Link to="/panier" className="cart-link" aria-label="Panier">
                <div className="cart-icon-wrapper">
                    <FiShoppingBag />
                    {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                    )}
                </div>
                </Link>

                {/* Burger — UNIQUEMENT transform sur les lignes, pas `all` */}
                <button
                className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
                onClick={() => setMobileMenu(prev => !prev)}
                aria-label="Menu"
                aria-expanded={isMobileMenuOpen}
                >
                <span className="burger-line" />
                <span className="burger-line" />
                <span className="burger-line" />
                </button>
            </div>
            </div>
        </header>

        {/* ── MENU MOBILE avec AnimatePresence ───────────────────── */}
        <AnimatePresence>
            {isMobileMenuOpen && (
            <>
                {/* Overlay */}
                <motion.div
                key="overlay"
                className="mobile-overlay"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={close}
                />

                {/* Panneau */}
                <motion.div
                key="menu"
                className="mobile-menu"
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                >
                {/* Header du panneau */}
                <div className="mobile-menu-header">
                    <Link to="/" className="mobile-logo" onClick={close}>
                    <span className="mobile-logo-text">Shoply</span>
                    <span className="mobile-logo-dot">.</span>
                    </Link>
                    <button
                    className="mobile-close-btn"
                    onClick={close}
                    aria-label="Fermer le menu"
                    >
                    <FiX />
                    </button>
                </div>

                {/* Bienvenue */}
                <div className="mobile-welcome">
                    <p>Bienvenue dans notre Shoply</p>
                    <small>Découvrez notre sélection exclusive</small>
                </div>

                {/* Liens */}
                <nav className="mobile-nav">
                    {navItems.map((item, i) => (
                    <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + i * 0.06, duration: 0.3 }}
                    >
                        <Link
                        to={item.path}
                        className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={close}
                        >
                        {/* Icône dans un span isolé — pas de transition héritée */}
                        <span className="nav-icon" aria-hidden="true">
                            {item.icon}
                        </span>
                        <span className="nav-name">{item.name}</span>
                        {item.path === '/panier' && cartCount > 0 && (
                            <span className="mobile-cart-badge">{cartCount}</span>
                        )}
                        </Link>
                    </motion.div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="mobile-footer">
                    <div className="mobile-contact">
                    <p>
                        <FiMapPin className="contact-icon" aria-hidden="true" />
                        Yamoussoukro, Côte d'Ivoire
                    </p>
                    <p>
                        <FiPhone className="contact-icon" aria-hidden="true" />
                        +225 05 543 60 19
                    </p>
                    </div>
                    <a
                    href="https://wa.me/2250554356019?text=Bonjour%2C%20je%20souhaite%20des%20informations"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mobile-wa-btn"
                    onClick={close}
                    >
                    <FaWhatsapp aria-hidden="true" /> WhatsApp
                    </a>
                </div>
                </motion.div>
            </>
            )}
        </AnimatePresence>
        </>
    );
    };

    export default Header;