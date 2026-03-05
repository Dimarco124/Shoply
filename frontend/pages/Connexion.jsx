import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../src/context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Connexion.css';

const Connexion = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Rediriger si déjà connecté
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

        try {
            await login(formData.email, formData.password);
            navigate('/mon-compte');
        } catch (err) {
            const msg = err.response?.data?.detail || 'Erreur de connexion. Vérifiez vos identifiants.';
            setError(msg);
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
                        <h1 className="auth-title">Connexion</h1>
                        <p className="auth-subtitle">Accédez à votre espace personnel</p>
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
                                placeholder="Votre mot de passe"
                                required
                            />
                        </div>

                        <button type="submit" className="auth-submit" disabled={loading}>
                            <FiLogIn /> {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Pas encore de compte ?{' '}
                            <Link to="/inscription" className="auth-link">
                                <FiUserPlus /> Créer un compte
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default Connexion;
