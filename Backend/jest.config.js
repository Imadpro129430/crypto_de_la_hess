// jest.config.js
module.exports = {
  // Indique les répertoires où Jest doit chercher les fichiers
  roots: ["<rootDir>/tests", "<rootDir>/server"],
  // Modèle pour les noms de fichiers de test
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  // Environnement de test
  testEnvironment: "node",
  // Ignorer les node_modules
  testPathIgnorePatterns: ["/node_modules/"],
  // Définir des alias de modules (si nécessaire)
  moduleNameMapper: {
    "^@/server/(.*)$": "<rootDir>/server/$1",
    "^@/config/(.*)$": "<rootDir>/server/config/$1",
    "^@/controllers/(.*)$": "<rootDir>/server/controllers/$1",
  },
};
