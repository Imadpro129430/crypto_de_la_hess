// src/components/crypto/CryptoCard.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";

const CryptoCard = ({ crypto }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  const addToFavorites = async () => {
    try {
      await api.post("/api/favorites", { cryptoId: crypto.id_crypto });
      alert("Ajouté aux favoris avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris:", error);
      alert("Erreur lors de l'ajout aux favoris");
    }
  };

  const addToCart = async () => {
    try {
      await api.post("/api/cart", { cryptoId: crypto.id_crypto, quantite: 1 });
      alert("Ajouté au panier avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      alert("Erreur lors de l'ajout au panier");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden crypto-card">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{crypto.nom}</h3>
            <p className="text-gray-500">{crypto.symbol}</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
            {parseFloat(crypto.prix).toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            })}
          </div>
        </div>

        <div className="mt-4">
          <Link
            to={`/crypto/${crypto.id_crypto}`}
            className="text-blue-500 hover:underline block mb-2"
          >
            Voir les détails
          </Link>

          {isAuthenticated && (
            <div className="flex flex-col space-y-2 mt-2">
              <button
                onClick={addToFavorites}
                className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
              >
                Ajouter aux favoris
              </button>
              <button
                onClick={addToCart}
                className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                Ajouter au panier
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;
