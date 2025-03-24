// controllers/adminController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Importation JWT
const db = require("../config/db");
const Admin = db.Admin;
const User = db.User;
const Crypto = db.Crypto;

// Authentification admin
exports.loginAdmin = async (req, res) => {
  try {
    // Ajout de logs détaillés
    console.log("=== REQUÊTE ADMIN LOGIN ===");
    console.log("Headers:", req.headers);
    console.log("Body complet:", req.body);
    console.log("Content-Type:", req.headers["content-type"]);

    const { email, password } = req.body;
    console.log("Tentative de connexion admin - Email:", email);
    console.log(
      "Tentative de connexion admin - Password:",
      password ? "[PRÉSENT]" : "[MANQUANT]"
    );

    if (!email || !password) {
      console.log("Erreur: Email ou mot de passe manquant");
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      console.log("Admin non trouvé avec cet email:", email);
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    console.log("Admin trouvé dans la DB:", {
      id: admin.id_admin,
      email: admin.email,
      nom: admin.nom,
    });

    // Pour le développement seulement - comparaison directe du mot de passe
    const isMatch = password === admin.mdp;
    // const isMatch = await bcrypt.compare(password, admin.mdp); // Version originale

    console.log("Mot de passe stocké en DB:", admin.mdp);
    console.log("Mot de passe fourni:", password);
    console.log(
      "Vérification du mot de passe:",
      isMatch ? "RÉUSSIE" : "ÉCHOUÉE"
    );

    if (!isMatch) {
      console.log("Échec d'authentification: Mot de passe incorrect");
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Création du token JWT
    console.log("Création du token JWT");
    const tokenPayload = {
      id: admin.id_admin,
      email: admin.email,
      isAdmin: true,
    };
    console.log("Payload du token:", tokenPayload);

    // Vérifier que jwt est bien défini
    if (typeof jwt !== "object" || typeof jwt.sign !== "function") {
      console.error("ERREUR CRITIQUE: jwt n'est pas correctement défini");
      return res.status(500).json({ message: "Erreur serveur avec JWT" });
    }

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || "default_secret_key_for_development", // Clé par défaut pour développement
      { expiresIn: "1d" }
    );

    console.log("Token JWT créé avec succès");

    // Envoi de la réponse
    const response = {
      message: "Connexion admin réussie",
      token,
      admin: {
        id: admin.id_admin,
        nom: admin.nom,
        email: admin.email,
      },
    };
    console.log("Réponse envoyée:", response);

    res.status(200).json(response);
  } catch (error) {
    console.error("ERREUR lors de la connexion admin:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({
      message: "Erreur serveur",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Ajouter une cryptomonnaie
exports.addCrypto = async (req, res) => {
  try {
    const { nom, symbol, prix } = req.body;

    const crypto = await Crypto.create({
      nom,
      symbol,
      prix,
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

    await crypto.update({
      nom: nom || crypto.nom,
      symbol: symbol || crypto.symbol,
      prix: prix || crypto.prix,
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
