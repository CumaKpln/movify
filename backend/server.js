const express = require("express");
const sequelize = require("./db");
const categoryRoutes = require("./routes/categoryRoutes");
const movieRoutes = require("./routes/movieRoutes");
const actorRoutes = require("./routes/actorRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
require("./models/relationship");

const Redis = require("ioredis");
require("dotenv").config();

const cors = require("cors");

const app = express();
exports.app = app;
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Redis setup
const redis = new Redis();
exports.redis = redis;

// ----------------- API ROUTES -----------------
app.get("/", (req, res) => res.send("Backend çalışıyor!"));
app.use("/api/movies", movieRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/movies_actors", actorRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoriteRoutes);

// ----------------- START SERVER -----------------
const PORT = 5000;
sequelize
  .sync({ alter: true })
  .then(() => console.log("DB bağlantısı sağlandı!"))
  .then(() =>
    app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor 🚀`))
  )
  .catch((err) => console.error(err));
