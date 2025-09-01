const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define(
  "users",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: false },
    password: { type: DataTypes.STRING, allowNull: false },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = User;
