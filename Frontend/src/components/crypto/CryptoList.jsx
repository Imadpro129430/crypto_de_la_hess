// src/components/crypto/CryptoList.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import CryptoCard from "./CryptoCard";

const CryptoList = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await api.get("/api/cryptos");
        setCryptos(response.data);
        setLoading(false);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des crypto-monnaies:",
          error
        );
        setError(
          "Impossible de charger les crypto-monnaies. Veuillez réessayer plus tard."
        );
        setLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      try {
        const response = await api.get("/api/cryptos");
        setCryptos(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des crypto-monnaies:",
          error
        );
        setError(
          "Impossible de charger les crypto-monnaies. Veuillez réessayer plus tard."
        );
      }
      return;
    }

    try {
      const response = await api.get(`/api/cryptos/search?query=${searchTerm}`);
      setCryptos(response.data);
    } catch (error) {
      console.error("Erreur lors de la recherche des crypto-monnaies:", error);
      setError(
        "Impossible de rechercher les crypto-monnaies. Veuillez réessayer plus tard."
      );
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
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0">
          Cours des Crypto-monnaies
        </h2>
      </div>

      {cryptos.length === 0 ? (
        <div className="text-center p-4 bg-gray-100 rounded-md">
          Aucune crypto-monnaie trouvée.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cryptos.map((crypto) => (
            <CryptoCard key={crypto.id_crypto} crypto={crypto} />
          ))}
        </div>
      )}

      {isAuthenticated && (
        <div className="mt-8 text-center">
          <Link
            to="/dashboard"
            className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Accéder à mon tableau de bord
          </Link>
        </div>
      )}
    </div>
  );
};

export default CryptoList;
