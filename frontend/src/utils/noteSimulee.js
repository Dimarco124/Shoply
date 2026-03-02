// Retourne une note simulée stable (3 à 5) basée sur l'id du produit
const noteSimulee = (id) => [3, 3, 4, 4, 4, 5, 5][id % 7];

export default noteSimulee;