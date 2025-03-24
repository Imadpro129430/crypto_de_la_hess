// models/Crypto.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Crypto = sequelize.define(
    "Crypto",
    {
      id_crypto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id_crypto",
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      symbol: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prix: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: false,
      },
    },
    {
      tableName: "crypto",
      timestamps: true,
    }
  );

  return Crypto;
};
