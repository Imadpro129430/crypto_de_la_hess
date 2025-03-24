// src/components/admin/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Tableau de bord administrateur
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">
              Gestion des Crypto-monnaies
            </h3>
            <p className="text-gray-600 mb-4">
              Ajouter, modifier ou supprimer des crypto-monnaies dans le
              système.
            </p>
            <Link
              to="/admin/cryptos"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 inline-block"
            >
              Gérer les crypto-monnaies
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Gestion des Utilisateurs</h3>
            <p className="text-gray-600 mb-4">
              Voir et gérer les comptes utilisateurs de la plateforme.
            </p>
            <Link
              to="/admin/users"
              className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 inline-block"
            >
              Gérer les utilisateurs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
