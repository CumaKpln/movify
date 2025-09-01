module.exports = {
  HOST: process.env.SESSION_DATABASE_HOST,
  USER: process.env.SESSION_DATABASE_USER,
  PASSWORD: process.env.SESSION_DATABASE_PASSWORD,
  DB: process.env.SESSION_DATABASE_NAME,
  dialect: process.env.SESSION_DATABASE_DIALECT,
};
