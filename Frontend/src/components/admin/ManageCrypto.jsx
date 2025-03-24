// src/components/admin/ManageCrypto.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const ManageCrypto = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCrypto, setEditingCrypto] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    symbol: "",
    prix: "",
  });
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' pour croissant, 'desc' pour décroissant

  useEffect(() => {
    fetchCryptos();
  }, []);

  const fetchCryptos = async () => {
    try {
      const response = await api.get("/api/cryptos");
      // Tri des cryptos par prix (décroissant par défaut)
      const sortedCryptos = response.data.sort((a, b) =>
        sortOrder === "desc"
          ? parseFloat(b.prix) - parseFloat(a.prix)
          : parseFloat(a.prix) - parseFloat(b.prix)
      );

      // Ajouter un rang basé sur l'ordre de tri
      const rankedCryptos = sortedCryptos.map((crypto, index) => ({
        ...crypto,
        rank: index + 1,
      }));

      setCryptos(rankedCryptos);
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

  // Fonction pour trier les cryptos
  const sortCryptos = (order) => {
    const newOrder = order || sortOrder;
    const sortedCryptos = [...cryptos].sort((a, b) =>
      newOrder === "desc"
        ? parseFloat(b.prix) - parseFloat(a.prix)
        : parseFloat(a.prix) - parseFloat(b.prix)
    );

    // Réassigner les rangs après le tri
    const rankedCryptos = sortedCryptos.map((crypto, index) => ({
      ...crypto,
      rank: index + 1,
    }));

    setCryptos(rankedCryptos);
    setSortOrder(newOrder);
  };

  // Inverser l'ordre de tri
  const toggleSortOrder = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    sortCryptos(newOrder);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCrypto) {
        // Mise à jour d'une crypto existante
        await api.put(`/api/admin/crypto/${editingCrypto.id_crypto}`, formData);
      } else {
        // Ajout d'une nouvelle crypto
        await api.post("/api/admin/crypto", formData);
      }

      // Rafraîchir la liste et réinitialiser le formulaire
      fetchCryptos();
      resetForm();
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement de la crypto-monnaie:",
        error
      );
      alert("Erreur lors de l'enregistrement de la crypto-monnaie");
    }
  };

  const handleEdit = (crypto) => {
    setEditingCrypto(crypto);
    setFormData({
      nom: crypto.nom,
      symbol: crypto.symbol,
      prix: crypto.prix,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette crypto-monnaie ?"
      )
    ) {
      try {
        await api.delete(`/api/admin/crypto/${id}`);
        fetchCryptos();
      } catch (error) {
        console.error(
          "Erreur lors de la suppression de la crypto-monnaie:",
          error
        );
        alert("Erreur lors de la suppression de la crypto-monnaie");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      symbol: "",
      prix: "",
    });
    setEditingCrypto(null);
    setShowAddModal(false);
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Crypto-monnaies</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Ajouter une crypto-monnaie
        </button>
      </div>

      {/* Liste des crypto-monnaies */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">NOM</th>
                <th className="py-3 px-6 text-left">SYMBOLE</th>
                <th
                  className="py-3 px-6 text-right cursor-pointer"
                  onClick={toggleSortOrder}
                >
                  PRIX {sortOrder === "desc" ? "▼" : "▲"}
                </th>
                <th className="py-3 px-6 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {cryptos.map((crypto) => (
                <tr
                  key={crypto.id_crypto}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-6 text-left font-medium">
                    {crypto.rank}
                  </td>
                  <td className="py-3 px-6 text-left">{crypto.nom}</td>
                  <td className="py-3 px-6 text-left">{crypto.symbol}</td>
                  <td className="py-3 px-6 text-right">
                    {parseFloat(crypto.prix).toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(crypto)}
                        className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(crypto.id_crypto)}
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
      </div>

      {/* Modal d'ajout/édition */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingCrypto
                ? "Modifier la crypto-monnaie"
                : "Ajouter une crypto-monnaie"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="nom">
                  Nom
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="symbol">
                  Symbole
                </label>
                <input
                  id="symbol"
                  name="symbol"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.symbol}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="prix">
                  Prix (EUR)
                </label>
                <input
                  id="prix"
                  name="prix"
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.prix}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {editingCrypto ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Link to="/admin" className="text-blue-500 hover:underline">
          &larr; Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
};

export default ManageCrypto;
