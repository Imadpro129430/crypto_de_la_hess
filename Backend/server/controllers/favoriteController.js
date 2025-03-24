// controllers/favoriteController.js
const db = require("../config/db");
const Favoris = db.Favoris;
const Crypto = db.Crypto;

// Ajouter une cryptomonnaie aux favoris
exports.addFavorite = async (req, res) => {
  try {
    const { cryptoId } = req.body;
    const userId = req.user.id;

    // Vérifier si la cryptomonnaie existe
    const crypto = await Crypto.findByPk(cryptoId);
    if (!crypto) {
      return res.status(404).json({ message: "Cryptomonnaie non trouvée" });
    }

    // Vérifier si déjà en favoris
    const existingFavorite = await Favoris.findOne({
      where: {
        utilisateurID: userId,
        cryptoID: cryptoId,
      },
    });

    if (existingFavorite) {
      return res
        .status(400)
        .json({ message: "Cette cryptomonnaie est déjà dans vos favoris" });
    }

    // Ajouter aux favoris
    const favorite = await Favoris.create({
      utilisateurID: userId,
      cryptoID: cryptoId,
    });

    res.status(201).json({
      message: "Ajouté aux favoris avec succès",
      favorite,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout aux favoris:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer les favoris d'un utilisateur
exports.getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await Favoris.findAll({
      where: { utilisateurID: userId },
      include: [{ model: Crypto }],
    });

    res.status(200).json(favorites);
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer un favori
exports.removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const favorite = await Favoris.findOne({
      where: {
        id_favoris: id,
        utilisateurID: userId,
      },
    });

    if (!favorite) {
      return res.status(404).json({ message: "Favori non trouvé" });
    }

    await favorite.destroy();

    res.status(200).json({ message: "Favori supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du favori:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
