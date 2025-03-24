// src/components/crypto/CryptoDetails.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";

const CryptoDetails = () => {
  const { id } = useParams();
  const [crypto, setCrypto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [displayQuantity, setDisplayQuantity] = useState("1");

  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchCryptoDetails = async () => {
      try {
        const response = await api.get(`/api/cryptos/${id}`);
        setCrypto(response.data);
        setLoading(false);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des détails de la crypto-monnaie:",
          error
        );
        setError(
          "Impossible de charger les détails. Veuillez réessayer plus tard."
        );
        setLoading(false);
      }
    };

    fetchCryptoDetails();
  }, [id]);

  // Formater un nombre pour l'affichage
  const formatNumber = (num) => {
    // Pour les très petits nombres, utilisez un nombre fixe de décimales
    if (num < 0.0001) {
      return num.toFixed(8);
    }
    // Pour les nombres plus grands, utilisez un format plus lisible
    return num.toString();
  };

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
      // Convertir la chaîne en nombre pour l'API
      const numQuantity = parseFloat(displayQuantity.replace(",", "."));
      // Assurez-vous que quantity est au moins 0.00000001 avant d'ajouter au panier
      const validQuantity = Math.max(0.00000001, numQuantity || 0);

      await api.post("/api/cart", {
        cryptoId: crypto.id_crypto,
        quantite: validQuantity,
      });
      alert("Ajouté au panier avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      alert("Erreur lors de l'ajout au panier");
    }
  };

  // Fonction pour gérer le changement de quantité
  const handleQuantityChange = (e) => {
    const inputValue = e.target.value;

    // Permettre une saisie vide ou un point/virgule seul
    if (inputValue === "" || inputValue === "." || inputValue === ",") {
      setDisplayQuantity(inputValue);
      return;
    }

    // Remplacer les virgules par des points pour le parsing
    const cleanValue = inputValue.replace(",", ".");

    // Vérifier si c'est un format de nombre valide
    if (/^\d*\.?\d*$/.test(cleanValue)) {
      const numValue = parseFloat(cleanValue);

      // Ne mettre à jour que si c'est un nombre positif ou si la chaîne est valide mais pas encore un nombre complet
      if (!isNaN(numValue) && numValue >= 0) {
        setQuantity(numValue);
        setDisplayQuantity(inputValue);
      } else if (/^\d*\.?$/.test(cleanValue)) {
        // C'est un nombre en cours de saisie (e.g., "5.")
        setDisplayQuantity(inputValue);
      }
    }
  };

  // Fonction pour incrémenter la quantité
  const incrementQuantity = () => {
    const currentValue = parseFloat(displayQuantity.replace(",", ".")) || 0;
    const newValue = currentValue + 0.1;
    setQuantity(newValue);
    setDisplayQuantity(formatNumber(newValue));
  };

  // Fonction pour décrémenter la quantité
  const decrementQuantity = () => {
    const currentValue = parseFloat(displayQuantity.replace(",", ".")) || 0;
    const newValue = Math.max(0.00000001, currentValue - 0.1);
    setQuantity(newValue);
    setDisplayQuantity(formatNumber(newValue));
  };

  // Fonction pour finaliser la quantité quand l'utilisateur quitte le champ
  const finalizeQuantity = () => {
    // Convertir la valeur affichée en nombre
    const numValue = parseFloat(displayQuantity.replace(",", ".")) || 0;

    // Imposer une valeur minimale
    if (numValue <= 0) {
      setQuantity(0.00000001);
      setDisplayQuantity("0.00000001");
    } else {
      // Formater proprement le nombre pour l'affichage
      setQuantity(numValue);
      setDisplayQuantity(formatNumber(numValue));
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

  if (!crypto) {
    return (
      <div className="text-center p-4 bg-yellow-100 text-yellow-700 rounded-md">
        Crypto-monnaie non trouvée.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold">{crypto.nom}</h2>
            <p className="text-xl text-gray-500">{crypto.symbol}</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded text-xl font-medium">
            {parseFloat(crypto.prix).toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            })}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">
            À propos de {crypto.nom}
          </h3>
          <p className="text-gray-700">
            {/* Ici, vous pourriez ajouter une description si elle est disponible dans vos données */}
            Information détaillée sur {crypto.nom} ({crypto.symbol}). Cette
            crypto-monnaie est actuellement cotée à{" "}
            {parseFloat(crypto.prix).toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            })}
            .
          </p>
        </div>

        {isAuthenticated && (
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Actions</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <button
                  onClick={addToFavorites}
                  className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Ajouter aux favoris
                </button>
              </div>

              <div>
                <div className="mb-2">
                  <label htmlFor="quantity" className="block mb-1 font-medium">
                    Quantité:
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={decrementQuantity}
                      className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-md hover:bg-gray-300"
                    >
                      −
                    </button>
                    <input
                      id="quantity"
                      type="text"
                      inputMode="decimal"
                      className="w-full px-3 py-2 border-t border-b border-gray-300 text-center"
                      value={displayQuantity}
                      onChange={handleQuantityChange}
                      onBlur={finalizeQuantity}
                    />
                    <button
                      type="button"
                      onClick={incrementQuantity}
                      className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-md hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={addToCart}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link to="/" className="text-blue-500 hover:underline">
            &larr; Retour à la liste des crypto-monnaies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetails;
