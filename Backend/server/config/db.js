// config/db.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modèles
db.User = require("../models/User")(sequelize);
db.Admin = require("../models/Admin")(sequelize);
db.Crypto = require("../models/Crypto")(sequelize);
db.Favoris = require("../models/Favorite")(sequelize);
db.Panier = require("../models/Cart")(sequelize);

// Relations
db.User.hasMany(db.Favoris, { foreignKey: "utilisateurID" });
db.Favoris.belongsTo(db.User, { foreignKey: "utilisateurID" });

db.Crypto.hasMany(db.Favoris, { foreignKey: "cryptoID" });
db.Favoris.belongsTo(db.Crypto, { foreignKey: "cryptoID" });

db.User.hasMany(db.Panier, { foreignKey: "utilisateurID" });
db.Panier.belongsTo(db.User, { foreignKey: "utilisateurID" });

db.Crypto.hasMany(db.Panier, { foreignKey: "cryptoID" });
db.Panier.belongsTo(db.Crypto, { foreignKey: "cryptoID" });

module.exports = db;
