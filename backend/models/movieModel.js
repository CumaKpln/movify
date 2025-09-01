const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Movie = sequelize.define(
  "movies",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    subject: { type: DataTypes.TEXT, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    categoryId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: false,
  }
);

module.exports = Movie;
