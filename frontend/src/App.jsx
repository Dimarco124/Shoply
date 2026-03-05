import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Accueil from '../pages/Accueil';
import Boutique from '../pages/Boutique';
import ProduitDetail from '../pages/ProduitDetail';
import Panier from '../pages/Panier';
import './App.css';
import Categorie from '../pages/Categorie';
import ScrollToTop from '../components/ScrollToTop';
import APropos from '../pages/APropos';
import Contact from '../pages/Contact';
import Connexion from '../pages/Connexion';
import Inscription from '../pages/Inscription';
import MonCompte from '../pages/MonCompte';
import ProtectedRoute from '../components/ProtectedRoute';
import Checkout from '../pages/Checkout';



function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/shop" element={<Boutique />} />
            <Route path="/categorie/:id" element={<Categorie />} />
            <Route path="/produit/:id" element={<ProduitDetail />} />
            <Route path="/panier" element={<Panier />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/mon-compte" element={
              <ProtectedRoute>
                <MonCompte />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;