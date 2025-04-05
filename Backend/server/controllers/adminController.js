// controllers/adminController.js
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const Admin = db.Admin;
const User = db.User;
const Crypto = db.Crypto;

// Authentification admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Recherche de l'admin
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Comparaison directe du mot de passe (à remplacer par bcrypt en production)
    if (password !== admin.mdp) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { id: admin.id_admin, email: admin.email, isAdmin: true },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Connexion admin réussie",
      token,
      admin: {
        id: admin.id_admin,
        nom: admin.nom,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion admin:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Gestion des cryptomonnaies

// Récupérer toutes les cryptomonnaies
exports.getAllCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.findAll({
      order: [["prix", "DESC"]], // Trier par prix décroissant
    });
    res.status(200).json(cryptos);
  } catch (error) {
    console.error("Erreur lors de la récupération des cryptomonnaies:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Ajouter une cryptomonnaie
exports.addCrypto = async (req, res) => {
  try {
    const { nom, symbol, prix } = req.body;

    const crypto = await Crypto.create({
      nom,
      symbol,
      prix: parseFloat(prix),
    });

    res.status(201).json({
      message: "Cryptomonnaie ajoutée avec succès",
      crypto,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la cryptomonnaie:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mettre à jour une cryptomonnaie
exports.updateCrypto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, symbol, prix } = req.body;

    const crypto = await Crypto.findByPk(id);
    if (!crypto) {
      return res.status(404).json({ message: "Cryptomonnaie non trouvée" });
    }

    // Mise à jour avec les nouvelles valeurs
    await crypto.update({
      nom: nom || crypto.nom,
      symbol: symbol || crypto.symbol,
      prix: prix ? parseFloat(prix) : crypto.prix,
    });

    res.status(200).json({
      message: "Cryptomonnaie mise à jour avec succès",
      crypto,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la cryptomonnaie:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer une cryptomonnaie
exports.deleteCrypto = async (req, res) => {
  try {
    const { id } = req.params;

    const crypto = await Crypto.findByPk(id);
    if (!crypto) {
      return res.status(404).json({ message: "Cryptomonnaie non trouvée" });
    }

    await crypto.destroy();

    res.status(200).json({ message: "Cryptomonnaie supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la cryptomonnaie:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Gestion des utilisateurs

// Obtenir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await user.destroy();

    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
