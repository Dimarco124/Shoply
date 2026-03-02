import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Accueil from '../pages/Accueil';
import Boutique from '../pages/Boutique';
import ProduitDetail from '../pages/ProduitDetail';
import Panier from '../pages/Panier'; // On va le créer
import './App.css';
import Categorie from '../pages/Categorie';
import ScrollToTop from '../components/ScrollToTop';
import APropos from '../pages/APropos'; 
import Contact from '../pages/Contact';



function App() {
  
  return (
    <BrowserRouter>
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
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;