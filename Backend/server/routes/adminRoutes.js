// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

// Route de connexion admin (sans authentification)
router.post("/login", adminController.loginAdmin);

// Routes protégées par authentification admin
router.use(adminAuth);

// Gestion des cryptomonnaies - TEMPORAIREMENT COMMENTÉ
// router.post("/crypto", adminController.addCrypto);
// router.put("/crypto/:id", adminController.updateCrypto);
// router.delete("/crypto/:id", adminController.deleteCrypto);

// Routes de gestion des cryptomonnaies
router.post("/crypto", adminController.addCrypto);
router.put("/crypto/:id", adminController.updateCrypto);
router.delete("/crypto/:id", adminController.deleteCrypto);
router.get("/cryptos", adminController.getAllCryptos); // Ajout d'une route pour récupérer toutes les cryptos

// Gestion des utilisateurs
router.get("/users", adminController.getAllUsers);
router.delete("/users/:id", adminController.deleteUser);

module.exports = router;
