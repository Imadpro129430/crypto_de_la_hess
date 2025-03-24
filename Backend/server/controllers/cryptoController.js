// controllers/cryptoController.js
const db = require("../config/db");
const Crypto = db.Crypto;
const { Op } = require("sequelize");

// Récupérer toutes les cryptomonnaies
exports.getAllCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.findAll();
    res.status(200).json(cryptos);
  } catch (error) {
    console.error("Erreur lors de la récupération des cryptomonnaies:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer une cryptomonnaie par ID
exports.getCryptoById = async (req, res) => {
  try {
    const crypto = await Crypto.findByPk(req.params.id);
    if (!crypto) {
      return res.status(404).json({ message: "Cryptomonnaie non trouvée" });
    }
    res.status(200).json(crypto);
  } catch (error) {
    console.error("Erreur lors de la récupération de la cryptomonnaie:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Rechercher des cryptomonnaies
exports.searchCryptos = async (req, res) => {
  try {
    const { query } = req.query;
    const cryptos = await Crypto.findAll({
      where: {
        [Op.or]: [
          { nom: { [Op.like]: `%${query}%` } },
          { symbol: { [Op.like]: `%${query}%` } },
        ],
      },
    });
    res.status(200).json(cryptos);
  } catch (error) {
    console.error("Erreur lors de la recherche des cryptomonnaies:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
