import axios from "axios";

// Création de l'instance axios avec configuration de base
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 secondes de timeout
});

// Log de configuration pour débogage
console.log("Configuration API:", {
  baseURL: api.defaults.baseURL,
  headers: api.defaults.headers,
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    // Log de la requête pour débogage
    console.log(`Requête ${config.method.toUpperCase()} vers ${config.url}`);

    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("Token ajouté aux headers");
    }

    // S'assurer que le Content-Type est toujours défini pour les requêtes POST
    if (config.method === "post" && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
      console.log("Content-Type ajouté: application/json");
    }

    // Log pour voir les données envoyées
    if (config.data) {
      console.log("Données envoyées:", config.data);
    }

    return config;
  },
  (error) => {
    console.error("Erreur dans l'intercepteur de requête:", error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => {
    console.log(
      `Réponse de ${response.config.url} avec statut ${response.status}`
    );
    return response;
  },
  (error) => {
    console.error("Erreur API:", error.message);

    if (error.response) {
      console.error("Détails de l'erreur:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });

      if (error.response.status === 401) {
        // Token expiré ou invalide
        console.log("Erreur 401: Authentification requise - Déconnexion");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("admin");
        window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("Pas de réponse reçue:", error.request);
    }

    return Promise.reject(error);
  }
);

export default api;
