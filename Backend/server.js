// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./server/config/db"); // Routes
const authRoutes = require("./server/routes/authRoutes");
const cryptoRoutes = require("./server/routes/cryptoRoutes");
const favoriteRoutes = require("./server/routes/favoriteRoutes");
const cartRoutes = require("./server/routes/cartRoutes");
const adminRoutes = require("./server/routes/adminRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/cryptos", cryptoRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API Crypto App - Serveur en ligne");
});

// Synchronisation avec la base de données
db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Base de données synchronisée");
  })
  .catch((err) => {
    console.error("Erreur de synchronisation avec la base de données:", err);
  });

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
