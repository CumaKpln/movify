const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Actor = sequelize.define(
  "actors",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: false,
  }
);

module.exports = Actor;
