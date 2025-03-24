// src/components/favorites/FavoritesList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get("/api/favorites");
        setFavorites(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris:", error);
        setError(
          "Impossible de charger vos favoris. Veuillez réessayer plus tard."
        );
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (favoriteId) => {
    try {
      await api.delete(`/api/favorites/${favoriteId}`);
      setFavorites(favorites.filter((fav) => fav.id_favoris !== favoriteId));
    } catch (error) {
      console.error("Erreur lors de la suppression du favori:", error);
      alert("Erreur lors de la suppression du favori");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-100 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          Mes Crypto-monnaies Favorites
        </h2>

        {favorites.length === 0 ? (
          <div className="text-center p-4 bg-gray-100 rounded-md">
            Vous n'avez pas encore de favoris.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Nom</th>
                  <th className="py-3 px-6 text-left">Symbole</th>
                  <th className="py-3 px-6 text-right">Prix</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {favorites.map((favorite) => (
                  <tr
                    key={favorite.id_favoris}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-6 text-left">
                      <Link
                        to={`/crypto/${favorite.Crypto.id_crypto}`}
                        className="text-blue-500 hover:underline"
                      >
                        {favorite.Crypto.nom}
                      </Link>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {favorite.Crypto.symbol}
                    </td>
                    <td className="py-3 px-6 text-right">
                      {parseFloat(favorite.Crypto.prix).toLocaleString(
                        "fr-FR",
                        {
                          style: "currency",
                          currency: "EUR",
                        }
                      )}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex justify-center">
                        <button
                          onClick={() => removeFavorite(favorite.id_favoris)}
                          className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesList;
