// routes/favoriteRoutes.js
const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");
const auth = require("../middleware/auth");

// Routes pour les favoris (authentification requise)
router.use(auth);
router.get("/", favoriteController.getUserFavorites);
router.post("/", favoriteController.addFavorite);
router.delete("/:id", favoriteController.removeFavorite);

module.exports = router;
