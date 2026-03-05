import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiUserPlus, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../src/context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Connexion.css'; // Réutilise le même CSS

const Inscription = () => {
    const navigate = useNavigate();
    const { register, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirm: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (isAuthenticated) {
        navigate('/mon-compte', { replace: true });
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation côté client
        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.password_confirm) {
            setError('Les mots de passe ne correspondent pas.');
            setLoading(false);
            return;
        }

        try {
            await register(formData);
            navigate('/mon-compte');
        } catch (err) {
            const data = err.response?.data;
            if (data) {
                // Extraire le premier message d'erreur
                const firstError = Object.values(data).flat()[0];
                setError(typeof firstError === 'string' ? firstError : 'Erreur lors de l\'inscription.');
            } else {
                setError('Erreur de connexion au serveur.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Header />
            <div className="auth-container">
                <motion.div
                    className="auth-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="auth-header">
                        <h1 className="auth-title">Créer un compte</h1>
                        <p className="auth-subtitle">Rejoignez la communauté Shoply</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <motion.div
                                className="auth-error"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="auth-field">
                                <label htmlFor="first_name">
                                    <FiUser className="field-icon" /> Prénom
                                </label>
                                <input
                                    id="first_name"
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    placeholder="Votre prénom"
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="last_name">
                                    <FiUser className="field-icon" /> Nom
                                </label>
                                <input
                                    id="last_name"
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    placeholder="Votre nom"
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="email">
                                <FiMail className="field-icon" /> Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="votre@email.com"
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="password">
                                <FiLock className="field-icon" /> Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minimum 6 caractères"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="password_confirm">
                                <FiLock className="field-icon" /> Confirmer
                            </label>
                            <input
                                id="password_confirm"
                                type="password"
                                name="password_confirm"
                                value={formData.password_confirm}
                                onChange={handleChange}
                                placeholder="Confirmez le mot de passe"
                                required
                                minLength={6}
                            />
                        </div>

                        <button type="submit" className="auth-submit" disabled={loading}>
                            <FiUserPlus /> {loading ? 'Création...' : 'Créer mon compte'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Déjà un compte ?{' '}
                            <Link to="/connexion" className="auth-link">
                                <FiLogIn /> Se connecter
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default Inscription;
