// models/Panier.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Panier = sequelize.define(
    "Panier",
    {
      id_panier: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_panier",
      },
      utilisateurID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "utilisateur",
          key: "id_utilisateur",
        },
        field: "utilisateurID",
      },
      cryptoID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "crypto",
          key: "id_crypto",
        },
        field: "cryptoID",
      },
      quantite: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "panier",
      timestamps: true,
    }
  );

  return Panier;
};
