import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // S'assurer que nous extrayons la bonne fonction
  const { loginAdmin } = useContext(AuthContext);

  // Pour débogage - vérifions que loginAdmin est bien une fonction
  console.log("Type de loginAdmin:", typeof loginAdmin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    // Format des données pour le débogage
    const credentials = { email, password };
    console.log("AdminLogin: Données exactes envoyées:", credentials);
    console.log("AdminLogin: JSON stringify:", JSON.stringify(credentials));

    try {
      console.log("AdminLogin: Appel de loginAdmin");
      const result = await loginAdmin(credentials);
      console.log("AdminLogin: Résultat de loginAdmin", result);

      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      console.error("Erreur dans handleSubmit:", err);
      setError("Une erreur inattendue s'est produite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Connexion Administrateur
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p>adresse : admin@example.com mdp : admin123</p>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? "Connexion en cours..." : "Connexion Administrateur"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p>
            <Link to="/login" className="text-blue-500 hover:underline">
              Retour à la connexion utilisateur
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
