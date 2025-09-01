// db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.SESSION_DATABASE_NAME, // veritabanı adı
  process.env.SESSION_DATABASE_USER, // kullanıcı
  process.env.SESSION_DATABASE_PASSWORD, // şifre
  {
    host: process.env.SESSION_DATABASE_HOST,
    dialect: process.env.SESSION_DATABASE_DIALECT, // <- burası zorunlu
  }
);

module.exports = sequelize;
