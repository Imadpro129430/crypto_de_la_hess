import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si un token existe dans le localStorage
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("user");
    const adminInfo = localStorage.getItem("admin");

    if (token && userInfo) {
      setUser(JSON.parse(userInfo));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else if (token && adminInfo) {
      setAdmin(JSON.parse(adminInfo));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  // Inscription utilisateur
  const register = async (userData) => {
    try {
      const response = await api.post("/api/auth/register", userData);

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
      navigate("/dashboard");

      return { success: true };
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Erreur lors de l'inscription",
      };
    }
  };

  // Connexion utilisateur
  const login = async (credentials) => {
    console.log("Fonction login UTILISATEUR appelée avec", credentials);
    try {
      console.log("Envoi de la requête à /api/auth/login");
      const response = await api.post("/api/auth/login", credentials);

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
      navigate("/dashboard");

      return { success: true };
    } catch (error) {
      console.error("Erreur de connexion:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Identifiants incorrects",
      };
    }
  };

  // Connexion admin
  const loginAdmin = async (credentials) => {
    console.log("Fonction loginAdmin ADMINISTRATEUR appelée avec", credentials);
    console.log("Format JSON envoyé:", JSON.stringify(credentials));

    // Vérifier que les données sont bien formatées
    if (!credentials.email || !credentials.password) {
      console.error("Données de connexion admin incomplètes");
      return {
        success: false,
        message: "Email et mot de passe requis",
      };
    }

    try {
      // Vérifier les headers avant l'envoi
      console.log("Headers avant envoi:", api.defaults.headers);
      console.log("Envoi de la requête à /api/admin/login");

      const response = await api.post("/api/admin/login", credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Réponse reçue:", response.data);

      const { token, admin } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("admin", JSON.stringify(admin));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setAdmin(admin);
      navigate("/admin");

      return { success: true };
    } catch (error) {
      console.error("Erreur de connexion admin:", error);
      console.error("Détails de l'erreur:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      return {
        success: false,
        message: error.response?.data?.message || "Identifiants incorrects",
      };
    }
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");

    delete api.defaults.headers.common["Authorization"];

    setUser(null);
    setAdmin(null);

    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        register,
        login,
        loginAdmin,
        logout,
        isAuthenticated: !!user,
        isAdmin: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
