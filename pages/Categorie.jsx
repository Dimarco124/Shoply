import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiGrid, FiList, FiSearch, FiShoppingBag,
    FiChevronDown, FiStar, FiX, FiSliders,
    FiArrowLeft, FiHome
} from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { produitService, categorieService, getBackendBaseUrl, getImageUrl } from '../services/api';
import { useCart } from '../src/context/CartContext';
import './Categorie.css';

const Categorie = () => {
    const { id } = useParams();
    const { cartCount, addToCart } = useCart();

    const [categorie, setCategorie] = useState(null);
    const [categories, setCategories] = useState([]);
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState('grid');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [prixSlider, setPrixSlider] = useState(500000);
    const [searchInput, setSearchInput] = useState('');

    const [filtres, setFiltres] = useState({
        prix_min: '', prix_max: '', recherche: '',
        disponible: '', tri: '-date_creation'
    });

    const observerRef = useRef();
    const lastProductRef = useCallback(node => {
        if (loading || loadingMore) return;
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) loadMore();
        });
        if (node) observerRef.current.observe(node);
    }, [loading, loadingMore, hasMore]);

    // Charger catégories + catégorie courante
    useEffect(() => {
        const init = async () => {
            try {
                const cats = await categorieService.getAll();
                setCategories(cats);
                const found = cats.find(c => c.id === parseInt(id));
                setCategorie(found || null);
            } catch (e) { console.error(e); }
        };
        init();
    }, [id]);

    // Recharger produits quand filtres ou id changent
    useEffect(() => {
        setPage(1); setProduits([]); setHasMore(true);
        loadProduits(filtres, 1);
    }, [filtres, id]);

    const loadProduits = async (f, pageNum = 1) => {
        try {
            setLoading(pageNum === 1); setLoadingMore(pageNum > 1);
            const params = {
                page: pageNum, page_size: 12,
                categorie: parseInt(id),
                ...(f.prix_min && { 'prix__gte': f.prix_min }),
                ...(f.prix_max && { 'prix__lte': f.prix_max }),
                ...(f.recherche && { search: f.recherche }),
                ...(f.disponible && { disponible: f.disponible === 'true' }),
                ordering: f.tri
            };
            const data = await produitService.getAll(params);
            const results = data.results || data;
            if (pageNum === 1) setProduits(results);
            else setProduits(prev => [...prev, ...results]);
            setHasMore(results.length === 12);
            setPage(pageNum);
        } catch (e) { console.error(e); }
        finally { setLoading(false); setLoadingMore(false); }
    };

    const loadMore = () => { if (!loadingMore && hasMore) loadProduits(filtres, page + 1); };

    const applyFilter = (patch, close = false) => {
        const f = { ...filtres, ...patch };
        setFiltres(f);
        if (close) setDrawerOpen(false);
    };

    const resetFilters = () => {
        setFiltres({ prix_min: '', prix_max: '', recherche: '', disponible: '', tri: '-date_creation' });
        setPrixSlider(500000); setSearchInput(''); setDrawerOpen(false);
    };

    const handleSearch = () => applyFilter({ recherche: searchInput });

    // getImageUrl est maintenant importé de ../services/api

    const handleAddToCart = (produit, e) => { e.preventDefault(); addToCart(produit, 1); };
    const noteSimulee = (id) => [3, 3, 4, 4, 4, 5, 5][id % 7];

    const activeFiltersCount = [filtres.prix_max, filtres.disponible, filtres.recherche].filter(Boolean).length;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } }
    };

    /* ── Sidebar content ── */
    const SidebarContent = () => (
        <div className="cat-sidebar-inner">

            {/* Breadcrumb catégories */}
            <div className="cat-sb-block">
                <h4 className="cat-sb-title">Catégories</h4>
                <ul className="cat-sb-list">
                    <li>
                        <Link to="/shop" className="cat-sb-btn">
                            <span>Toutes les catégories</span>
                        </Link>
                    </li>
                    {categories.map(cat => (
                        <li key={cat.id}>
                            <Link
                                to={`/categorie/${cat.id}`}
                                className={`cat-sb-btn ${cat.id === parseInt(id) ? 'cat-sb-active' : ''}`}
                            >
                                <span>{cat.nom}</span>
                                <FiChevronDown size={13} />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Prix */}
            <div className="cat-sb-block">
                <h4 className="cat-sb-title">Prix (FCFA)</h4>
                <input
                    type="range" min={0} max={500000} step={5000}
                    value={prixSlider}
                    onChange={e => setPrixSlider(Number(e.target.value))}
                    className="cat-sb-slider"
                />
                <div className="cat-sb-price-labels">
                    <span>0</span>
                    <span>{prixSlider.toLocaleString()} FCFA</span>
                </div>
                <button className="cat-sb-filter-btn" onClick={() => applyFilter({ prix_max: String(prixSlider) }, true)}>
                    Appliquer le prix
                </button>
            </div>

            {/* Disponibilité */}
            <div className="cat-sb-block">
                <h4 className="cat-sb-title">Disponibilité</h4>
                {[
                    { val: '', label: 'Tous' },
                    { val: 'true', label: 'En stock' },
                    { val: 'false', label: 'Rupture de stock' }
                ].map(opt => (
                    <label key={opt.val} className="cat-sb-radio">
                        <input
                            type="radio" name="cat-dispo" value={opt.val}
                            checked={filtres.disponible === opt.val}
                            onChange={() => applyFilter({ disponible: opt.val }, true)}
                        />
                        <span>{opt.label}</span>
                    </label>
                ))}
            </div>

            {/* Reset */}
            {activeFiltersCount > 0 && (
                <button className="cat-sb-reset" onClick={resetFilters}>
                    <FiX size={13} /> Effacer les filtres
                </button>
            )}
        </div>
    );

    /* ── Loading initial ── */
    if (loading && !categorie) {
        return (
            <div className="categorie-page">
                <Header panierCount={cartCount} />
                <div className="cat-loading-screen">
                    <div className="cat-spinner" />
                    <p>Chargement…</p>
                </div>
                <Footer />
            </div>
        );
    }

    /* ── Not found ── */
    if (!categorie && !loading) {
        return (
            <div className="categorie-page">
                <Header panierCount={cartCount} />
                <div className="cat-not-found">
                    <h2>Catégorie introuvable</h2>
                    <Link to="/shop" className="cat-back-btn">
                        <FiArrowLeft /> Retour à la boutique
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="categorie-page">
            <Header panierCount={cartCount} />

            {/* ── Bannière catégorie ── */}
            <section className="cat-banner">
                {/* Image de fond avec overlay */}
                {categorie?.image && (
                    <div
                        className="cat-banner-bg"
                        style={{ backgroundImage: `url(${getImageUrl(categorie.image)})` }}
                    />
                )}
                <div className="cat-banner-overlay" />

                <div className="cat-banner-inner">
                    {/* Breadcrumb */}
                    <motion.nav
                        className="cat-breadcrumb"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link to="/"><FiHome size={13} /> Accueil</Link>
                        <span>/</span>
                        <Link to="/shop">Boutique</Link>
                        <span>/</span>
                        <span className="cat-breadcrumb-current">{categorie?.nom}</span>
                    </motion.nav>

                    <motion.div
                        className="cat-banner-text"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                    >
                        <span className="cat-eyebrow">Collection</span>
                        <h1 className="cat-title">{categorie?.nom}</h1>
                        {categorie?.description && (
                            <p className="cat-subtitle">{categorie.description}</p>
                        )}
                        <span className="cat-count-pill">
                            {produits.length} produit{produits.length !== 1 ? 's' : ''}
                        </span>
                    </motion.div>

                    {/* Recherche */}
                    <motion.div
                        className="cat-search"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <FiSearch className="cat-search-icon" />
                        <input
                            type="text"
                            placeholder={`Rechercher dans ${categorie?.nom || 'cette catégorie'}…`}
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                        <button onClick={handleSearch}>Rechercher</button>
                    </motion.div>
                </div>
            </section>

            {/* ── Corps ── */}
            <div className="cat-body">

                {/* Sidebar desktop */}
                <aside className="cat-sidebar">
                    <SidebarContent />
                </aside>

                {/* Zone principale */}
                <main className="cat-main">

                    {/* Toolbar */}
                    <div className="cat-toolbar">
                        <div className="cat-toolbar-left">
                            <motion.button
                                className="cat-mobile-btn"
                                onClick={() => setDrawerOpen(true)}
                                whileTap={{ scale: 0.96 }}
                            >
                                <FiSliders size={14} />
                                Filtres
                                {activeFiltersCount > 0 && (
                                    <span className="cat-badge-count">{activeFiltersCount}</span>
                                )}
                            </motion.button>
                            <span className="cat-count">
                                <strong>{produits.length}</strong> produit{produits.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="cat-toolbar-right">
                            <div className="cat-tri">
                                <select
                                    value={filtres.tri}
                                    onChange={e => applyFilter({ tri: e.target.value })}
                                >
                                    <option value="-date_creation">Nouveautés</option>
                                    <option value="-prix">Prix décroissant</option>
                                    <option value="prix">Prix croissant</option>
                                </select>
                                <FiChevronDown size={13} className="cat-tri-arrow" />
                            </div>
                            <div className="cat-view">
                                <button className={`cat-vbtn ${viewMode === 'grid' ? 'cat-vbtn-on' : ''}`} onClick={() => setViewMode('grid')}>
                                    <FiGrid size={15} />
                                </button>
                                <button className={`cat-vbtn ${viewMode === 'list' ? 'cat-vbtn-on' : ''}`} onClick={() => setViewMode('list')}>
                                    <FiList size={15} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Produits */}
                    {loading ? (
                        <div className={viewMode === 'grid' ? 'cat-grid' : 'cat-list'}>
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="cat-skeleton">
                                    <div className="cat-sk-img" />
                                    <div className="cat-sk-line" />
                                    <div className="cat-sk-line cat-sk-short" />
                                </div>
                            ))}
                        </div>
                    ) : produits.length === 0 ? (
                        <motion.div className="cat-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <span>🔍</span>
                            <h3>Aucun produit trouvé</h3>
                            <p>Essayez de modifier vos filtres</p>
                            <button onClick={resetFilters}>Réinitialiser</button>
                        </motion.div>
                    ) : (
                        <>
                            <motion.div
                                className={viewMode === 'grid' ? 'cat-grid' : 'cat-list'}
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
                                            className={`cat-card ${viewMode === 'list' ? 'cat-card-list' : ''}`}
                                            ref={index === produits.length - 1 ? lastProductRef : null}
                                            whileHover={viewMode === 'grid' ? { y: -4 } : {}}
                                            transition={{ duration: 0.22 }}
                                        >
                                            <Link to={`/produit/${produit.id}`} className="cat-card-link">

                                                {/* Image */}
                                                <div className="cat-card-img-wrap">
                                                    <img
                                                        src={getImageUrl(produit.image)}
                                                        alt={produit.nom}
                                                        loading="lazy"
                                                    />
                                                    {produit.est_nouveau && <span className="cat-badge cat-badge-new">NEW</span>}
                                                    {!produit.disponible && <span className="cat-badge cat-badge-out">OUT OF STOCK</span>}
                                                    {produit.en_solde && <span className="cat-badge cat-badge-sale">SALE</span>}
                                                </div>

                                                {/* Infos */}
                                                <div className="cat-card-body">
                                                    <p className="cat-card-cat">{produit.categorie_nom}</p>
                                                    <h3 className="cat-card-nom">{produit.nom}</h3>

                                                    {viewMode === 'list' && produit.description && (
                                                        <p className="cat-card-desc">
                                                            {produit.description.substring(0, 100)}…
                                                        </p>
                                                    )}

                                                    <div className="cat-card-stars">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FiStar key={i} size={12} className={i < note ? 'cstar-on' : 'cstar-off'} />
                                                        ))}
                                                    </div>

                                                    <div className="cat-card-footer">
                                                        <span className="cat-card-prix">{produit.prix_format}</span>
                                                        <motion.button
                                                            className="cat-cart-btn"
                                                            onClick={e => handleAddToCart(produit, e)}
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.92 }}
                                                            title="Ajouter au panier"
                                                        >
                                                            <FiShoppingBag size={13} />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.article>
                                    );
                                })}
                            </motion.div>

                            {loadingMore && (
                                <div className="cat-load-more">
                                    <div className="cat-spinner" />
                                    <span>Chargement…</span>
                                </div>
                            )}

                            {!hasMore && produits.length > 0 && (
                                <div className="cat-end">— Fin de la collection —</div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* ── Drawer mobile ── */}
            <AnimatePresence>
                {drawerOpen && (
                    <>
                        <motion.div
                            className="cat-drawer-overlay"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setDrawerOpen(false)}
                        />
                        <motion.div
                            className="cat-drawer"
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.28 }}
                        >
                            <div className="cat-drawer-header">
                                <span>
                                    Filtres
                                    {activeFiltersCount > 0 && (
                                        <span className="cat-badge-count" style={{ marginLeft: 8 }}>{activeFiltersCount}</span>
                                    )}
                                </span>
                                <motion.button
                                    className="cat-drawer-close"
                                    onClick={() => setDrawerOpen(false)}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiX size={20} />
                                </motion.button>
                            </div>
                            <div className="cat-drawer-body">
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

export default Categorie;