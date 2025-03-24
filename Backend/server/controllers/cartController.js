
// controllers/cartController.js
const db = require('../config/db');
const Panier = db.Panier;
const Crypto = db.Crypto;

// Ajouter au panier
exports.addToCart = async (req, res) => {
  try {
    const { cryptoId, quantite } = req.body;
    const userId = req.user.id;

    // Vérifier si la cryptomonnaie existe
    const crypto = await Crypto.findByPk(cryptoId);
    if (!crypto) {
      return res.status(404).json({ message: 'Cryptomonnaie non trouvée' });
    }

    // Vérifier si déjà dans le panier
    let cartItem = await Panier.findOne({
      where: {
        utilisateurID: userId,
        cryptoID: cryptoId
      }
    });

    if (cartItem) {
      // Mettre à jour la quantité
      cartItem.quantite = parseFloat(quantite);
      await cartItem.save();
    } else {
      // Ajouter un nouvel élément au panier
      cartItem = await Panier.create({
        utilisateurID: userId,
        cryptoID: cryptoId,
        quantite: parseFloat(quantite)
      });
    }

    res.status(200).json({
      message: 'Panier mis à jour avec succès',
      cartItem
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer le panier d'un utilisateur
exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Panier.findAll({
      where: { utilisateurID: userId },
      include: [{ model: Crypto }]
    });

    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour la quantité dans le panier
exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantite } = req.body;
    const userId = req.user.id;

    const cartItem = await Panier.findOne({
      where: {
        id_panier: id,
        utilisateurID: userId
      }
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Élément du panier non trouvé' });
    }

    cartItem.quantite = parseFloat(quantite);
    await cartItem.save();

    res.status(200).json({
      message: 'Quantité mise à jour avec succès',
      cartItem
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du panier:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un élément du panier
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const cartItem = await Panier.findOne({
      where: {
        id_panier: id,
        utilisateurID: userId
      }
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Élément du panier non trouvé' });
    }

    await cartItem.destroy();

    res.status(200).json({ message: 'Élément supprimé du panier avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du panier:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};