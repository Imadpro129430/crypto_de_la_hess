// models/Favoris.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Favoris = sequelize.define(
    "Favoris",
    {
      id_favoris: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_favoris",
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
      utilisateurID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "utilisateur",
          key: "id_utilisateur",
        },
        field: "utilisateurID",
      },
    },
    {
      tableName: "favoris",
      timestamps: true,
    }
  );

  return Favoris;
};
