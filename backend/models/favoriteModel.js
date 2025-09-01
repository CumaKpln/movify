    const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./userModel");
const Movie = require("./movieModel");

const Favorite = sequelize.define(
  "favorites",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Movie, key: "id" },
    },
  },
  {
    timestamps: false,
  }
);


// Film ilişkisi eklenmeli, yoksa include ile film detayları çekilemez
Favorite.belongsTo(Movie, { foreignKey: "movieId", as: "movie" });
module.exports = Favorite;
