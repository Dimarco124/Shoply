    import React, { useState, useEffect, useCallback } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
    import './Hero.css';

    /* ──────────────────────────────────────────────────────────────
    DATA
    ────────────────────────────────────────────────────────────── */
    const slidesStatiques = [
    {
        id: 'static-1',
        title: 'Nouvelle Collection',
        subtitle: 'Best of',
        description: 'Découvrez des pièces uniques qui allient élégance et modernité.',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        cta: 'Découvrir',
        link: '/shop',
    },
    {
        id: 'static-2',
        title: "Parfums d'Exception",
        subtitle: 'Éveillez vos sens',
        description: 'Laissez-vous séduire par nos fragrances raffinées, pensées pour révéler votre style.',
        image: '/images/parfums.jpg',
        cta: 'Découvrir maintenant',
        link: '/shop?categorie=4',
    },
    {
        id: 'static-3',
        title: 'Montres Élégantes',
        subtitle: 'Luxe et précision',
        description: 'Explorez notre collection de montres haut de gamme, alliant design raffiné et technologie fiable.',
        image: '/images/montttre.jpg',
        cta: 'Voir nos montres',
        link: '/shop?categorie=3',
    },
    {
        id: 'static-4',
        title: 'Tendance Chaussure',
        subtitle: 'Style, élégance et confort',
        description: 'Découvrez notre sélection de chaussures soigneusement choisies pour sublimer votre allure.',
        image: '/images/chaussures.jpg',
        cta: 'Voir nos chaussures',
        link: '/shop?categorie=1',
    },
    {
        id: 'static-5',
        title: 'Smartphones Premium',
        subtitle: 'Performance et style',
        description: 'Découvrez nos téléphones haut de gamme, rapides, élégants et conçus pour durer.',
        image: '/images/Iphone.jpg',
        cta: 'Voir nos modèles',
        link: '/shop?categorie=2',
    },
    {
        id: 'static-6',
        title: 'Manettes de Jeu',
        subtitle: 'Prenez le contrôle',
        description: "Profitez d'un confort optimal pour des sessions de jeu intenses et immersives.",
        image: '/images/manette.jpg',
        cta: 'Voir les manettes',
        link: '/shop?categorie=5',
    },
    {
        id: 'static-7',
        title: 'Collection Bijoux',
        subtitle: 'Brillez en toute occasion',
        description: 'Découvrez nos bijoux raffinés, conçus pour illuminer chaque tenue et révéler votre éclat naturel.',
        image: '/images/Bijoux.jpg',
        cta: 'Explorer nos bijoux',
        link: '/shop?categorie=6',
    },
    {
        id: 'static-8',
        title: 'Sacs à Main Stylés',
        subtitle: 'Élevez votre look',
        description: 'Alliez élégance et praticité avec nos sacs soigneusement conçus pour compléter votre style.',
        image: '/images/sac_a_amain.jpg',
        cta: 'Explorer la collection',
        link: '/shop?categorie=7',
    },
    {
        id: 'static-9',
        title: 'Ordinateurs Performants',
        subtitle: 'Puissance et élégance',
        description: "Notre sélection d'ordinateurs portables alliant performance, design moderne et fiabilité.",
        image: '/images/Ordinateur.jpg',
        cta: 'Explorer maintenant',
        link: '/shop?categorie=8',
    },
    ];

    /* ──────────────────────────────────────────────────────────────
    VARIANTS Framer Motion
    ────────────────────────────────────────────────────────────── */
    const slideVariants = {
    enter: (dir) => ({
        x: dir > 0 ? '100%' : '-100%',
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (dir) => ({
        x: dir < 0 ? '100%' : '-100%',
        opacity: 0,
    }),
    };

    const contentVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { delay: 0.35, duration: 0.85, ease: [0.6, -0.05, 0.01, 0.99] },
    },
    };

    /* ──────────────────────────────────────────────────────────────
    COMPONENT
    ────────────────────────────────────────────────────────────── */
    const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection]       = useState(0);

    const total = slidesStatiques.length;

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % total);
    }, [total]);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentSlide((prev) => (prev - 1 + total) % total);
    }, [total]);

    const goTo = useCallback((index) => {
        setDirection(index > currentSlide ? 1 : -1);
        setCurrentSlide(index);
    }, [currentSlide]);

    /* Autoplay */
    useEffect(() => {
        if (total <= 1) return;
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [nextSlide, total]);

    if (!total) return null;

    const current = slidesStatiques[currentSlide];

    /* Numéro affiché (01, 02 …) */
    const slideLabel = String(currentSlide + 1).padStart(2, '0');
    

    return (
        <div className="hero">
        

        {/* ── Slides ── */}
        <AnimatePresence initial={false} custom={direction}>
            <motion.div
            key={current.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            className="hero-slide"
            style={{
                backgroundImage: `url(${current.image})`,
            }}
            >
            {/* Ligne verticale décorative */}
            <div className="hero-line-left" aria-hidden="true" />

            {/* Numéro géant arrière-plan */}
            <span className="hero-slide-number" aria-hidden="true">
                {slideLabel}
            </span>

            {/* Contenu textuel */}
            <div className="hero-content">
                <motion.div
                className="hero-text-block"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                >
                <span className="hero-subtitle">{current.subtitle}</span>

                <h1 className="hero-title">{current.title}</h1>

                <p className="hero-description">{current.description}</p>

                <motion.a
                    href={current.link}
                    className="hero-cta"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    {current.cta}
                    <FiArrowRight />
                </motion.a>
                </motion.div>
            </div>
            </motion.div>
        </AnimatePresence>

        {/* ── Navigation ── */}
        {total > 1 && (
            <>
            <button
                className="hero-nav hero-nav-prev"
                onClick={prevSlide}
                aria-label="Slide précédent"
            >
                <FiArrowLeft />
            </button>

            <button
                className="hero-nav hero-nav-next"
                onClick={nextSlide}
                aria-label="Slide suivant"
            >
                <FiArrowRight />
            </button>

            {/* Dots */}
            <div className="hero-dotts" role="tablist" aria-label="Slides">
                {slidesStatiques.map((slide, index) => (
                <button
                    key={slide.id}
                    role="tab"
                    aria-selected={index === currentSlide}
                    aria-label={`Aller au slide ${index + 1}`}
                    className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => goTo(index)}
                />
                ))}
            </div>

            {/* Barre de progression */}
            <motion.div
                key={`progress-${currentSlide}`}
                className="hero-progress"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 6, ease: 'linear' }}
            />
            </>
        )}
        </div>
    );
    };

    export default Hero;