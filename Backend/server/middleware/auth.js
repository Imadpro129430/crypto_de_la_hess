// middleware/auth.js
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const User = db.User;

module.exports = async (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Accès refusé. Aucun token fourni." });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier que l'utilisateur existe toujours
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé." });
    }

    // Ajouter l'utilisateur à la requête
    req.user = {
      id: user.id_utilisateur,
      email: user.email,
      nom: user.nom,
    };

    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    res.status(401).json({ message: "Token invalide ou expiré." });
  }
};
