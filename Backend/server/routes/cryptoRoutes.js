// routes/cryptoRoutes.js
const express = require("express");
const router = express.Router();
const cryptoController = require("../controllers/cryptoController");

// Routes pour les cryptomonnaies (accessibles sans authentification)
router.get("/", cryptoController.getAllCryptos);
router.get("/search", cryptoController.searchCryptos);
router.get("/:id", cryptoController.getCryptoById);

module.exports = router;
