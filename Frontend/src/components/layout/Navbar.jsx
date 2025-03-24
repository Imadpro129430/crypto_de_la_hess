// src/components/layout/Navbar.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, admin, logout } =
    useContext(AuthContext);

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div>
            <Link to="/" className="text-xl font-bold">
              Crypto de la Hess
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-200">
              Accueil
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="hover:text-blue-200">
                  Tableau de bord
                </Link>
                <Link to="/favorites" className="hover:text-blue-200">
                  Favoris
                </Link>
                <Link to="/cart" className="hover:text-blue-200">
                  Panier
                </Link>
              </>
            )}

            {isAdmin && (
              <Link to="/admin" className="hover:text-blue-200">
                Administration
              </Link>
            )}

            <div className="ml-4">
              {isAuthenticated || isAdmin ? (
                <div className="flex items-center space-x-4">
                  <span>Bonjour, {isAdmin ? admin?.nom : user?.nom}</span>
                  <button
                    onClick={logout}
                    className="bg-white text-blue-600 py-1 px-3 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {" "}
                  <Link
                    to="/login"
                    className="bg-white text-blue-600 py-1 px-3 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-500 text-white py-1 px-3 rounded-md border border-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
