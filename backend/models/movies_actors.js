const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const movies_actors = sequelize.define(
  "movies_actors",
  {
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "movies",
        key: "id",
      },
      onDelete: "CASCADE", // 🔹 movie silindiğinde join tablodan da silinsin
    },
    actorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "actors",
        key: "id",
      },
      onDelete: "CASCADE", // 🔹 actor silindiğinde join tablodan da silinsin
    },
  },
  {
    timestamps: false,
  }
);

module.exports = movies_actors;
