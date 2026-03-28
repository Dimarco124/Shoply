import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Au démarrage, vérifier si un token existe et charger le profil
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const response = await api.get('auth/profile/', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUser(response.data);
                } catch (error) {
                    // Token expiré ou invalide → tenter un refresh
                    const refreshed = await refreshToken();
                    if (!refreshed) {
                        logout();
                    }
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    // Inscription
    const register = async (userData) => {
        const response = await api.post('auth/register/', userData);
        const { user: userData2, tokens } = response.data;

        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        setUser(userData2);
        return response.data;
    };

    // Connexion
    const login = async (email, password) => {
        const response = await api.post('auth/login/', { email, password });
        const { user: userData2, tokens } = response.data;

        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        setUser(userData2);
        return response.data;
    };

    // Déconnexion
    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    }, []);

    // Rafraîchir le token
    const refreshToken = async () => {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) return false;

        try {
            const response = await api.post('auth/token/refresh/', { refresh });
            localStorage.setItem('access_token', response.data.access);
            if (response.data.refresh) {
                localStorage.setItem('refresh_token', response.data.refresh);
            }

            // Recharger le profil avec le nouveau token
            const profileResponse = await api.get('auth/profile/', {
                headers: { Authorization: `Bearer ${response.data.access}` },
            });
            setUser(profileResponse.data);
            return true;
        } catch {
            return false;
        }
    };

    // Mettre à jour le profil
    const updateProfile = async (profileData) => {
        const token = localStorage.getItem('access_token');
        const response = await api.put('auth/profile/', profileData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        return response.data;
    };

    // Changer le mot de passe
    const changePassword = async (passwordData) => {
        const token = localStorage.getItem('access_token');
        const response = await api.post('auth/change-password/', passwordData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
