// middleware/adminAuth.js
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const Admin = db.Admin;

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

    // Vérifier que c'est bien un admin
    if (!decoded.isAdmin) {
      return res
        .status(403)
        .json({ message: "Accès refusé. Privilèges administrateur requis." });
    }

    // Vérifier que l'admin existe toujours
    const admin = await Admin.findByPk(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: "Administrateur non trouvé." });
    }

    // Ajouter l'admin à la requête
    req.admin = {
      id: admin.id_admin,
      email: admin.email,
      nom: admin.nom,
    };

    next();
  } catch (error) {
    console.error("Erreur d'authentification admin:", error);
    res.status(401).json({ message: "Token invalide ou expiré." });
  }
};
