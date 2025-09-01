const express = require("express");
const router = express.Router();
const actorController = require("../controller/actorController");

// GET /api/actors/:id → movieId'ye ait aktörleri döner
router.get("/:id", actorController.getActorsByMovieId);

// POST /api/actors/with-movies → yeni oyuncu ve oynadığı filmleri ekler
router.post("/with-movies", actorController.createActorWithMovies);

// GET /api/actors/:id/movies → oyuncunun oynadığı filmleri döner
router.get("/:id/movies", actorController.getActorMovies);

// PUT Oyuncu güncelleme
router.put("/:id", actorController.updateActor);

module.exports = router;

