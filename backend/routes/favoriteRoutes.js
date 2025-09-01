const express = require("express");
const router = express.Router();
const favoriteController = require("../controller/favoriteController");

// POST /api/favorites/:userId → kullanıcının favorilerine film ekle
router.post("/:userId", favoriteController.addFavorite);

// Kullanıcının favori filmleri
router.get("/:userId", favoriteController.getUserFavorites);

//favori delete
router.delete("/:movieId", favoriteController.removeFavorite);

module.exports = router;
