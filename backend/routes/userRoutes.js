const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

// Tüm kullanıcıları getir
router.get("/", userController.getAllUsers);

// Tek bir kullanıcıyı id ile getir
router.get("/:id", userController.getUserById);

// Kullanıcıya ait filmleri getir
router.get("/:id/movies", userController.getUserMovies);

// Yeni kullanıcı oluştur
router.post("/", userController.createUser);

// Kullanıcıyı güncelle
router.put("/:id", userController.updateUser);

// Kullanıcıya ait filmleri getir
router.get("/:id/movies", async (req, res) => {
  try {
    const Movie = require("../models/relationship");
    const movies = await Movie.findAll({ where: { userId: req.params.id } });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Filmler alınamadı" });
  }
});

// Kullanıcıya ait filmi sil
router.delete("/:userId/movies/:movieId", userController.deleteUserMovie);

// Kullanıcıyı sil
router.delete("/:userId", userController.deleteUser);

module.exports = router;
