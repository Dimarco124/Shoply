import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                fontFamily: "'DM Sans', sans-serif",
                color: '#9C8E80'
            }}>
                Chargement...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/connexion" replace />;
    }

    return children;
};

export default ProtectedRoute;
