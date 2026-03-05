import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiLogOut, FiCheck, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '../src/context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './MonCompte.css';

const MonCompte = () => {
    const navigate = useNavigate();
    const { user, logout, updateProfile, changePassword } = useAuth();

    // Profil
    const [profileData, setProfileData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
    });
    const [profileMsg, setProfileMsg] = useState('');
    const [profileErr, setProfileErr] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);

    // Mot de passe
    const [pwdData, setPwdData] = useState({
        old_password: '',
        new_password: '',
        new_password_confirm: '',
    });
    const [pwdMsg, setPwdMsg] = useState('');
    const [pwdErr, setPwdErr] = useState('');
    const [pwdLoading, setPwdLoading] = useState(false);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
        setProfileMsg('');
        setProfileErr('');
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileErr('');
        setProfileMsg('');

        try {
            await updateProfile(profileData);
            setProfileMsg('Profil mis à jour !');
        } catch (err) {
            setProfileErr('Erreur lors de la mise à jour.');
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePwdChange = (e) => {
        setPwdData({ ...pwdData, [e.target.name]: e.target.value });
        setPwdMsg('');
        setPwdErr('');
    };

    const handlePwdSubmit = async (e) => {
        e.preventDefault();
        setPwdLoading(true);
        setPwdErr('');
        setPwdMsg('');

        if (pwdData.new_password.length < 6) {
            setPwdErr('Le mot de passe doit contenir au moins 6 caractères.');
            setPwdLoading(false);
            return;
        }

        if (pwdData.new_password !== pwdData.new_password_confirm) {
            setPwdErr('Les mots de passe ne correspondent pas.');
            setPwdLoading(false);
            return;
        }

        try {
            await changePassword(pwdData);
            setPwdMsg('Mot de passe modifié !');
            setPwdData({ old_password: '', new_password: '', new_password_confirm: '' });
        } catch (err) {
            const data = err.response?.data;
            if (data?.old_password) {
                setPwdErr('Mot de passe actuel incorrect.');
            } else {
                setPwdErr('Erreur lors du changement.');
            }
        } finally {
            setPwdLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const memberDate = user?.date_joined
        ? new Date(user.date_joined).toLocaleDateString('fr-FR', {
            year: 'numeric', month: 'long', day: 'numeric'
        })
        : '';

    return (
        <div className="account-page">
            <Header />
            <div className="account-container">
                <motion.div
                    className="account-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* En-tête profil */}
                    <div className="account-hero">
                        <div className="account-avatar">
                            {user?.first_name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <h1 className="account-name">
                            {user?.first_name} {user?.last_name}
                        </h1>
                        <p className="account-email">{user?.email}</p>
                        <p className="account-member">Membre depuis {memberDate}</p>
                    </div>

                    {/* Section Profil */}
                    <div className="account-section">
                        <h2 className="section-title">
                            <FiEdit2 /> Modifier mon profil
                        </h2>

                        <form onSubmit={handleProfileSubmit} className="account-form">
                            {profileMsg && <div className="auth-success"><FiCheck /> {profileMsg}</div>}
                            {profileErr && <div className="auth-error">{profileErr}</div>}

                            <div className="form-row">
                                <div className="auth-field">
                                    <label htmlFor="first_name">
                                        <FiUser className="field-icon" /> Prénom
                                    </label>
                                    <input
                                        id="first_name"
                                        type="text"
                                        name="first_name"
                                        value={profileData.first_name}
                                        onChange={handleProfileChange}
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
                                        value={profileData.last_name}
                                        onChange={handleProfileChange}
                                    />
                                </div>
                            </div>

                            <div className="auth-field email-readonly">
                                <label>
                                    <FiMail className="field-icon" /> Email
                                </label>
                                <input type="email" value={user?.email || ''} disabled />
                            </div>

                            <button type="submit" className="auth-submit" disabled={profileLoading}>
                                {profileLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </button>
                        </form>
                    </div>

                    {/* Section Mot de passe */}
                    <div className="account-section">
                        <h2 className="section-title">
                            <FiLock /> Changer le mot de passe
                        </h2>

                        <form onSubmit={handlePwdSubmit} className="account-form">
                            {pwdMsg && <div className="auth-success"><FiCheck /> {pwdMsg}</div>}
                            {pwdErr && <div className="auth-error">{pwdErr}</div>}

                            <div className="auth-field">
                                <label htmlFor="old_password">Mot de passe actuel</label>
                                <input
                                    id="old_password"
                                    type="password"
                                    name="old_password"
                                    value={pwdData.old_password}
                                    onChange={handlePwdChange}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="auth-field">
                                    <label htmlFor="new_password">Nouveau mot de passe</label>
                                    <input
                                        id="new_password"
                                        type="password"
                                        name="new_password"
                                        value={pwdData.new_password}
                                        onChange={handlePwdChange}
                                        placeholder="Min. 6 caractères"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="auth-field">
                                    <label htmlFor="new_password_confirm">Confirmer</label>
                                    <input
                                        id="new_password_confirm"
                                        type="password"
                                        name="new_password_confirm"
                                        value={pwdData.new_password_confirm}
                                        onChange={handlePwdChange}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="auth-submit" disabled={pwdLoading}>
                                {pwdLoading ? 'Modification...' : 'Modifier le mot de passe'}
                            </button>
                        </form>
                    </div>

                    {/* Déconnexion */}
                    <button className="logout-btn" onClick={handleLogout}>
                        <FiLogOut /> Se déconnecter
                    </button>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default MonCompte;
