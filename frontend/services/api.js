import axios from 'axios';

// En développement : http://127.0.0.1:8000/api/
// En production : définir VITE_API_URL (ex. https://ton-backend.onrender.com/api/)
const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';

/** URL de base du backend (sans /api) pour les images. */
export function getBackendBaseUrl() {
    const url = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';
    // Retire /api ou /api/ à la fin et s'assure qu'il n'y a pas de slash final pour la concaténation
    return url.replace(/\/api\/?$/, '').replace(/\/$/, '') || 'http://127.0.0.1:8000';
}

/** 
 * Construit l'URL complète d'une image.
 * Gère les chemins relatifs de Django, les URLs absolues et les images manquantes.
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/default-category.jpg';
    if (imagePath.startsWith('http')) return imagePath;

    const baseUrl = getBackendBaseUrl();
    // S'assure que le chemin commence par /
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    
    // Si le chemin ne contient pas /media/ et n'est pas un chemin statique, on l'ajoute (optionnel selon config DRF)
    // Mais ici, on va faire simple : on concatène proprement.
    return `${baseUrl}${normalizedPath}`;
};

const api = axios.create({
    baseURL: baseURL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Toujours retourner un tableau (évite les crashs si la réponse n'est pas au format attendu)
function toArray(data) {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.results)) return data.results;
    return [];
}

export const categorieService = {
    getAll: async () => {
        try {
            const response = await api.get('categories/');
            const data = response.data;
            return Array.isArray(data) ? data : (data && Array.isArray(data.results) ? data.results : []);
        } catch (error) {
            console.error('Erreur chargement catégories:', error?.message || error);
            return [];
        }
    },
};

export const produitService = {
    getAll: async (params = {}) => {
        try {
            const response = await api.get('produits/', { params });
            const data = response.data;
            return data;
        } catch (error) {
            console.error('Erreur chargement produits:', error?.message || error);
            throw error;
        }
    },

    getPhare: async () => {
        try {
            const response = await api.get('produits/?disponible=true&page_size=4');
            const arr = toArray(response.data);
            return arr.slice(0, 4);
        } catch (error) {
            console.error('Erreur chargement produits phares:', error?.message || error);
            return [];
        }
    },

    getDerniersProduits: async (limit = 20) => {
        try {
            const response = await api.get('produits/?ordering=-date_creation', {
                params: { page_size: limit }
            });
            const arr = toArray(response.data);
            return arr.slice(0, limit);
        } catch (error) {
            console.error('Erreur chargement derniers produits:', error?.message || error);
            return [];
        }
    },

    getDerniersProduitHero: async (limit = 3) => {
        try {
            const response = await api.get('produits/?ordering=-date_creation&disponible=true', {
                params: { page_size: limit }
            });
            const arr = toArray(response.data);
            return arr.slice(0, limit);
        } catch (error) {
            console.error('Erreur chargement derniers produits hero:', error?.message || error);
            return [];
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`produits/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Erreur chargement produit', id, error?.message || error);
            throw error;
        }
    }
};


    export default api;