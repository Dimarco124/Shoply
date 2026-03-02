import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
    FiGrid, FiList, FiSearch, FiShoppingBag,
    FiChevronDown, FiStar, FiX, FiSliders,
    FiPackage, FiTag, FiCheckCircle, FiFilter
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { produitService, categorieService, getBackendBaseUrl, getImageUrl } from '../services/api';
import { useCart } from '../src/context/CartContext';
import './Boutique.css';
import noteSimulee from '../src/utils/noteSimulee';

const Boutique = () => {
    const { cartCount, addToCart } = useCart();
    const location = useLocation();

    const [produits, setProduits] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [prixSlider, setPrixSlider] = useState(500000);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [filtres, setFiltres] = useState({
        categorie: '',
        prix_min: '',
        prix_max: '',
        recherche: '',
        disponible: '',
        tri: '-date_creation'
    });

    const observerRef = useRef();
    const lastProductRef = useCallback(node => {
        if (loading || loadingMore) return;
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) loadMoreProduits();
        });
        if (node) observerRef.current.observe(node);
    }, [loading, loadingMore, hasMore]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const catId = params.get('categorie');
        if (catId) {
            const categoryId = parseInt(catId);
            setSelectedCategory(categoryId);
            setFiltres(prev => ({ ...prev, categorie: catId }));
        } else {
            setSelectedCategory(null);
            setFiltres(prev => ({ ...prev, categorie: '' }));
        }
    }, [location.search]);

    useEffect(() => { loadCategories(); }, []);

    useEffect(() => {
        setPage(1);
        setProduits([]);
        setHasMore(true);
        loadProduits(filtres, 1);
    }, [filtres]);

    const loadCategories = async () => {
        try {
            const cats = await categorieService.getAll();
            setCategories(Array.isArray(cats) ? cats : []);
        } catch (e) {
            console.error('Erreur chargement catégories:', e);
            setCategories([]);
        }
    };

    const loadProduits = async (f, pageNum = 1) => {
        try {
            setLoading(pageNum === 1);
            setLoadingMore(pageNum > 1);
            const params = {
                page: pageNum, page_size: 12,
                ...(f.categorie && { categorie: f.categorie }),
                ...(f.prix_min && { 'prix__gte': f.prix_min }),
                ...(f.prix_max && { 'prix__lte': f.prix_max }),
                ...(f.recherche && { search: f.recherche }),
                ...(f.disponible && { disponible: f.disponible === 'true' }),
                ordering: f.tri
            };
            const data = await produitService.getAll(params);
            const results = Array.isArray(data?.results) ? data.results : (Array.isArray(data) ? data : []);
            if (pageNum === 1) {
                setProduits(results);
                setLoadError(false);
            }
            else setProduits(prev => [...prev, ...results]);
            setHasMore(results.length === 12);
            setPage(pageNum);
        } catch (e) {
            console.error('Erreur chargement produits:', e);
            if (pageNum === 1) {
                setProduits([]);
                setLoadError(true);
            }
            setHasMore(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadMoreProduits = () => {
        if (!loadingMore && hasMore) loadProduits(filtres, page + 1);
    };

    const applyFilter = (patch, closeDrawer = false) => {
        const f = { ...filtres, ...patch };
        setFiltres(f);
        if (closeDrawer) setDrawerOpen(false);
    };

    const handleCategorySelect = (id) => {
        applyFilter({ categorie: id || '' }, false);
        setSelectedCategory(id);
        setDrawerOpen(false);
        const url = new URL(window.location);
        if (id) url.searchParams.set('categorie', id);
        else url.searchParams.delete('categorie');
        window.history.pushState({}, '', url);
    };

    const handlePrixFilter = () => applyFilter({ prix_max: String(prixSlider) }, true);

    const handleDisponibiliteChange = (val) => applyFilter({ disponible: val }, true);

    const resetFilters = () => {
        const r = { categorie: '', prix_min: '', prix_max: '', recherche: '', disponible: '', tri: '-date_creation' };
        setFiltres(r);
        setSelectedCategory(null);
        setSearchInput('');
        setPrixSlider(500000);
        setDrawerOpen(false);
        const url = new URL(window.location);
        url.searchParams.delete('categorie');
        window.history.pushState({}, '', url);
    };

    const handleSearch = () => applyFilter({ recherche: searchInput });

    // getImageUrl est maintenant importé de ../services/api

    const handleAddToCart = (produit, e) => {
        e.preventDefault();
        addToCart(produit, 1);
    };



    const getCurrentCategoryName = () => {
        if (!selectedCategory) return "Tous les produits";
        const cat = categories.find(c => c.id === selectedCategory);
        return cat ? cat.nom : "Tous les produits";
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.65, 0, 0.35, 1] } }
    };

    const activeFiltersCount = [
        filtres.categorie, filtres.prix_max, filtres.disponible, filtres.recherche
    ].filter(Boolean).length;

    const SidebarContent = () => (
        <div className="sidebar-inner">

            {/* Catégories */}
            <div className="sb-block">
                <h4 className="sb-title">
                    <FiTag size={14} /> Catégories
                </h4>
                <ul className="sb-cat-list">
                    <li>
                        <button
                            className={`sb-cat-btn ${!selectedCategory ? 'sb-cat-active' : ''}`}
                            onClick={() => handleCategorySelect(null)}
                        >
                            <span>Tous les produits</span>
                            {!selectedCategory && <FiCheckCircle size={12} />}
                        </button>
                    </li>
                    {categories.map(cat => (
                        <li key={cat.id}>
                            <button
                                className={`sb-cat-btn ${selectedCategory === cat.id ? 'sb-cat-active' : ''}`}
                                onClick={() => handleCategorySelect(cat.id)}
                            >
                                <span>{cat.nom}</span>
                                {selectedCategory === cat.id
                                    ? <FiCheckCircle size={12} />
                                    : <FiChevronDown size={12} />
                                }
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Prix */}
            <div className="sb-block">
                <h4 className="sb-title"><FiFilter size={14} /> Prix (FCFA)</h4>
                <div className="sb-slider-wrap">
                    <input
                        type="range"
                        min={0} max={500000} step={5000}
                        value={prixSlider}
                        onChange={e => setPrixSlider(Number(e.target.value))}
                        className="sb-slider"
                    />
                    <div className="sb-price-labels">
                        <span>0 FCFA</span>
                        <span className="sb-price-val">{prixSlider.toLocaleString()} FCFA</span>
                    </div>
                </div>
                <button className="sb-filter-btn" onClick={handlePrixFilter}>
                    Appliquer
                </button>
            </div>

            {/* Disponibilité */}
            <div className="sb-block">
                <h4 className="sb-title"><FiPackage size={14} /> Disponibilité</h4>
                {[
                    { val: '', label: 'Tous les articles' },
                    { val: 'true', label: 'En stock' },
                    { val: 'false', label: 'Rupture de stock' }
                ].map(opt => (
                    <label key={opt.val} className="sb-radio">
                        <input
                            type="radio" name="dispo" value={opt.val}
                            checked={filtres.disponible === opt.val}
                            onChange={() => handleDisponibiliteChange(opt.val)}
                        />
                        <span className="sb-radio-custom" />
                        <span>{opt.label}</span>
                    </label>
                ))}
            </div>

            {activeFiltersCount > 0 && (
                <button className="sb-reset" onClick={resetFilters}>
                    <FiX size={13} /> Effacer tous les filtres
                </button>
            )}
        </div>
    );

    return (
        <div className="boutique-page">
            <Header panierCount={cartCount} />
            {loadError && (
                <div className="api-off-banner" role="alert">
                    <p><strong>Impossible de charger les produits.</strong> Vérifiez que le backend est démarré (<code>python manage.py runserver</code> dans <code>backend/</code>) et que l&apos;URL API est correcte.</p>
                </div>
            )}
            {/* ── BANNIÈRE ──────────────────────────────────────────── */}
            <section className="b-banner">
                <div className="b-banner-bg-grid" />
                <div className="b-banner-orb b-banner-orb--1" />
                <div className="b-banner-orb b-banner-orb--2" />
                <div className="b-banner-orb b-banner-orb--3" />

                <div className="b-banner-inner container">
                    <motion.div
                        className="b-banner-text"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                    >
                        <motion.span
                            className="b-eyebrow"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15, duration: 0.6 }}
                        >
                            Notre Collection
                        </motion.span>

                        <h1 className="b-title">
                            <span className="b-title-line">Explorez.</span>
                            <span className="b-title-line b-title-highlight">
                                <em>Choisissez.</em>
                            </span>
                            <span className="b-title-line">Commandez.</span>
                        </h1>

                        <p className="b-subtitle">
                            <span className="b-subtitle-cat">{getCurrentCategoryName()}</span>
                            <span className="b-subtitle-dot">·</span>
                            Livraison à Yamoussoukro
                        </p>
                    </motion.div>

                    <motion.div
                        className="b-search-block"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.65 }}
                    >
                        <div className="b-search-wrapper">
                            <FiSearch className="b-search-icon" />
                            <input
                                type="text"
                                placeholder="Rechercher un produit…"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            />
                            <button className="b-search-btn" onClick={handleSearch}>
                                Rechercher
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        className="b-banner-pills"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.55, duration: 0.7 }}
                    >
                        {['Livraison 72h max', 'Paiement à la livraison', 'Retour 7 jours', 'Support 7j/7'].map((p, i) => (
                            <span key={i} className="b-pill"><FiCheckCircle />{p}</span>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── CORPS ─────────────────────────────────────────────── */}
            <div className="b-body container">

                {/* Sidebar desktop */}
                <aside className="b-sidebar">
                    <SidebarContent />
                </aside>

                {/* Zone principale */}
                <main className="b-main">

                    {/* Toolbar */}
                    <div className="b-toolbar">
                        <div className="b-toolbar-left">
                            <motion.button
                                className="b-mobile-btn"
                                onClick={() => setDrawerOpen(true)}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiSliders size={14} />
                                Filtres
                                {activeFiltersCount > 0 && (
                                    <span className="b-filter-badge">{activeFiltersCount}</span>
                                )}
                            </motion.button>
                            <span className="b-count">
                                <strong>{produits.length}</strong> produit{produits.length !== 1 ? 's' : ''}
                            </span>
                            {activeFiltersCount > 0 && (
                                <button className="b-clear-inline" onClick={resetFilters}>
                                    <FiX size={12} /> Effacer
                                </button>
                            )}
                        </div>
                        <div className="b-toolbar-right">
                            <div className="b-tri-wrap">
                                <select
                                    value={filtres.tri}
                                    onChange={e => applyFilter({ tri: e.target.value })}
                                >
                                    <option value="-date_creation">Nouveautés</option>
                                    <option value="-prix">Prix décroissant</option>
                                    <option value="prix">Prix croissant</option>
                                </select>
                                <FiChevronDown size={13} className="b-tri-arrow" />
                            </div>
                            <div className="b-view-toggle">
                                <button
                                    className={`b-vbtn ${viewMode === 'grid' ? 'b-vbtn-on' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                    title="Vue grille"
                                >
                                    <FiGrid size={14} />
                                </button>
                                <button
                                    className={`b-vbtn ${viewMode === 'list' ? 'b-vbtn-on' : ''}`}
                                    onClick={() => setViewMode('list')}
                                    title="Vue liste"
                                >
                                    <FiList size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Produits */}
                    {loading ? (
                        <div className={viewMode === 'grid' ? 'b-grid' : 'b-list'}>
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="b-skeleton">
                                    <div className="bsk-img" />
                                    <div className="bsk-body">
                                        <div className="bsk-line" />
                                        <div className="bsk-line bsk-short" />
                                        <div className="bsk-line bsk-price" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : produits.length === 0 ? (
                        <motion.div
                            className="b-empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="b-empty-icon">🔍</div>
                            <h3>Aucun produit trouvé</h3>
                            <p>Essayez de modifier vos critères de recherche ou de filtres</p>
                            <button onClick={resetFilters}>Réinitialiser les filtres</button>
                        </motion.div>
                    ) : (
                        <>
                            <motion.div
                                className={viewMode === 'grid' ? 'b-grid' : 'b-list'}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {produits.map((produit, index) => {
                                    const note = noteSimulee(produit.id);
                                    return (
                                        <motion.article
                                            key={produit.id}
                                            variants={itemVariants}
                                            className={`b-card ${viewMode === 'list' ? 'b-card-list' : ''} ${!produit.disponible ? 'b-card-out' : ''}`}
                                            ref={index === produits.length - 1 ? lastProductRef : null}
                                            whileHover={viewMode === 'grid' ? { y: -6 } : {}}
                                        >
                                            <Link to={`/produit/${produit.id}`} className="b-card-link">
                                                {/* Image */}
                                                <div className="b-card-img-wrap">
                                                    <img
                                                        src={getImageUrl(produit.image)}
                                                        alt={produit.nom}
                                                        loading="lazy"
                                                    />
                                                    <div className="b-card-img-overlay" />
                                                    {produit.est_nouveau && (
                                                        <span className="b-badge b-badge-new">NEW</span>
                                                    )}
                                                    {!produit.disponible && (
                                                        <span className="b-badge b-badge-out">Rupture</span>
                                                    )}
                                                    {produit.en_solde && (
                                                        <span className="b-badge b-badge-sale">SOLDE</span>
                                                    )}
                                                    <motion.button
                                                        className="b-quick-add"
                                                        onClick={e => handleAddToCart(produit, e)}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.92 }}
                                                        title="Ajouter au panier"
                                                    >
                                                        <FiShoppingBag size={14} /> Ajouter
                                                    </motion.button>
                                                </div>

                                                {/* Infos */}
                                                <div className="b-card-body">
                                                    {produit.categorie_nom && (
                                                        <p className="b-card-cat">{produit.categorie_nom}</p>
                                                    )}
                                                    <h3 className="b-card-nom">{produit.nom}</h3>

                                                    {viewMode === 'list' && produit.description && (
                                                        <p className="b-card-desc">
                                                            {produit.description.substring(0, 120)}…
                                                        </p>
                                                    )}

                                                    <div className="b-card-stars">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FiStar
                                                                key={i}
                                                                size={11}
                                                                className={i < note ? 'bstar-on' : 'bstar-off'}
                                                            />
                                                        ))}
                                                        <span className="b-star-count">({note}.0)</span>
                                                    </div>

                                                    <div className="b-card-footer">
                                                        <span className="b-card-prix">{produit.prix_format}</span>
                                                        <motion.button
                                                            className="b-cart-icon-btn"
                                                            onClick={e => handleAddToCart(produit, e)}
                                                            whileHover={{ scale: 1.12 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            title="Ajouter au panier"
                                                        >
                                                            <FiShoppingBag size={14} />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.article>
                                    );
                                })}
                            </motion.div>

                            {loadingMore && (
                                <div className="b-loading-more">
                                    <div className="b-spinner" />
                                    <span>Chargement…</span>
                                </div>
                            )}

                            {!hasMore && produits.length > 0 && (
                                <div className="b-end">
                                    <div className="b-end-line" />
                                    <span>Fin du catalogue</span>
                                    <div className="b-end-line" />
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* ── DRAWER MOBILE ─────────────────────────────────────── */}
            <AnimatePresence>
                {drawerOpen && (
                    <>
                        <motion.div
                            className="b-drawer-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDrawerOpen(false)}
                        />
                        <motion.div
                            className="b-drawer"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
                        >
                            <div className="b-drawer-header">
                                <span className="b-drawer-title">
                                    <FiSliders size={16} />
                                    Filtres
                                    {activeFiltersCount > 0 && (
                                        <span className="b-filter-badge">{activeFiltersCount}</span>
                                    )}
                                </span>
                                <motion.button
                                    className="b-drawer-close"
                                    onClick={() => setDrawerOpen(false)}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiX size={18} />
                                </motion.button>
                            </div>
                            <div className="b-drawer-body">
                                <SidebarContent />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default Boutique;